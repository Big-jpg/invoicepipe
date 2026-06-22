#!/usr/bin/env python3
"""
load_env_dev.py - Load and validate DEV environment configuration

This script reads .ocr.dev.env and exports relevant variables for:
- Local FastAPI run
- Test scripts (base URLs, keys)
- Fails loudly if any required variable is missing
"""

import os
import sys
from pathlib import Path


def load_env_file(env_file_path):
    """Load environment variables from a file."""
    env_vars = {}
    
    if not env_file_path.exists():
        return None, env_vars
    
    with open(env_file_path, 'r') as f:
        for line in f:
            line = line.strip()
            # Skip comments and empty lines
            if not line or line.startswith('#'):
                continue
            
            # Parse KEY=VALUE pairs
            if '=' in line:
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                env_vars[key] = value
                # Set in os.environ for child processes
                os.environ[key] = value
    
    return True, env_vars


def validate_environment(env_vars):
    """Validate that all required environment variables are present."""
    
    # Define required variables
    required_runtime_vars = [
        "CONTENT_UNDERSTANDING_ENDPOINT",
        "CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY",
        "ANALYZER_ID",
        "API_VERSION",
    ]
    
    required_infra_vars = [
        "SUBSCRIPTION_ID",
        "OCR_RG",
        "OCR_ACR",
        "OCR_ACA_ENV",
        "OCR_ACA_APP",
        "OCR_APIM_RG",
        "OCR_APIM_NAME",
        "CU_RG",
        "CU_RESOURCE_NAME",
        "CU_RESOURCE_TYPE",
    ]
    
    required_test_vars = [
        "OCR_LOCAL_BASE_URL",
    ]
    
    # Check for missing variables
    missing_vars = []
    
    print("🔍 Validating required runtime variables...")
    for var in required_runtime_vars:
        if var not in env_vars or not env_vars[var]:
            missing_vars.append(var)
    
    print("🔍 Validating required infrastructure variables...")
    for var in required_infra_vars:
        if var not in env_vars or not env_vars[var]:
            missing_vars.append(var)
    
    print("🔍 Validating required test variables...")
    for var in required_test_vars:
        if var not in env_vars or not env_vars[var]:
            missing_vars.append(var)
    
    if missing_vars:
        print("\n❌ Error: The following required variables are missing or empty:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n👉 Please update .ocr.dev.env with the correct values")
        return False
    
    # Check for placeholder values
    print("🔍 Checking for placeholder values...")
    placeholder_vars = []
    
    if env_vars.get("SUBSCRIPTION_ID") == "00000000-0000-0000-0000-000000000000":
        placeholder_vars.append("SUBSCRIPTION_ID")
    
    if "YOUR_" in env_vars.get("CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY", ""):
        placeholder_vars.append("CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY")
    
    if "YOUR_" in env_vars.get("PRIMARY_APIM_SUBSCRIPTION_KEY", ""):
        placeholder_vars.append("PRIMARY_APIM_SUBSCRIPTION_KEY")
    
    if placeholder_vars:
        print("\n⚠️  Warning: The following variables still contain placeholder values:")
        for var in placeholder_vars:
            print(f"   - {var}")
        print("\n👉 These may need to be updated with actual values for full functionality")
    
    return True


def main():
    """Main entry point."""
    # Determine project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    env_file = project_root / ".ocr.dev.env"
    
    # Load environment file
    print(f"📂 Loading environment from {env_file}")
    exists, env_vars = load_env_file(env_file)
    
    if not exists:
        print(f"❌ Error: .ocr.dev.env file not found at {env_file}")
        print("👉 Please create .ocr.dev.env from the template and fill in your DEV resource IDs")
        sys.exit(1)
    
    # Validate environment
    if not validate_environment(env_vars):
        sys.exit(1)
    
    # All checks passed
    print("\n✅ Environment validation successful!")
    print(f"📋 Environment: {env_vars.get('ENVIRONMENT', 'N/A')}")
    print(f"🌐 Local Base URL: {env_vars.get('OCR_LOCAL_BASE_URL', 'N/A')}")
    print(f"🔑 CU Endpoint: {env_vars.get('CONTENT_UNDERSTANDING_ENDPOINT', 'N/A')}")
    print(f"📦 Resource Group: {env_vars.get('OCR_RG', 'N/A')}")
    print("\n💡 Environment variables have been exported and are ready to use")
    print("💡 You can now run: uvicorn app.main:app --host 0.0.0.0 --port 8000")


if __name__ == "__main__":
    main()
