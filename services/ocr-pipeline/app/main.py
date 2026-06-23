"""
InvoicePipe Extraction API (FastAPI)

This is the application entrypoint used both locally and in the container.
It loads environment variables (for local dev) and mounts the API router.

Primary routes live in: app/routes.py
Azure CU client wrapper: app/azure_client.py
"""

from fastapi import FastAPI
from app.routes import router
from app.health import health_router
from app.logging_config import setup_logging
from dotenv import load_dotenv

# Local development convenience: loads .env.local if present.
# In Azure Container Apps, environment variables are typically injected by the platform.
load_dotenv(dotenv_path=".env.local")

setup_logging()

app = FastAPI(title="InvoicePipe Extraction Service", version="1.0.0")
app.include_router(health_router)
app.include_router(router)
