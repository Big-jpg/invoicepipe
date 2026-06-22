# Contoso Invoice Automation Deployment Guide

Version: Stable (June 2025)

## 🛠 Prerequisites

- Docker Desktop

- Azure CLI (`az login` configured)

- jq installed

- Access to Azure subscription with:

  - Azure Container Registry (`contosoinvoicesregistry`)

  - Azure Container Apps Environment (`contoso-env`)

  - Azure Resource Group (`mcs-azr-prd-oci`)


## 🔐 Environment Variables Setup

Create `.env.local` file using:

```bash

CONTENT_UNDERSTANDING_ENDPOINT=<Your CU Endpoint>

CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY=<Your Subscription Key>

API_VERSION=<API Version>

ANALYZER_ID=<Analyzer ID>

```

These values come from Azure AI Foundry under Keys and Endpoint.

# 🚀 Full Deployment Flow

## 🔧 First Time

```bash
chmod +x deploy.sh

./deploy.sh
```

- Builds Docker image.

- Logs into ACR via token exchange.

- Pushes image to ACR.

- Creates ACA instance if not yet created.

# 🔄 Re-deploying After Code Changes

Simply re-run:

```bash
./deploy.sh
```
Script auto-handles both updates and new deployments.

# 🔄 Deployment Targets

| Resource            | Value                   | 
| ------------------- | ----------------------- | 
| `Resource Group`    | mcs-azr-prd-oci         | 
| `ACR Name`          | contosoinvoicesregistry   | 
| `ACA Name`          | contoso-invoice-cu-api | 
| `Environment Name`  | contoso-env               | 
| `Region`            | australiaeast           |

All parameters are pre-configured in `deploy.sh`

# 🔍 Post-Deployment Healthcheck

- The container app URL is printed at end of deployment.

- Use `test_live.ps1` or Swagger UI to validate.

# 🐳 Docker Image Structure

| Build Stage         | Notes                 | 
| ------------------- | --------------------- | 
| `python:3.11-slim`  | Base image            | 
| `requirements.txt`  | Package install       | 
| `app/`              | Source code copied    | 
| `CMD`               | Starts Uvicorn server | 

# 📋 Logs & Diagnostics

- Use Azure Container App logs for all runtime errors.

- Full deployment logs printed by `deploy.sh`