# InvoicePipe Monorepo

Welcome to the **InvoicePipe** monorepo. This system provides an end-to-end invoice processing solution, combining a modern SaaS frontend, a robust OCR extraction pipeline, and an automation reference for integrating with external systems.

## System Components

This monorepo is divided into three main components:

1. **`apps/web` (Next.js SaaS Frontend)**  
   The primary user-facing application for invoice processing. Built with Next.js, it features user authentication (NextAuth), database integration (Prisma/Neon DB), and direct integration with Azure Document Intelligence.  
   👉 [See Web App README](./apps/web/README.md) for setup and deployment instructions.

2. **`services/ocr-pipeline` (FastAPI Backend)**  
   A Python microservice that wraps Azure Content Understanding for advanced PDF extraction and processing. It is designed to be deployed on Azure Container Apps and serves as the backend engine for extracting structured data from complex invoices.  
   👉 [See OCR Pipeline README](./services/ocr-pipeline/README.md) for API details and local development.

3. **`automation/` (Power Automate Reference)**  
   A reference artifact demonstrating how to automate the ingestion of invoices. It includes an exported Power Automate flow that monitors a shared mailbox for invoice attachments, routes them to the OCR pipeline, and handles the results.  
   👉 [See Automation README](./automation/README.md) for instructions on adapting this flow for your environment.

## Quick Start

To get started with local development, we recommend setting up the backend service first, followed by the frontend application.

1. **OCR Pipeline (Backend):** Navigate to `services/ocr-pipeline` and follow the setup instructions to configure your Python environment and Azure credentials.
2. **Web App (Frontend):** Navigate to `apps/web` to install dependencies (`pnpm install`), configure your `.env` file, and start the Next.js development server.
3. **Automation:** Review the `automation/` directory to understand how you can connect your email ingestion to the backend pipeline.

## Architecture Overview

The system is designed to be modular. The frontend can operate independently using Azure Document Intelligence for immediate user uploads, while the backend pipeline and automation flow handle high-volume, automated background processing via Azure Content Understanding.
