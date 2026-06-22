# Contoso Invoice OCR - DEV Environment Harness

## Overview

This repository now includes a comprehensive **DEV Environment Harness** that enables local development and testing without requiring Azure infrastructure to be deployed. This harness was built to support the development workflow and prepare for DEV environment deployment.

## What's New

### 7 Tasks Completed

#### Task 1: Normalize Environment Configuration for DEV ✅

**Deliverables**:
- `.ocr.dev.env` - DEV environment configuration template
- `.ocr.prd.env` - PRD environment configuration template
- `.env.local.example` - Local runtime configuration template
- `scripts/load_env_dev.sh` - Bash environment loader with validation
- `scripts/load_env_dev.py` - Python environment loader with validation

**Features**:
- Single source of truth for DEV configuration
- Clear separation of infrastructure targets vs runtime config
- Validation of required variables
- Detection of placeholder values
- Fails loudly if configuration is incomplete

#### Task 2: Local DEV Run + Test Harness ✅

**Deliverables**:
- `scripts/dev_run.sh` - One-command local development environment
- `Makefile` - Convenient make targets for common tasks
- Updated `tests/test_local.ps1` - Environment-aware local tests

**Features**:
- Automatic virtualenv creation and dependency installation
- Environment loading and validation
- Auto-reload enabled for development
- Configurable base URL and test file paths

**Usage**:
```bash
# Start dev server
./scripts/dev_run.sh
# or
make dev

# Run local tests
make test-local
```

#### Task 3: API Contract Fixtures for Automated Validation ✅

**Deliverables**:
- `tests/fixtures/` - Directory for test fixtures
- `tests/fixtures/README.md` - Documentation for fixtures
- `tests/test_contract.py` - Python contract validation script
- `tests/test_contract.ps1` - PowerShell contract validation script
- Sample expected JSON output

**Features**:
- Deterministic input/output validation
- Configurable tolerance for timestamps, GUIDs, and numeric precision
- Clear diff output for failures
- CI/CD ready

**Usage**:
```bash
# Python version
python3 ./tests/test_contract.py

# PowerShell version
pwsh ./tests/test_contract.ps1

# Or using Make
make test-contract
```

#### Task 4: APIM and Live Test Abstraction (Mockable) ✅

**Deliverables**:
- Updated `tests/test_live.ps1` - Environment-aware live tests
- Updated `tests/test_apim.ps1` - Environment-aware APIM tests
- `tests/run_env_tests.ps1` - Wrapper script for all environment tests

**Features**:
- Switch between DEV and PRD with `-Environment` parameter
- Environment-specific URLs and keys from config
- Graceful handling of unreachable endpoints
- Clear indication when resources are not deployed yet

**Usage**:
```powershell
# Test DEV environment
pwsh ./tests/test_live.ps1 -Environment DEV
pwsh ./tests/test_apim.ps1 -Environment DEV

# Test PRD environment
pwsh ./tests/test_live.ps1 -Environment PRD
pwsh ./tests/test_apim.ps1 -Environment PRD

# Run all environment tests
pwsh ./tests/run_env_tests.ps1 -Environment DEV
```

#### Task 5: Power Automate Flow "Offline Spec" + Stubs ✅

**Deliverables**:
- `docs/power_automate_flow_spec.md` - Machine-readable flow specification
- `scripts/mock_flow_run.py` - Local flow stub for testing
- `mock_inbox/` - Directory for dropping test PDFs
- `mock_output/` - Directory for flow output (CSV)

**Features**:
- Complete flow specification with triggers, actions, and schema
- Local stub that mimics Power Automate behavior
- Vendor ID lookup using the same logic as the real flow
- CSV output matching SharePoint/Excel schema
- Watch mode for continuous processing

**Usage**:
```bash
# Start flow stub in watch mode
python3 ./scripts/mock_flow_run.py

# Process files once and exit
python3 ./scripts/mock_flow_run.py --once

# Drop PDFs into mock_inbox/ to process them
cp /path/to/invoice.pdf mock_inbox/
```

#### Task 6: Epicor Vendor / ABN Test Data Harness ✅

**Deliverables**:
- `scripts/fetch_epicor_vendorlist.py` - Epicor BAQ data fetcher
- `data/` - Directory for vendor data files
- Documentation for Epicor integration

**Features**:
- Retrieves paginated vendor data from Epicor BAQ endpoint
- Saves raw JSON and normalized CSV
- Configurable via environment variables
- Ready for vendor validation and ABN matching

**Usage**:
```bash
# Set environment variables
export EPICOR_API_KEY="your_key"
export EPICOR_BASE_URL="https://erp.contoso.com.au"

# Fetch vendor data
python3 ./scripts/fetch_epicor_vendorlist.py

# Output files created:
# - data/epicor_vendorlist_raw.json
# - data/epicor_vendorlist_clean.csv
```

#### Task 7: Dev/Prd Environment Inspector Alignment ✅

**Deliverables**:
- Updated `ocr_env_inspect.sh` - DEV/PRD aware environment inspector

**Features**:
- Accepts `--config` and `--env` parameters
- Gracefully handles "resource not found" (doesn't fail)
- Clear indication of deployment status
- Works with both `.ocr.dev.env` and `.ocr.prd.env`
- Enhanced output with environment context

**Usage**:
```bash
# Inspect DEV environment
./ocr_env_inspect.sh --config .ocr.dev.env --env DEV

# Inspect PRD environment
./ocr_env_inspect.sh --config .ocr.prd.env --env PRD
```

## Quick Start

### 1. Configure DEV Environment

```bash
# Copy and edit the DEV configuration
cp .ocr.dev.env .ocr.dev.env.local
# Edit .ocr.dev.env with your actual DEV resource IDs
```

### 2. Start Local Development

```bash
# Start the dev server
./scripts/dev_run.sh

# In another terminal, run tests
make test-local
```

### 3. Test Power Automate Flow Logic

```bash
# Start the flow stub
python3 ./scripts/mock_flow_run.py

# Drop PDFs into mock_inbox/
cp /path/to/invoice.pdf mock_inbox/

# Check results in mock_output/invoice_results.csv
```

### 4. Validate API Contracts

```bash
# Add test fixtures to tests/fixtures/
# Run contract validation
make test-contract
```

### 5. Inspect Azure Environment

```bash
# Check what's deployed in DEV
./ocr_env_inspect.sh --config .ocr.dev.env --env DEV
```

## Directory Structure

```
invoice-ocr-pipeline/
├── app/                          # FastAPI application
├── docs/                         # Documentation
│   ├── DEV_HARNESS_README.md     # Comprehensive DEV harness docs
│   └── power_automate_flow_spec.md
├── scripts/                      # Helper scripts
│   ├── load_env_dev.sh           # Environment loader (Bash)
│   ├── load_env_dev.py           # Environment loader (Python)
│   ├── dev_run.sh                # Local dev server
│   ├── mock_flow_run.py          # Power Automate stub
│   └── fetch_epicor_vendorlist.py # Epicor data fetcher
├── tests/                        # Test scripts
│   ├── fixtures/                 # Test fixtures
│   ├── test_local.ps1            # Local tests
│   ├── test_contract.py          # Contract validation
│   ├── test_live.ps1             # Live environment tests
│   ├── test_apim.ps1             # APIM tests
│   └── run_env_tests.ps1         # Environment test runner
├── data/                         # Data files
├── mock_inbox/                   # Flow simulation input
├── mock_output/                  # Flow simulation output
├── .ocr.dev.env                  # DEV configuration
├── .ocr.prd.env                  # PRD configuration
├── ocr_env_inspect.sh            # Environment inspector
└── Makefile                      # Make targets
```

## Available Make Targets

```bash
make help           # Show available targets
make dev            # Start local development server
make test-local     # Run local API tests
make test-contract  # Run contract validation tests
make test-live      # Run live environment tests
make test-apim      # Run APIM tests
make test-env       # Run environment tests
make clean          # Clean up virtualenv and cache
```

## Configuration Files

### `.ocr.dev.env` - DEV Environment Configuration

Contains:
- Azure subscription ID
- Resource group names
- Container registry, ACA, APIM names
- Content Understanding resource details
- Runtime API keys and endpoints
- Test configuration (URLs, keys)

### `.ocr.prd.env` - PRD Environment Configuration

Same structure as DEV, but with production values.

### `.env.local` - Local Runtime Configuration

Used by the FastAPI application. Can be created from `.env.local.example`.

## Testing Strategy

### 1. Local Development Tests
- Test against local server (http://localhost:8000)
- Fast feedback loop
- No Azure resources required

### 2. Contract Validation Tests
- Validate API responses against expected outputs
- Catch breaking changes early
- CI/CD integration ready

### 3. Environment Integration Tests
- Test DEV and PRD deployments
- Validate live endpoints
- Compare environments

### 4. Flow Simulation Tests
- Test complete invoice processing pipeline
- Validate vendor lookups
- Verify output schema

## Next Steps

1. **Deploy DEV Infrastructure**:
   - Create Azure resource groups
   - Deploy ACR, ACA, APIM
   - Deploy Content Understanding resource

2. **Update Configuration**:
   - Fill in actual DEV resource IDs in `.ocr.dev.env`
   - Update URLs and keys

3. **Deploy to DEV**:
   ```bash
   # Use deploy.sh with DEV config
   cp .ocr.dev.env .env.local
   ./deploy.sh
   ```

4. **Run Integration Tests**:
   ```bash
   # Test DEV deployment
   pwsh ./tests/run_env_tests.ps1 -Environment DEV
   ```

5. **Create DEV Power Automate Flow**:
   - Use `docs/power_automate_flow_spec.md` as reference
   - Configure DEV mailbox and SharePoint
   - Point to DEV API endpoint

6. **Set Up CI/CD**:
   - Integrate contract tests into pipeline
   - Automate DEV deployment
   - Add environment validation checks

## Documentation

For detailed documentation, see:
- **[DEV Harness README](docs/DEV_HARNESS_README.md)** - Comprehensive guide
- **[Power Automate Flow Spec](docs/power_automate_flow_spec.md)** - Flow specification
- **[API Reference](docs/api_reference.md)** - API documentation
- **[Architecture](docs/architecture.md)** - System architecture

## Support

For questions or issues:
1. Check the [DEV Harness README](docs/DEV_HARNESS_README.md)
2. Review script help: `./script_name.sh --help`
3. Check code comments in scripts
4. Contact the development team

## Summary

The DEV Environment Harness provides:
- ✅ Normalized configuration management
- ✅ One-command local development
- ✅ Automated contract validation
- ✅ Environment-aware testing
- ✅ Power Automate flow simulation
- ✅ Epicor integration testing
- ✅ Azure environment inspection

All without requiring Azure infrastructure to be deployed first!
