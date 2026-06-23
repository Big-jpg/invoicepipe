# ==============================================================================
# InvoicePipe Extraction Service - Azure Environment Inspector
# Read-only script for Cloud Shell / SSH to inspect extraction service env state.
# - Uses Azure CLI only (no Docker, no jq).
# - Intended for rfarrell@ / arm_automate@ accounts.
# - Safe to run repeatedly; does NOT modify resources.
# ==============================================================================

CONFIG_FILE=""
ENVIRONMENT="${ENVIRONMENT:-}"
SUBSCRIPTION_ID="${SUBSCRIPTION_ID:-}"

usage() {
    cat <<EOF
Usage: $0 [--config PATH] [--env NAME]

Options:
  --config PATH   Path to env config file (e.g., .ocr.dev.env or .ocr.prd.env)
  --env NAME      Logical environment label (DEV/PRD/etc.) for display only

Config file should export variables such as:
  SUBSCRIPTION_ID
  ENVIRONMENT
  OCR_RG
  OCR_ACR
  OCR_ACA_ENV
  OCR_ACA_APP
  OCR_APIM_RG
  OCR_APIM_NAME

Examples:
  $0 --config .ocr.dev.env --env DEV
  $0 --config .ocr.prd.env --env PRD

Fallbacks (if --config not supplied):
  1. .ocr-env   (legacy inspector env file)
  2. .env.local (Next.js-style project env; will be mapped to OCR_* vars)
EOF
    exit 1
}

# --------------------------- Parse arguments -----------------------------------
while [[ $# -gt 0 ]]; do
    case "$1" in
        --config)
            if [[ $# -lt 2 ]]; then
                echo "❌ --config requires a path argument"
                usage
            fi
            CONFIG_FILE="$2"
            shift 2
            ;;
        --env)
            if [[ $# -lt 2 ]]; then
                echo "❌ --env requires a name argument"
                usage
            fi
            ENVIRONMENT="$2"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown argument: $1"
            usage
            ;;
    esac
done

# --------------------------- Load configuration --------------------------------

# 1. Explicit --config
if [[ -n "$CONFIG_FILE" ]]; then
    if [[ ! -f "$CONFIG_FILE" ]]; then
        echo "❌ Config file not found: $CONFIG_FILE"
        exit 1
    fi
    # shellcheck source=/dev/null
    source "$CONFIG_FILE"

# 2. Legacy .ocr-env
elif [[ -f ".ocr-env" ]]; then
    # shellcheck source=/dev/null
    source ".ocr-env"

# 3. Next.js style .env.local
elif [[ -f ".env.local" ]]; then
    # shellcheck source=/dev/null
    source ".env.local"
fi

# --------------------------- Map .env.local style vars -------------------------
# If OCR_* vars are still empty, but Next.js style vars exist, map them.

# Resource group
if [[ -z "${OCR_RG:-}" && -n "${RESOURCE_GROUP:-}" ]]; then
    OCR_RG="$RESOURCE_GROUP"
fi

# ACR
if [[ -z "${OCR_ACR:-}" && -n "${ACR_NAME:-}" ]]; then
    OCR_ACR="$ACR_NAME"
fi

# ACA env
if [[ -z "${OCR_ACA_ENV:-}" && -n "${ENV_NAME:-}" ]]; then
    OCR_ACA_ENV="$ENV_NAME"
fi

# ACA app
if [[ -z "${OCR_ACA_APP:-}" && -n "${APP_NAME:-}" ]]; then
    OCR_ACA_APP="$APP_NAME"
fi

# Environment display label
if [[ -z "${ENVIRONMENT:-}" && -n "${ENV_NAME:-}" ]]; then
    ENVIRONMENT="$ENV_NAME"
fi

# Note: SUBSCRIPTION_ID can also be provided in any of the env files; we don't
# map it from anything else by default.

ENVIRONMENT="${ENVIRONMENT:-UNSPECIFIED}"

required_var() {
    local name="$1"
    if [[ -z "${!name:-}" ]]; then
        echo "❌ Missing required variable: $name"
        MISSING_REQUIRED=1
    fi
}

MISSING_REQUIRED=0
required_var "OCR_RG"
required_var "OCR_ACR"
required_var "OCR_ACA_ENV"
required_var "OCR_ACA_APP"
required_var "OCR_APIM_RG"
required_var "OCR_APIM_NAME"
# SUBSCRIPTION_ID is optional but recommended

if [[ "$MISSING_REQUIRED" -ne 0 ]]; then
    echo
    echo "Please set the missing variables in one of:"
    echo "  - your --config file"
    echo "  - .ocr-env"
    echo "  - .env.local (Next.js style, with at least RESOURCE_GROUP/ACR_NAME/ENV_NAME/APP_NAME)"
    exit 1
fi

# --------------------------- Azure login / subscription ------------------------

# Check az exists at all
if ! command -v az >/dev/null 2>&1; then
    echo "❌ Azure CLI 'az' not found in PATH."
    echo "   Please install Azure CLI or use Azure Cloud Shell."
    exit 1
fi

echo "🔐 Checking Azure CLI context..."
if ! az account show >/dev/null 2>&1; then
    echo "You are not logged in. Please run:"
    echo "  az login"
    exit 1
fi

CURRENT_UPN=$(az account show --query 'user.name' -o tsv 2>/dev/null || echo "unknown")
CURRENT_SUB=$(az account show --query 'id' -o tsv 2>/dev/null || echo "unknown")
CURRENT_SUB_NAME=$(az account show --query 'name' -o tsv 2>/dev/null || echo "unknown")

echo "👤 Azure user:           $CURRENT_UPN"
echo "🧾 Current subscription: $CURRENT_SUB_NAME ($CURRENT_SUB)"

if [[ -n "$SUBSCRIPTION_ID" && "$SUBSCRIPTION_ID" != "$CURRENT_SUB" ]]; then
    echo
    echo "🔁 Switching subscription to: $SUBSCRIPTION_ID"
    if ! az account set --subscription "$SUBSCRIPTION_ID" 2>/dev/null; then
        echo "❌ Failed to switch subscription. Check SUBSCRIPTION_ID and permissions."
        exit 1
    fi
    CURRENT_SUB=$(az account show --query 'id' -o tsv 2>/dev/null || echo "unknown")
    CURRENT_SUB_NAME=$(az account show --query 'name' -o tsv 2>/dev/null || echo "unknown")
    echo "✅ Now using subscription: $CURRENT_SUB_NAME ($CURRENT_SUB)"
fi

echo
echo "============================================="
echo "🔎 InvoicePipe Extraction Service Environment Inspection"
echo "============================================="
echo "Environment:       $ENVIRONMENT"
echo "Resource Group:    $OCR_RG"
echo "Subscription:      $CURRENT_SUB_NAME"
echo "============================================="
echo

# --------------------------- Helper functions ----------------------------------

print_row() {
    # type, name, status, details
    printf "%-10s | %-40s | %-10s | %s\n" "$1" "$2" "$3" "$4"
}

header() {
    echo
    printf "%-10s | %-40s | %-10s | %s\n" "TYPE" "NAME" "STATUS" "DETAILS"
    printf "%-10s-+-%-40s-+-%-10s-+-%s\n" "$(printf '%.0s-' {1..10})" "$(printf '%.0s-' {1..40})" "$(printf '%.0s-' {1..10})" "$(printf '%.0s-' {1..30})"
}

check_rg() {
    local rg="$1"
    if az group show -n "$rg" >/dev/null 2>&1; then
        local loc
        loc=$(az group show -n "$rg" --query 'location' -o tsv 2>/dev/null || echo "")
        print_row "RG" "$rg" "OK" "location=$loc"
    else
        print_row "RG" "$rg" "NOT FOUND" "Resource group not found (may not be deployed yet)"
    fi
}

check_acr() {
    local name="$1"
    if az acr show -n "$name" >/dev/null 2>&1; then
        local loginSrv
        loginSrv=$(az acr show -n "$name" --query 'loginServer' -o tsv 2>/dev/null || echo "")
        print_row "ACR" "$name" "OK" "loginServer=$loginSrv"
    else
        print_row "ACR" "$name" "NOT FOUND" "ACR not found (may not be deployed yet)"
    fi
}

check_aca_env() {
    local env="$1" rg="$2"
    if az containerapp env show -n "$env" -g "$rg" >/dev/null 2>&1; then
        local loc
        loc=$(az containerapp env show -n "$env" -g "$rg" --query 'location' -o tsv 2>/dev/null || echo "")
        print_row "ACA_ENV" "$env" "OK" "location=$loc"
    else
        print_row "ACA_ENV" "$env" "NOT FOUND" "Container Apps env not found (may not be deployed yet)"
    fi
}

check_aca_app() {
    local app="$1" rg="$2"
    if az containerapp show -n "$app" -g "$rg" >/dev/null 2>&1; then
        local image fqdn
        image=$(az containerapp show -n "$app" -g "$rg" --query 'properties.template.containers[0].image' -o tsv 2>/dev/null || echo "")
        fqdn=$(az containerapp show -n "$app" -g "$rg" --query 'properties.configuration.ingress.fqdn' -o tsv 2>/dev/null || echo "")
        print_row "ACA_APP" "$app" "OK" "image=$image; fqdn=$fqdn"
    else
        print_row "ACA_APP" "$app" "NOT FOUND" "Container App not found (may not be deployed yet)"
    fi
}

check_apim() {
    local name="$1" rg="$2"
    if az apim show -n "$name" -g "$rg" >/dev/null 2>&1; then
        local loc sku
        loc=$(az apim show -n "$name" -g "$rg" --query 'location' -o tsv 2>/dev/null || echo "")
        sku=$(az apim show -n "$name" -g "$rg" --query 'sku.name' -o tsv 2>/dev/null || echo "")
        print_row "APIM" "$name" "OK" "location=$loc; sku=$sku"
    else
        print_row "APIM" "$name" "NOT FOUND" "APIM instance not found (may not be deployed yet)"
    fi
}

check_cu() {
    local rg="$1" name="$2" type="$3"
    if az resource show -g "$rg" -n "$name" --resource-type "$type" >/dev/null 2>&1; then
        local loc kind
        loc=$(az resource show -g "$rg" -n "$name" --resource-type "$type" --query 'location' -o tsv 2>/dev/null || echo "")
        kind=$(az resource show -g "$rg" -n "$name" --resource-type "$type" --query 'kind' -o tsv 2>/dev/null || echo "")
        print_row "CU" "$name" "OK" "type=$type; location=$loc; kind=$kind"
    else
        print_row "CU" "$name" "NOT FOUND" "CU/AI resource not found (may not be deployed yet)"
    fi
}

# --------------------------- Run checks ----------------------------------------

header
check_rg "$OCR_RG"
check_acr "$OCR_ACR"
check_aca_env "$OCR_ACA_ENV" "$OCR_RG"
check_aca_app "$OCR_ACA_APP" "$OCR_RG"
check_apim "$OCR_APIM_NAME" "$OCR_APIM_RG"

echo
echo "============================================="
echo "✅ Inspection complete (read-only)"
echo "============================================="
echo "   User:         $CURRENT_UPN"
echo "   Environment:  $ENVIRONMENT"
echo "   Subscription: $CURRENT_SUB_NAME"
echo
echo "💡 Resources marked 'NOT FOUND' may not be deployed yet."
echo "💡 This is expected for DEV environment during initial setup."
echo
