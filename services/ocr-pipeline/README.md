# InvoicePipe Extraction Service

> New to the repo? Start with: [READ_ME_FIRST](docs/readme/READ_ME_FIRST.md)

## Overview

A FastAPI microservice that wraps Azure Content Understanding (formerly Document Intelligence) for PDF invoice extraction. The service ingests PDF documents, submits them to a trained custom CU analyzer, and returns structured field data suitable for downstream automation.

Designed for containerized deployment on Azure Container Apps with automated build/deploy via `scripts/deploy/deploy.sh`.

## API Endpoints

### `GET /health`

Liveness probe. Returns 200 if the process is running.

```json
{"status": "healthy", "service": "invoicepipe-extraction", "version": "1.0.0"}
```

### `GET /ready`

Readiness probe. Verifies connectivity to Azure Content Understanding. Returns 200 when ready, 503 when the upstream is unreachable or misconfigured.

### `POST /analyzepdf`

Accepts a PDF via multipart/form-data upload. Returns the raw Azure Content Understanding JSON response (useful for debugging and model training).

### `POST /process-invoice/`

Accepts a JSON payload with base64-encoded PDF bytes. Returns a normalized `OutputSchema` containing only the fields expected by downstream automation.

**Request body:**
```json
{
  "filename": "invoice-001.pdf",
  "file_content": "<base64-encoded PDF>"
}
```

## Error Contract

All error responses include a `correlation_id` field in the body and an `X-Correlation-ID` response header.

| Status | Condition |
|--------|-----------|
| 400 Bad Request | Invalid base64, non-PDF MIME type, file exceeds 20MB, empty file |
| 408 Request Timeout | Azure CU polling exceeded maximum wait time |
| 422 Unprocessable Entity | CU returned a result but required fields are missing from schema |
| 502 Bad Gateway | Azure CU returned an error or failed status |

## Input Validation

Both endpoints enforce:
- **MIME type:** Only `application/pdf` accepted (multipart) or valid PDF magic bytes (base64)
- **File size:** Maximum 20MB
- **PDF validity:** First 4 bytes must be `%PDF`

## Correlation ID

All requests accept an optional `X-Correlation-ID` header. If not provided, a UUID is generated. The correlation ID is:
- Included in all structured log messages
- Returned in the `X-Correlation-ID` response header
- Included in error response bodies

## Structured Logging

All log output is JSON-formatted with fields: `timestamp`, `level`, `logger`, `message`, `correlation_id`.

## Project Structure

```
services/ocr-pipeline/
├── app/
│   ├── __init__.py            # Package init
│   ├── azure_client.py        # Azure Content Understanding REST client
│   ├── health.py              # Health and readiness endpoints
│   ├── logging_config.py      # Structured JSON logging setup
│   ├── main.py                # FastAPI application entrypoint
│   ├── models.py              # Pydantic request/response schemas
│   └── routes.py              # Core API routes with validation
├── docs/                      # Design docs, references, env vars
├── scripts/
│   ├── deploy/                # Dockerfile + deploy.sh
│   ├── load/                  # Environment and vendor data loaders
│   ├── test/                  # PowerShell and Python test scripts
│   └── validate/              # Environment inspection scripts
├── requirements.txt           # Python dependencies
└── custom-invoice-analyzer-id.json  # CU analyzer schema reference
```

## Environment Configuration

Create `.env.local` with:

```bash
CONTENT_UNDERSTANDING_ENDPOINT=https://your-resource.cognitiveservices.azure.com
CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY=your-subscription-key
API_VERSION=2024-12-01-preview
ANALYZER_ID=your-custom-analyzer-id
```

## Local Development

```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Verify the service is running:
```bash
curl http://localhost:8000/health
```

## Deployment

```bash
cd scripts/deploy
chmod +x deploy.sh
./deploy.sh
```

The script builds a Docker image, pushes to Azure Container Registry, and creates/updates the Azure Container App.

## Testing

- `scripts/test/test_local.ps1` — local server
- `scripts/test/test_live.ps1` — deployed container app
- `scripts/test/test_apim.ps1` — via Azure API Management gateway
