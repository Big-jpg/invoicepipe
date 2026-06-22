# InvoicePipe Monorepo

InvoicePipe is an end-to-end invoice processing system that automates the ingestion, extraction, normalization, and presentation of structured data from PDF invoices. It combines a modern SaaS frontend, a containerized extraction microservice powered by Azure Content Understanding (formerly Document Intelligence), and a Power Automate reference architecture for email-driven automation.

## Architecture

The system operates as three loosely-coupled components that communicate over HTTP:

```
┌─────────────────────┐       ┌──────────────────────────────┐       ┌──────────────────────┐
│   apps/web          │       │  services/ocr-pipeline       │       │  automation/         │
│   (Next.js SaaS)    │       │  (FastAPI extraction svc)    │       │  (Power Automate)    │
│                     │       │                              │       │                      │
│  • User upload UI   │──────▶│  • POST /analyzepdf          │◀──────│  • Mailbox trigger   │
│  • Dashboard        │       │  • POST /process-invoice/    │       │  • PDF routing        │
│  • Auth / DB        │       │  • GET  /health              │       │  • Excel/SP output   │
│  • Direct CU call   │       │  • GET  /ready               │       │                      │
└─────────────────────┘       └──────────────┬───────────────┘       └──────────────────────┘
                                             │
                                             ▼
                              ┌──────────────────────────────┐
                              │  Azure Content Understanding │
                              │  (document ingestion,        │
                              │   extraction, normalization, │
                              │   validation)                │
                              └──────────────────────────────┘
```

**Data flow (automated path):** An email arrives at a shared mailbox. Power Automate extracts PDF attachments and POSTs them to the extraction service. The service submits the PDF to Azure Content Understanding, polls for results, normalizes extracted fields against a trained custom schema, and returns structured JSON. Power Automate writes the result to SharePoint/Excel for downstream consumption.

**Data flow (interactive path):** A user uploads a PDF through the Next.js dashboard. The web app calls Azure Content Understanding directly (or via the extraction service), persists results to PostgreSQL, and renders an instant preview with extracted metadata.

## System Components

| Directory | Role | Tech |
|-----------|------|------|
| `apps/web` | SaaS frontend — upload, preview, export | Next.js 15, Prisma, PostgreSQL, NextAuth |
| `services/ocr-pipeline` | Extraction microservice — PDF to structured JSON | FastAPI, Azure Content Understanding, Docker |
| `automation/` | Reference flow — email-to-pipeline automation | Power Automate (exported JSON) |

## Quick Start

1. **Extraction Service (Backend):** Navigate to `services/ocr-pipeline` and follow the [service README](./services/ocr-pipeline/README.md) to configure your Python environment and Azure credentials.
2. **Web App (Frontend):** Navigate to `apps/web`, install dependencies (`pnpm install`), configure your `.env` file, and start the Next.js development server.
3. **Automation:** Review the `automation/` directory to understand how to connect email ingestion to the extraction service.

## Production Hardening Checklist

The following operational concerns have been addressed in this codebase:

- ✅ Health and readiness endpoints (`GET /health`, `GET /ready`)
- ✅ Typed HTTP error responses (400, 408, 422, 502 with structured detail)
- ✅ Input validation (file size limit 20MB, MIME type enforcement, PDF magic byte check)
- ✅ Correlation ID propagation (`X-Correlation-ID` header, auto-generated UUID fallback)
- ✅ Structured JSON logging (timestamp, level, correlation_id, message)

The following are expected to be handled at the infrastructure layer by deployers:

- ⬜ Authentication (expected at Azure API Management gateway layer)
- ⬜ Rate limiting (expected at Azure API Management gateway layer)
- ⬜ Horizontal scaling configuration (Azure Container Apps scaling rules)
- ⬜ Alerting and monitoring dashboards (Azure Monitor / Application Insights)
