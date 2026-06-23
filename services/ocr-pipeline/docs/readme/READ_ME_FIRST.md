# Start Here — InvoicePipe Extraction Service

## What this repo is
A containerised FastAPI microservice that accepts PDF invoices and calls **Azure Content Understanding** to extract fields, returning either:
- raw CU JSON (`POST /analyzepdf`), or
- cleaned structured fields (`POST /process-invoice/`)

See: `docs/api_reference.md` and `docs/architecture.md`.

## The 3 moving parts
1) **API Service (FastAPI)** — `app/main.py`, `app/routes.py`, `app/azure_client.py`
2) **Azure Deployment** — `deploy.sh`, `Dockerfile`, (optional) APIM scripts
3) **DEV Harness / Tests** — `docs/DEV_HARNESS_README.md`, `tests/`, `scripts/`

## Fastest smoke test (local)
1. Create `.env.local` with required variables (see `docs/ENVIRONMENT_VARIABLES.md`)
2. Run:
   - `make dev`
3. In another terminal:
   - `make test-local`

## Fastest smoke test (deployed)
- `make test-live` (direct to container app)
- `make test-apim` (via APIM)

## Where to look when something breaks
- Runtime errors: Azure Container App logs
- Contract failures: `tests/test_contract.py` + `tests/fixtures/`
- Env/config issues: `scripts/load_env_dev.*` and `ocr_env_inspect.sh`

## Key docs
- `docs/api_reference.md` — endpoint details
- `docs/deployment.md` — build/deploy
- `docs/DEV_HARNESS_README.md` — full local/dev workflow
- `docs/power_automate_flow_spec.md` — flow spec
