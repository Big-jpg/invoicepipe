# DEV Environment Harness - Documentation

## Overview

This DEV environment harness provides a complete local development and testing infrastructure for the Contoso Invoice OCR system. It allows developers to work without requiring Azure infrastructure to be deployed, while maintaining compatibility with production configurations.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Configuration](#configuration)
3. [Local Development](#local-development)
4. [Testing](#testing)
5. [Power Automate Flow Simulation](#power-automate-flow-simulation)
6. [Epicor Integration](#epicor-integration)
7. [Environment Inspection](#environment-inspection)
8. [Directory Structure](#directory-structure)

---

## Quick Start

### Prerequisites

- Python 3.8 or later
- PowerShell (for Windows) or pwsh (for Linux/Mac)
- Azure CLI (for environment inspection)
- Git

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/invoicepipe.git
   cd invoice-ocr-pipeline
   ```

2. **Configure DEV environment**:
   ```bash
   # Copy the template and fill in your values
   cp .ocr.dev.env.template .ocr.dev.env
   # Edit .ocr.dev.env with your actual DEV resource IDs
   ```

3. **Start local development server**:
   ```bash
   # Using the helper script
   ./scripts/dev_run.sh
   
   # Or using Make
   make dev
   ```

4. **Run local tests**:
   ```bash
   # In another terminal
   make test-local
   ```

---

## Configuration

### Environment Files

Three environment configuration files are used:

#### `.ocr.dev.env` - DEV Environment Configuration
- Contains DEV Azure resource IDs and configuration
- Used for local development and DEV environment testing
- Template provided with placeholders

#### `.ocr.prd.env` - PRD Environment Configuration
- Contains production Azure resource IDs and configuration
- Used for production deployment and testing
- Should be kept secure and not committed with real credentials

#### `.env.local` - Local Runtime Configuration
- Used by the FastAPI application at runtime
- Can be created from `.env.local.example`
- Contains API keys and endpoints for local development

### Configuration Structure

Each environment file contains:

1. **Azure Infrastructure Targets**: Resource IDs, names, and locations
2. **Runtime Application Config**: API endpoints, keys, and settings
3. **Test Configuration**: URLs and keys for testing

### Loading Configuration

Use the provided helper scripts to load and validate configuration:

```bash
# Bash
source ./scripts/load_env_dev.sh

# Python
python3 ./scripts/load_env_dev.py
```

These scripts will:
- Load environment variables from `.ocr.dev.env`
- Validate that all required variables are present
- Check for placeholder values that need to be replaced
- Display configuration summary

---

## Local Development

### Starting the Development Server

**Option 1: Using the dev_run.sh script**
```bash
./scripts/dev_run.sh
```

This script will:
1. Create a Python virtual environment (if not present)
2. Install dependencies from `requirements.txt`
3. Load environment from `.ocr.dev.env`
4. Start uvicorn with auto-reload enabled

**Option 2: Using Make**
```bash
make dev
```

**Option 3: Manual startup**
```bash
# Create and activate virtualenv
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Load environment
source ./scripts/load_env_dev.sh

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### API Endpoints

Once running, the API is available at:
- **Base URL**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### Available Endpoints

1. **POST /analyzepdf** - Analyze PDF invoice (multipart/form-data)
2. **POST /process-invoice/** - Process invoice with full normalization (JSON)

---

## Testing

### Test Types

The harness includes four types of tests:

#### 1. Local API Tests (`test_local.ps1`)

Tests the local development server.

```powershell
# Run with default settings
pwsh ./tests/test_local.ps1

# Or using Make
make test-local
```

**Configuration**:
- Base URL: `$env:OCR_LOCAL_BASE_URL` (default: http://localhost:8000)
- Test file: `$env:OCR_TEST_FILE_PATH` (default: hardcoded path)

#### 2. Contract Validation Tests (`test_contract.py` / `test_contract.ps1`)

Validates API responses against expected outputs to ensure contract stability.

```bash
# Python version
python3 ./tests/test_contract.py

# PowerShell version
pwsh ./tests/test_contract.ps1

# Or using Make
make test-contract
```

**Setup**:
1. Add sample PDF invoices to `tests/fixtures/`
2. Create corresponding `.expected.json` files with expected outputs
3. Run the test script

**Features**:
- Compares actual API responses to expected JSON
- Allows tolerance for timestamps, GUIDs, and numeric precision
- Provides detailed diff output for failures
- Can be integrated into CI/CD pipeline

#### 3. Live Environment Tests (`test_live.ps1`)

Tests deployed Container App endpoints (DEV or PRD).

```powershell
# Test DEV environment
pwsh ./tests/test_live.ps1 -Environment DEV

# Test PRD environment
pwsh ./tests/test_live.ps1 -Environment PRD
```

**Configuration**:
- DEV URL: `$env:OCR_DEV_CONTAINER_URL`
- PRD URL: `$env:OCR_PRD_CONTAINER_URL`

#### 4. APIM Gateway Tests (`test_apim.ps1`)

Tests APIM gateway endpoints (DEV or PRD).

```powershell
# Test DEV APIM
pwsh ./tests/test_apim.ps1 -Environment DEV

# Test PRD APIM
pwsh ./tests/test_apim.ps1 -Environment PRD
```

**Configuration**:
- DEV APIM URL: `$env:OCR_DEV_APIM_URL`
- DEV APIM Key: `$env:OCR_DEV_APIM_SUBSCRIPTION_KEY`
- PRD APIM URL: `$env:OCR_PRD_APIM_URL`
- PRD APIM Key: `$env:OCR_PRD_APIM_SUBSCRIPTION_KEY`

### Running All Environment Tests

Use the wrapper script to run both live and APIM tests:

```powershell
# Test DEV environment
pwsh ./tests/run_env_tests.ps1 -Environment DEV

# Test PRD environment
pwsh ./tests/run_env_tests.ps1 -Environment PRD
```

This will:
1. Run live Container App tests
2. Run APIM gateway tests
3. Provide a summary of results

---

## Power Automate Flow Simulation

### Overview

The `mock_flow_run.py` script simulates the Power Automate invoice processing flow locally, allowing you to test the complete pipeline without Power Automate or SharePoint.

### How It Works

1. **Watches** `mock_inbox/` directory for new PDF files
2. **Calls** the local DEV API `/process-invoice/` endpoint
3. **Performs** vendor ID lookup using the same logic as Power Automate
4. **Writes** results to `mock_output/invoice_results.csv` (mimicking SharePoint/Excel)

### Usage

**Watch Mode** (continuous monitoring):
```bash
python3 ./scripts/mock_flow_run.py
```

**One-Time Mode** (process current files and exit):
```bash
python3 ./scripts/mock_flow_run.py --once
```

### Testing the Flow

1. **Start the local API server**:
   ```bash
   ./scripts/dev_run.sh
   ```

2. **Start the flow stub** (in another terminal):
   ```bash
   python3 ./scripts/mock_flow_run.py
   ```

3. **Drop PDF files** into `mock_inbox/`:
   ```bash
   cp /path/to/invoice.pdf mock_inbox/
   ```

4. **Check results** in `mock_output/invoice_results.csv`

### Output Schema

The CSV output matches the SharePoint/Excel schema used by Power Automate:

| Field | Description |
|-------|-------------|
| FileName | Original PDF filename |
| ProcessedDate | Processing timestamp |
| InvoiceId | Invoice number |
| InvoiceDate | Invoice issue date |
| VendorName | Vendor name (extracted) |
| VendorNameClassify | Vendor name (classified) |
| VendorId | Epicor Vendor ID (from lookup) |
| CustomerNameClassify | Customer company code (MHS/MCS/MCL) |
| InvoiceTotal | Total amount |
| Status | Success/Error |
| ErrorMessage | Error details (if any) |

### Vendor Lookup

The script includes the same vendor lookup table as Power Automate, mapping:
- **VendorNameClassify** + **CustomerNameClassify** → **Epicor VendorId**

If no match is found, VendorId is set to "UNKNOWN" and flagged for review.

---

## Epicor Integration

### Fetching Vendor Data

The `fetch_epicor_vendorlist.py` script retrieves vendor data from the Epicor BAQ endpoint.

### Configuration

Set environment variables:
```bash
export EPICOR_API_KEY="your_api_key_here"
export EPICOR_BASE_URL="https://erp.contoso.com.au"
export EPICOR_BAQ_NAME="VendorList_OCR"  # Optional, defaults to VendorList_OCR
```

### Usage

```bash
python3 ./scripts/fetch_epicor_vendorlist.py
```

### Output

The script creates two files in the `data/` directory:

1. **`epicor_vendorlist_raw.json`** - Raw JSON response from Epicor
2. **`epicor_vendorlist_clean.csv`** - Normalized CSV with key columns:
   - VendorId
   - VendorName
   - ABN
   - CompanyCode
   - Status
   - Address, City, State, PostalCode
   - Phone, Email

### Using Vendor Data

The clean CSV can be used to:
- Validate vendor classifications from CU API
- Join with invoice processing results
- Populate vendor lookup tables
- Verify ABN matching

---

## Environment Inspection

### Overview

The `ocr_env_inspect.sh` script inspects Azure resources for DEV or PRD environments.

### Prerequisites

- Azure CLI installed and configured
- Logged in with `az login`
- Access to the target subscription

### Usage

**Inspect DEV environment**:
```bash
./ocr_env_inspect.sh --config .ocr.dev.env --env DEV
```

**Inspect PRD environment**:
```bash
./ocr_env_inspect.sh --config .ocr.prd.env --env PRD
```

### What It Checks

The script inspects:
1. **Resource Group** - Existence and location
2. **Container Registry (ACR)** - Login server
3. **Container Apps Environment** - Location
4. **Container App** - Image and FQDN
5. **API Management (APIM)** - Location and SKU
6. **Content Understanding (CU)** - Resource type and kind

### Output

Resources are displayed in a table with status:
- **OK** - Resource exists and is accessible
- **NOT FOUND** - Resource doesn't exist (may not be deployed yet)

The script **does not fail** if resources are not found, making it safe to run against DEV environments during initial setup.

### Example Output

```
==============================================
🔎 Contoso OCR Environment Inspection
==============================================
Environment:       DEV
Resource Group:    contoso-azr-dev-rg
Subscription:      Contoso-DEV
==============================================

TYPE       | NAME                                     | STATUS     | DETAILS
-----------+------------------------------------------+------------+--------------------------------
RG         | contoso-azr-dev-rg                          | NOT FOUND  | Resource group not found (may not be deployed yet)
ACR        | contosoinvoicesregistrydev                 | NOT FOUND  | ACR not found (may not be deployed yet)
...
```

---

## Directory Structure

```
invoice-ocr-pipeline/
├── app/                          # FastAPI application code
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   ├── routes.py
│   └── azure_client.py
├── docs/                         # Documentation
│   ├── DEV_HARNESS_README.md     # This file
│   ├── power_automate_flow_spec.md
│   ├── api_reference.md
│   ├── architecture.md
│   └── ...
├── scripts/                      # Helper scripts
│   ├── load_env_dev.sh           # Load DEV environment (Bash)
│   ├── load_env_dev.py           # Load DEV environment (Python)
│   ├── dev_run.sh                # Start local dev server
│   ├── mock_flow_run.py          # Power Automate flow stub
│   └── fetch_epicor_vendorlist.py # Fetch Epicor vendor data
├── tests/                        # Test scripts
│   ├── fixtures/                 # Test fixtures (PDFs + expected JSON)
│   │   ├── README.md
│   │   └── sample_invoice_01.expected.json
│   ├── test_local.ps1            # Local API tests
│   ├── test_contract.py          # Contract validation (Python)
│   ├── test_contract.ps1         # Contract validation (PowerShell)
│   ├── test_live.ps1             # Live environment tests
│   ├── test_apim.ps1             # APIM gateway tests
│   └── run_env_tests.ps1         # Run all environment tests
├── data/                         # Data files (Epicor vendor lists, etc.)
├── mock_inbox/                   # Drop PDFs here for flow simulation
├── mock_output/                  # Flow simulation output (CSV)
├── .ocr.dev.env                  # DEV environment configuration
├── .ocr.prd.env                  # PRD environment configuration
├── .env.local.example            # Local runtime config template
├── ocr_env_inspect.sh            # Environment inspection script
├── Makefile                      # Convenient make targets
├── requirements.txt              # Python dependencies
├── Dockerfile                    # Container image definition
└── README.md                     # Main project README
```

---

## Common Workflows

### Workflow 1: Local Development

1. Configure `.ocr.dev.env` with your settings
2. Start dev server: `./scripts/dev_run.sh`
3. Make code changes (auto-reload enabled)
4. Test locally: `make test-local`
5. Validate contracts: `make test-contract`

### Workflow 2: Testing Power Automate Logic

1. Start dev server: `./scripts/dev_run.sh`
2. Start flow stub: `python3 ./scripts/mock_flow_run.py`
3. Drop test PDFs into `mock_inbox/`
4. Review results in `mock_output/invoice_results.csv`
5. Verify vendor ID lookups and field mappings

### Workflow 3: Environment Validation

1. Configure `.ocr.dev.env` or `.ocr.prd.env`
2. Run inspection: `./ocr_env_inspect.sh --config .ocr.dev.env --env DEV`
3. Review resource status
4. Deploy missing resources as needed
5. Re-run inspection to verify

### Workflow 4: Integration Testing

1. Deploy to DEV environment
2. Update `.ocr.dev.env` with actual DEV URLs
3. Run environment tests: `pwsh ./tests/run_env_tests.ps1 -Environment DEV`
4. Compare DEV vs PRD: Run tests for both environments
5. Validate consistency

---

## Troubleshooting

### Issue: "Environment validation failed"

**Cause**: Required variables missing in `.ocr.dev.env`

**Solution**:
1. Run `./scripts/load_env_dev.sh` to see which variables are missing
2. Update `.ocr.dev.env` with the required values
3. Re-run the validation

### Issue: "API request failed" in tests

**Cause**: Local server not running or wrong URL

**Solution**:
1. Ensure dev server is running: `./scripts/dev_run.sh`
2. Check `OCR_LOCAL_BASE_URL` environment variable
3. Verify server is accessible at http://localhost:8000

### Issue: "Vendor ID not found" in flow simulation

**Cause**: Vendor name or customer code doesn't match lookup table

**Solution**:
1. Check the vendor lookup table in `scripts/mock_flow_run.py`
2. Add missing vendor entries if needed
3. Verify `VendorNameClassify` and `CustomerNameClassify` values from CU API

### Issue: "Epicor API request failed"

**Cause**: Invalid API key or unreachable endpoint

**Solution**:
1. Verify `EPICOR_API_KEY` is set correctly
2. Check `EPICOR_BASE_URL` is accessible
3. Confirm network access to Epicor endpoint
4. Test with a simple curl command first

---

## Best Practices

1. **Never commit real credentials** - Use placeholders in template files
2. **Use environment-specific configs** - Keep DEV and PRD separate
3. **Run contract tests regularly** - Catch API changes early
4. **Simulate the full flow locally** - Test end-to-end before deploying
5. **Keep vendor lookup table in sync** - Update when new vendors are added
6. **Document environment-specific settings** - Make it easy for others to set up

---

## Next Steps

1. **Deploy DEV Azure infrastructure** - Create resource groups, ACR, ACA, APIM
2. **Update `.ocr.dev.env`** - Fill in actual DEV resource IDs
3. **Run environment inspection** - Verify all resources are accessible
4. **Deploy to DEV** - Use `deploy.sh` with DEV configuration
5. **Run integration tests** - Validate DEV deployment
6. **Set up CI/CD** - Integrate contract tests into pipeline
7. **Create Power Automate DEV flow** - Use the spec to build DEV flow
8. **Test end-to-end** - Email → Power Automate → API → SharePoint

---

## Support

For questions or issues:
1. Check this documentation
2. Review the main `README.md`
3. Check individual script help: `./script_name.sh --help`
4. Review code comments in scripts
5. Contact the development team

---

## Related Documentation

- [Main README](../README.md) - Project overview and deployment
- [API Reference](api_reference.md) - API endpoint documentation
- [Architecture](architecture.md) - System architecture
- [Power Automate Flow Spec](power_automate_flow_spec.md) - Flow specification
- [Schema Mapping](schema_mapping.md) - Field mapping details
