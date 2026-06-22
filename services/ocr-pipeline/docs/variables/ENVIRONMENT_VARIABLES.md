# Environment Variables

This service reads runtime configuration from environment variables (loaded locally via `.env.local`).

## Core runtime (service -> Azure Content Understanding)
Required:
- `CONTENT_UNDERSTANDING_ENDPOINT`
- `API_VERSION`
- `ANALYZER_ID`

Auth (provide one):
- `CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY` (key-based)
- `CONTENT_UNDERSTANDING_AAD_TOKEN` (token-based, optional alternative)

## DEV harness / tests
Used by harness + PowerShell tests:
- `OCR_LOCAL_BASE_URL`
- `OCR_TEST_FILE_PATH`

Environment endpoints:
- `OCR_DEV_APIM_URL`
- `OCR_DEV_APIM_SUBSCRIPTION_KEY`
- `OCR_DEV_CONTAINER_URL`
- `OCR_PRD_APIM_URL`
- `OCR_PRD_APIM_SUBSCRIPTION_KEY`
- `OCR_PRD_CONTAINER_URL`

See also: `docs/DEV_HARNESS_README.md`
