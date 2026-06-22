"""
Contoso Invoice OCR API (FastAPI)

This is the application entrypoint used both locally and in the container.
It loads environment variables (for local dev) and mounts the API router.

Primary routes live in: app/routes.py
Azure CU client wrapper: app/azure_client.py
"""

from fastapi import FastAPI
from app.routes import router
from dotenv import load_dotenv
import logging

# Local development convenience: loads .env.local if present.
# In Azure Container Apps, environment variables are typically injected by the platform.
load_dotenv(dotenv_path=".env.local")

app = FastAPI()
app.include_router(router)