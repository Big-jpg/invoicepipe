# InvoicePipe Extraction Service Architecture

Version: Stable (June 2025)

## 🔧 High Level Architecture Overview

Client (APIM / Internal Apps - Power Automate)  

│  
▼  
Azure API Management  

│  
▼  
Azure Container App (FastAPI)  

│  
▼  
Azure Content Understanding (formerly Document Intelligence)  

│  
▼  
Azure Storage (managed behind CU service)  


## 🔩 Component Breakdown

### 1️⃣ Azure Container Apps

- Primary microservice deployment target.

- Runs containerized FastAPI app.

- Fully serverless scaling model.

### 2️⃣ Azure Container Registry (ACR)

- Stores Docker images for deployments.

- Image tagged via `deploy.sh` and pushed to Azure Container Registry

### 3️⃣ Azure Content Understanding (formerly Document Intelligence)

- Pretrained custom schema (`custom-invoice-analyzer-id_schema.json`)

- Handles document ingestion, field extraction, and classification.

### 4️⃣ Azure API Management (APIM)

- (Optional) Fronts APIs for external integrations.

- Provides API key management, request logging, and authentication.

## 🔐 Security Considerations

- No data is stored within this app — stateless processing pipeline.

- Sensitive secrets are handled via:

- `.env.local` for local development

- Container App environment variables for production

- Azure role-based access used for ACR push/pull.

## 🔄 Processing Workflow

### /analyzepdf

- Accepts PDF file via multipart upload.

- Passes file directly to Azure CU.

- Returns full CU raw response.

### /process-invoice/

- Accepts Base64-encoded PDF.

- Performs extraction via CU.

- Normalizes results into strongly typed Pydantic models (`OutputSchema`).


## 📊 Data Model Alignment

All extracted fields are mapped against:

- Azure CU schema (zero shot classification and extraction)

- `models.py` (`OutputSchema`) definition

- `custom-invoice-analyzer-id_schema.json` formal structure


## ⚙ Deployment Flow

1️⃣ Code update  

2️⃣ Run `./deploy.sh`  

3️⃣ Azure CLI handles:

- Docker build

- ACR push

- ACA deployment update


## 🔧 Maintainers Notes

- No state is maintained between requests.

- Service can be horizontally scaled by Azure Container Apps.

- Logging provided via Uvicorn and Azure native monitoring.

