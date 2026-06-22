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

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import base64
import logging
from .models import InputSchema, OutputSchema
from .azure_client import Settings, AzureContentUnderstandingClient

logger = logging.getLogger("uvicorn.error")

router = APIRouter()


@router.post("/analyzepdf")
async def analyze_pdf(file: UploadFile = File(...)):
    try:
        # Load runtime settings (endpoint/version/auth/analyzer_id)
        settings = Settings.from_environment()
        client = AzureContentUnderstandingClient(
            endpoint=settings.endpoint,
            api_version=settings.api_version,
            subscription_key=settings.subscription_key,
            token_provider=settings.token_provider
        )
        # CU analyze is async: begin -> poll until succeeded/failed
        response = client.begin_analyze(analyzer_id=settings.analyzer_id, file_data=await file.read())
        result = client.poll_result(response)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error in /analyzepdf: {e}")
        raise HTTPException(status_code=500, detail="Error processing file")


@router.post("/process-invoice/", response_model=OutputSchema)
async def process_invoice(input_data: InputSchema):
    try:
        # Power Automate sends the PDF as base64 in JSON
        pdf_content = base64.b64decode(input_data.file_content)
        settings = Settings.from_environment()
        client = AzureContentUnderstandingClient(
            endpoint=settings.endpoint,
            api_version=settings.api_version,
            subscription_key=settings.subscription_key,
            token_provider=settings.token_provider
        )
        result = client.poll_result(client.begin_analyze(settings.analyzer_id, pdf_content))
        fields = result.get("result", {}).get("contents", [{}])[0].get("fields", {})

        # Extract only keys defined in OutputSchema.
        # CU fields can appear as valueString/valueNumber/valueDate depending on the trained schema.
        clean_fields = {
            key: (
                value.get("valueString")
                or value.get("valueNumber")
                or value.get("valueDate")
            )
            for key, value in fields.items()
            if key in OutputSchema.__annotations__
        }

        return OutputSchema(**clean_fields)

    except Exception as e:
        logger.error(f"Error in /process-invoice: {e}")
        raise HTTPException(status_code=500, detail="Error processing invoice")
