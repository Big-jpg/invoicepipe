#!/bin/bash
# ============================================================================
# load_env_dev.sh - Load and validate DEV environment configuration
# ============================================================================
# This script reads .ocr.dev.env and exports relevant variables for:
# - Local FastAPI run
# - Test scripts (base URLs, keys)
# - Fails loudly if any required variable is missing
# ============================================================================

set -e

# Determine the project root directory (parent of scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.ocr.dev.env"

# Check if .ocr.dev.env exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: .ocr.dev.env file not found at $ENV_FILE"
    echo "👉 Please create .ocr.dev.env from the template and fill in your DEV resource IDs"
    exit 1
fi

# Load environment variables from .ocr.dev.env
echo "📂 Loading environment from $ENV_FILE"
set -a  # automatically export all variables
source "$ENV_FILE"
set +a

# Define required variables for local FastAPI run
REQUIRED_RUNTIME_VARS=(
    "CONTENT_UNDERSTANDING_ENDPOINT"
    "CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY"
    "ANALYZER_ID"
    "API_VERSION"
)

# Define required variables for Azure infrastructure
REQUIRED_INFRA_VARS=(
    "SUBSCRIPTION_ID"
    "OCR_RG"
    "OCR_ACR"
    "OCR_ACA_ENV"
    "OCR_ACA_APP"
    "OCR_APIM_RG"
    "OCR_APIM_NAME"
    "CU_RG"
    "CU_RESOURCE_NAME"
    "CU_RESOURCE_TYPE"
)

# Define required variables for testing
REQUIRED_TEST_VARS=(
    "OCR_LOCAL_BASE_URL"
)

# Validate required runtime variables
echo "🔍 Validating required runtime variables..."
MISSING_VARS=()
for var in "${REQUIRED_RUNTIME_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

# Validate required infrastructure variables
echo "🔍 Validating required infrastructure variables..."
for var in "${REQUIRED_INFRA_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

# Validate required test variables
echo "🔍 Validating required test variables..."
for var in "${REQUIRED_TEST_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

# Check if any required variables are missing
if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo ""
    echo "❌ Error: The following required variables are missing or empty:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "👉 Please update $ENV_FILE with the correct values"
    exit 1
fi

# Check for placeholder values that haven't been replaced
echo "🔍 Checking for placeholder values..."
PLACEHOLDER_VARS=()
if [[ "$SUBSCRIPTION_ID" == "00000000-0000-0000-0000-000000000000" ]]; then
    PLACEHOLDER_VARS+=("SUBSCRIPTION_ID")
fi
if [[ "$CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY" == *"YOUR_"* ]]; then
    PLACEHOLDER_VARS+=("CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY")
fi
if [[ "$PRIMARY_APIM_SUBSCRIPTION_KEY" == *"YOUR_"* ]]; then
    PLACEHOLDER_VARS+=("PRIMARY_APIM_SUBSCRIPTION_KEY")
fi

if [ ${#PLACEHOLDER_VARS[@]} -gt 0 ]; then
    echo ""
    echo "⚠️  Warning: The following variables still contain placeholder values:"
    for var in "${PLACEHOLDER_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "👉 These may need to be updated with actual values for full functionality"
fi

# All checks passed
echo ""
echo "✅ Environment validation successful!"
echo "📋 Environment: $ENVIRONMENT"
echo "🌐 Local Base URL: $OCR_LOCAL_BASE_URL"
echo "🔑 CU Endpoint: $CONTENT_UNDERSTANDING_ENDPOINT"
echo "📦 Resource Group: $OCR_RG"
echo ""
echo "💡 Environment variables have been exported and are ready to use"
echo "💡 You can now run: uvicorn app.main:app --host 0.0.0.0 --port 8000"
