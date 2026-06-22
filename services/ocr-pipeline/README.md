# Contoso Azure OCR Invoice Automation

👉 New to the repo? Start with: `docs/READ_ME_FIRST.md`
## Project Overview

This repository contains the **Contoso Invoice Automation** microservice:   

A FastAPI-based Python service that wraps Azure's Content Understanding (Document Intelligence) service.  
The system ingests PDF invoices, extracts structured metadata, and exposes two API routes for integration.

The service is designed for containerized deployment on Azure Container Apps, with automated image build and deployment via the `deploy.sh` script.

## 📂 Project Structure

```bash
invoice-ocr-pipeline/
├── app/                                    # Main application code
│   ├── __init__.py                         # Package init (empty, future expansion)
│   ├── azure_client.py                     # Azure Content Understanding client wrapper
│   ├── main.py                             # FastAPI application entrypoint
│   ├── models.py                           # Pydantic request/response models
│   ├── routes.py                           # API routes for PDF analysis
├── tests/                                  # PowerShell integration test scripts
│   ├── test_apim.ps1                       # Tests against Azure API Management gateway
│   ├── test_live.ps1                       # Tests against deployed Azure Container App
│   ├── test_local.ps1                      # Tests against local dev server
├── .env.local                              # Local environment variables (use values from GitHub Secrets)
├── .gitignore                              # Git ignore rules
├── custom-invoice-analyzer-id_schema.json  # Azure CU Analyzer schema
├── deploy.sh                               # Docker build + Azure Container App deployment
├── Dockerfile                              # Docker image build spec
├── requirements.txt                        # Python package dependencies
```


## ⚙ Azure Integration Architecture

* Azure **Content Understanding** is used for PDF extraction via a trained custom model.
* Analyzer schema is defined in:
  `custom-invoice-analyzer-id_schema.json`
* Containerized deployment targets:
  Azure Container Registry (ACR) + Azure Container Apps (ACA).
* Supports **both API Management routing and direct ingestion**.


## 🚀 Deployment Process

### 🔧 Pre-requisites

* Docker Desktop installed (System restart will be required after install) [Docker Desktop Download Link](https://www.docker.com/products/docker-desktop/)

* Azure CLI installed and authenticated (`az login`) [Azure Command Line Interface Download Link](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows)

* Azure Container Registry provisioned (`contosoinvoicesregistry`)

* Azure Container App Environment provisioned (`contoso-env`)

* `jq` installed (System restart will be required after install) 

### 🔐 Environment Configuration

Create `.env.local` with: (or copy .env.example as .env.local and replace values)

```bash
CONTENT_UNDERSTANDING_ENDPOINT=your-azure-cu-endpoint

CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY=your-sub-key

API_VERSION=your-api-version

ANALYZER_ID=your-analyzer-id

```

These values directly feed the AzureContentUnderstandingClient via `Settings.from_environment()` and can be retrieved from Azure AI Foundry under the Keys and Endpoint setting in Resource Management.
 

### 🔨 Build & Deploy (Fully Automated)

Open the root project folder with a Bash Terminal and execute the chmod command followed by exeucting the deploy sh script:

```bash
chmod +x deploy.sh
./deploy.sh
```

The script performs:

1. Docker build → tags image

2. Azure ACR login (using temporary token exchange)

3. Docker push to ACR

4. Azure Container App update (or creation if first run)

✔ No manual image or container management needed.


## 🔄 Development Workflow

### 🧪 Local Testing

Spin up local server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Invoke local PowerShell test:

```bash
./tests/test_local.ps1
```

### 🌐 Live API Testing

You can test deployed endpoints with:

* `tests/test_live.ps1` — direct live endpoint test

* `tests/test_apim.ps1` — via Azure API Management gateway (APIM)

Both scripts use full PDF roundtrip submission with either:

* Multipart form POST (`/analyzepdf`)

* Base64 JSON POST (`/process-invoice`)


## 🧩 Code Walkthrough

| File                                     | Description                                                 |
| ---------------------------------------- | ----------------------------------------------------------- |
| `azure_client.py`                        | Core Azure CU client. Handles analyze submit + polling.     |
| `models.py`                              | Input/output data contracts based on `pydantic`.            |
| `routes.py`                              | Exposes API endpoints `/analyzepdf` and `/process-invoice/` |
| `main.py`                                | FastAPI initialization + router binding                     |
| `custom-invoice-analyzer-id_schema.json` | Full CU extraction schema                                   |
| `deploy.sh`                              | Complete automated deployment pipeline                      |
| `Dockerfile`                             | Build recipe for Azure Container Apps                       |
| `tests/`                                 | PowerShell integration tests                                |


## 🔧 Making Changes

### ✅ Code changes

* Modify any files in `app/` as needed.

* Update `requirements.txt` if new Python packages are introduced.

### ✅ Schema updates

* If updating invoice fields:

  * Modify `custom-invoice-analyzer-id_schema.json` when the Content Understanding Schema is modified.

  * Update `models.py` to reflect new/changed fields when the Content Understanding Schema is modified.

### ✅ Rebuild Container Image

```bash
./deploy.sh
```

The deployment script automatically builds and redeploys the updated container.
 

## 🔒 Notes on Secrets Management

* No secrets are hard-coded.

* Local secrets live in `.env.local` (ignored by git).

* Azure-managed secrets are passed via Container App configuration.
 

## 📜 Commit History Context

This repository has undergone:

* Full restructuring into app/ package (`7b8e59b`)

* Schema model expansions for vendors, customers and PO extraction (`79d6f81`, `cf6ee0b`)

* Hardened deployment pipeline (`e968dd6`)

* Deprecated legacy scripts (`1ada6de`)

* Phase 1 transition layering into Azure (`71ff412`)


## 🌍 Deployment Environment Targets

* Azure Container Apps (`contoso-invoice-cu-api`)

* Azure Container Registry (`contosoinvoicesregistry`)

* Azure Resource Group (`mcs-azr-prd-oci`)  

> These values are fully parameterized in `deploy.sh`


## 👷 Future Improvements (Backlog candidates)

* Add health-check & telemetry to FastAPI app

* Implement structured logging for better monitoring
 

Built with ❤️ by Your Name.
*"Stable. Hardened. Production ready."*
