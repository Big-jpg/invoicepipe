"""
API routes for invoice processing.

Two entrypoints are provided:
1) POST /analyzepdf
   - multipart/form-data upload
   - returns raw Azure Content Understanding JSON (useful for debugging/training)

2) POST /process-invoice/
   - JSON payload containing base64 PDF bytes
   - returns a clean OutputSchema with only the fields the automation expects
"""

import base64
import logging
import uuid
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Request, Header
from fastapi.responses import JSONResponse

from .models import InputSchema, OutputSchema
from .azure_client import Settings, AzureContentUnderstandingClient

logger = logging.getLogger(__name__)

router = APIRouter()

# 20 MB file size limit
MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024

# PDF magic bytes
PDF_MAGIC = b"%PDF"


def _get_correlation_id(x_correlation_id: Optional[str] = None) -> str:
    """Return the provided correlation ID or generate a new UUID."""
    return x_correlation_id if x_correlation_id else str(uuid.uuid4())


def _log(level: int, message: str, correlation_id: str, **kwargs) -> None:
    """Emit a structured log message with correlation context."""
    logger.log(level, message, extra={"correlation_id": correlation_id}, **kwargs)


def _error_response(status_code: int, detail: str, correlation_id: str) -> JSONResponse:
    """Build a typed error JSONResponse with correlation ID header."""
    return JSONResponse(
        status_code=status_code,
        content={"detail": detail, "correlation_id": correlation_id},
        headers={"X-Correlation-ID": correlation_id},
    )


def _success_response(content: dict, correlation_id: str) -> JSONResponse:
    """Build a success JSONResponse with correlation ID header."""
    return JSONResponse(
        status_code=200,
        content=content,
        headers={"X-Correlation-ID": correlation_id},
    )


@router.post("/analyzepdf")
async def analyze_pdf(
    request: Request,
    file: UploadFile = File(...),
    x_correlation_id: Optional[str] = Header(None, alias="X-Correlation-ID"),
):
    correlation_id = _get_correlation_id(x_correlation_id)
    _log(logging.INFO, f"POST /analyzepdf received file={file.filename}", correlation_id)

    # --- Input validation ---
    # MIME type check
    if file.content_type and file.content_type != "application/pdf":
        _log(logging.WARNING, f"Rejected non-PDF MIME type: {file.content_type}", correlation_id)
        return _error_response(400, f"Invalid MIME type '{file.content_type}'. Only application/pdf is accepted.", correlation_id)

    file_data = await file.read()

    # Empty file check
    if not file_data:
        _log(logging.WARNING, "Rejected empty file upload", correlation_id)
        return _error_response(400, "Empty file. Please provide a valid PDF.", correlation_id)

    # File size check
    if len(file_data) > MAX_FILE_SIZE_BYTES:
        _log(logging.WARNING, f"Rejected oversized file: {len(file_data)} bytes", correlation_id)
        return _error_response(400, f"File too large ({len(file_data)} bytes). Maximum allowed is {MAX_FILE_SIZE_BYTES} bytes (20MB).", correlation_id)

    # PDF magic bytes check
    if not file_data[:4].startswith(PDF_MAGIC):
        _log(logging.WARNING, "Rejected file: missing PDF magic bytes", correlation_id)
        return _error_response(400, "File does not appear to be a valid PDF.", correlation_id)

    # --- Processing ---
    try:
        settings = Settings.from_environment()
        client = AzureContentUnderstandingClient(
            endpoint=settings.endpoint,
            api_version=settings.api_version,
            subscription_key=settings.subscription_key,
            token_provider=settings.token_provider,
        )
        _log(logging.INFO, "Submitting document to Azure Content Understanding", correlation_id)
        response = client.begin_analyze(analyzer_id=settings.analyzer_id, file_data=file_data)
        result = client.poll_result(response)
        _log(logging.INFO, "Successfully received CU result", correlation_id)
        return _success_response(result, correlation_id)

    except TimeoutError:
        _log(logging.ERROR, "Azure CU polling timed out", correlation_id)
        return _error_response(408, "Azure Content Understanding polling exceeded maximum wait time.", correlation_id)

    except RuntimeError as e:
        _log(logging.ERROR, f"Azure CU returned failure: {e}", correlation_id)
        return _error_response(502, "Azure Content Understanding returned an error or failed status.", correlation_id)

    except Exception as e:
        _log(logging.ERROR, f"Unexpected error in /analyzepdf: {e}", correlation_id, exc_info=True)
        return _error_response(502, "Upstream service error while processing document.", correlation_id)


@router.post("/process-invoice/", response_model=OutputSchema)
async def process_invoice(
    input_data: InputSchema,
    request: Request,
    x_correlation_id: Optional[str] = Header(None, alias="X-Correlation-ID"),
):
    correlation_id = _get_correlation_id(x_correlation_id)
    _log(logging.INFO, f"POST /process-invoice/ received filename={input_data.filename}", correlation_id)

    # --- Input validation: decode base64 ---
    try:
        pdf_content = base64.b64decode(input_data.file_content, validate=True)
    except Exception:
        _log(logging.WARNING, "Rejected invalid base64 content", correlation_id)
        return _error_response(400, "Invalid base64 encoding in file_content.", correlation_id)

    # Empty content check
    if not pdf_content:
        _log(logging.WARNING, "Rejected empty decoded content", correlation_id)
        return _error_response(400, "Decoded file content is empty.", correlation_id)

    # File size check
    if len(pdf_content) > MAX_FILE_SIZE_BYTES:
        _log(logging.WARNING, f"Rejected oversized file: {len(pdf_content)} bytes", correlation_id)
        return _error_response(400, f"File too large ({len(pdf_content)} bytes). Maximum allowed is {MAX_FILE_SIZE_BYTES} bytes (20MB).", correlation_id)

    # PDF magic bytes check
    if not pdf_content[:4].startswith(PDF_MAGIC):
        _log(logging.WARNING, "Rejected file: not a valid PDF (missing magic bytes)", correlation_id)
        return _error_response(400, "Decoded content is not a valid PDF. Only PDF files are accepted.", correlation_id)

    # --- Processing ---
    try:
        settings = Settings.from_environment()
        client = AzureContentUnderstandingClient(
            endpoint=settings.endpoint,
            api_version=settings.api_version,
            subscription_key=settings.subscription_key,
            token_provider=settings.token_provider,
        )
        _log(logging.INFO, "Submitting document to Azure Content Understanding", correlation_id)
        result = client.poll_result(client.begin_analyze(settings.analyzer_id, pdf_content))

    except TimeoutError:
        _log(logging.ERROR, "Azure CU polling timed out", correlation_id)
        return _error_response(408, "Azure Content Understanding polling exceeded maximum wait time.", correlation_id)

    except RuntimeError as e:
        _log(logging.ERROR, f"Azure CU returned failure: {e}", correlation_id)
        return _error_response(502, "Azure Content Understanding returned an error or failed status.", correlation_id)

    except Exception as e:
        _log(logging.ERROR, f"Unexpected error in /process-invoice: {e}", correlation_id, exc_info=True)
        return _error_response(502, "Upstream service error while processing document.", correlation_id)

    # --- Extract and validate fields ---
    fields = result.get("result", {}).get("contents", [{}])[0].get("fields", {})

    if not fields:
        _log(logging.WARNING, "CU returned result but no fields extracted", correlation_id)
        return _error_response(422, "Content Understanding returned a result but no fields could be extracted from the document.", correlation_id)

    # Extract only keys defined in OutputSchema.
    # CU fields can appear as valueString/valueNumber/valueDate depending on the trained schema.
    clean_fields = {
        key: (
            value.get("valueString")
            or value.get("valueNumber")
            or value.get("valueDate")
        )
        for key, value in fields.items()
        if key in OutputSchema.model_fields
    }

    if not clean_fields:
        _log(logging.WARNING, "CU returned fields but none matched OutputSchema", correlation_id)
        return _error_response(422, "Content Understanding returned fields but none matched the expected schema.", correlation_id)

    _log(logging.INFO, f"Successfully extracted {len(clean_fields)} fields", correlation_id)
    output = OutputSchema(**clean_fields)
    response_content = output.model_dump(exclude_none=True)
    response_content["correlation_id"] = correlation_id
    return _success_response(response_content, correlation_id)
