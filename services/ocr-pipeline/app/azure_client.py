"""
Azure Content Understanding client wrapper.

This module provides:
- Settings: runtime config loaded from environment
- AzureContentUnderstandingClient: thin wrapper around the CU REST API:
    begin_analyze() -> returns HTTP response with operation-location header
    poll_result()   -> polls operation-location until succeeded/failed
"""

import os, time, requests, logging
from dataclasses import dataclass
from collections.abc import Callable
from typing import Any, cast

logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.INFO)

@dataclass(frozen=True, kw_only=True)
class Settings:
    """Strongly-typed runtime configuration for CU calls."""
    endpoint: str
    api_version: str
    subscription_key: str | None = None
    aad_token: str | None = None
    analyzer_id: str

    def __post_init__(self):
        if not self.subscription_key and not self.aad_token:
            raise ValueError("Either 'subscription_key' or 'aad_token' must be provided")

    @classmethod
    def from_environment(cls):
        """Load Settings from environment variables (local: .env.local)."""
        return cls(
            endpoint=os.environ["CONTENT_UNDERSTANDING_ENDPOINT"],
            api_version=os.environ["API_VERSION"],
            subscription_key=os.environ.get("CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY"),
            aad_token=os.environ.get("CONTENT_UNDERSTANDING_AAD_TOKEN"),
            analyzer_id=os.environ["ANALYZER_ID"]
        )

    @property
    def token_provider(self) -> Callable[[], str] | None:
        return lambda: self.aad_token if self.aad_token else None

class AzureContentUnderstandingClient:
    """
    Minimal CU REST client.
    Auth options:
    - subscription_key (APIM key style header)
    - token_provider (returns AAD bearer token)
    """
    def __init__(self, endpoint, api_version, subscription_key=None, token_provider=None, x_ms_useragent="cu-sample-code"):
        if not subscription_key and token_provider is None:
            raise ValueError("Either subscription key or token provider must be provided")
        self._endpoint = endpoint.rstrip("/")
        self._api_version = api_version
        self._headers = self._get_headers(subscription_key, token_provider() if token_provider else None, x_ms_useragent)

    def begin_analyze(self, analyzer_id: str, file_data: bytes):
        url = f"{self._endpoint}/contentunderstanding/analyzers/{analyzer_id}:analyze?api-version={self._api_version}&stringEncoding=utf16"
        headers = {"Content-Type": "application/pdf", **self._headers}
        response = requests.post(url=url, headers=headers, data=file_data)
        response.raise_for_status()
        return response

    def poll_result(self, response: requests.Response, timeout_seconds=3600, polling_interval_seconds=1) -> dict[str, Any]:
        operation_location = response.headers.get("operation-location", "")
        headers = {"Content-Type": "application/json", **self._headers}
        start_time = time.time()

        while True:
            elapsed = time.time() - start_time
            if elapsed > timeout_seconds:
                raise TimeoutError("Operation timed out.")
            response = requests.get(operation_location, headers=headers)
            response.raise_for_status()
            result = cast(dict[str, str], response.json())
            status = result.get("status", "").lower()
            if status == "succeeded":
                return result
            elif status == "failed":
                raise RuntimeError("Request failed.")
            time.sleep(polling_interval_seconds)

    def _get_headers(self, subscription_key, api_token, user_agent):
        headers = {"Ocp-Apim-Subscription-Key": subscription_key} if subscription_key else {"Authorization": f"Bearer {api_token}"}
        headers["x-ms-useragent"] = user_agent
        return headers
