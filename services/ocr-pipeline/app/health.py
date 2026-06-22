"""
Health and readiness probe endpoints for container orchestrators.
"""

import os
import logging

import requests
from fastapi import APIRouter
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)

health_router = APIRouter(tags=["health"])


@health_router.get("/health")
async def health():
    """Liveness probe — always returns 200 if the process is up."""
    return JSONResponse(
        status_code=200,
        content={
            "status": "healthy",
            "service": "invoicepipe-extraction",
            "version": "1.0.0",
        },
    )


@health_router.get("/ready")
async def ready():
    """Readiness probe — verifies Azure Content Understanding connectivity."""
    endpoint = os.environ.get("CONTENT_UNDERSTANDING_ENDPOINT", "")
    subscription_key = os.environ.get("CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY", "")
    api_version = os.environ.get("API_VERSION", "")

    if not endpoint or not api_version:
        logger.warning("Readiness check failed: missing CU configuration")
        return JSONResponse(
            status_code=503,
            content={
                "status": "not_ready",
                "reason": "Azure Content Understanding configuration missing",
            },
        )

    try:
        # Lightweight connectivity check: list analyzers (HEAD-style, small payload)
        url = f"{endpoint.rstrip('/')}/contentunderstanding/analyzers?api-version={api_version}"
        headers = {"Ocp-Apim-Subscription-Key": subscription_key} if subscription_key else {}
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code < 500:
            return JSONResponse(
                status_code=200,
                content={"status": "ready"},
            )
        else:
            logger.warning(f"Readiness check: CU returned {resp.status_code}")
            return JSONResponse(
                status_code=503,
                content={
                    "status": "not_ready",
                    "reason": f"Azure CU returned HTTP {resp.status_code}",
                },
            )
    except requests.exceptions.RequestException as exc:
        logger.error(f"Readiness check failed: {exc}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "not_ready",
                "reason": f"Cannot reach Azure Content Understanding: {str(exc)}",
            },
        )
