#!/bin/bash
set -e

# ====================================================================================
# Contoso Invoice Automation Deployment Script - Environment Driven Edition
# ====================================================================================

# ---- Load Deployment Environment Variables ----
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
else
    echo "❌ Error: .env.local file not found."
    exit 1
fi

# ---- Validate required environment variables ----
: "${RESOURCE_GROUP:?Missing RESOURCE_GROUP}"
: "${ACR_NAME:?Missing ACR_NAME}"
: "${LOCATION:?Missing LOCATION}"
: "${ENV_NAME:?Missing ENV_NAME}"
: "${APP_NAME:?Missing APP_NAME}"
: "${IMAGE_TAG:?Missing IMAGE_TAG}"

# ---- Compute derived variables ----
IMAGE_NAME="$ACR_NAME.azurecr.io/contosofunctionapp:$IMAGE_TAG"
REGISTRY_SERVER="$ACR_NAME.azurecr.io"

# ---- Pre-flight: check jq installed ----
if ! command -v jq &> /dev/null; then
    echo "❌ Error: jq is not installed."
    echo "👉 Install jq: https://stedolan.github.io/jq/download/"
    exit 1
fi

# ---- Wait for Docker Engine ----
echo "⏳ Waiting for Docker Engine..."
until docker info >/dev/null 2>&1; do
  echo "🔄 Docker not ready yet, retrying..."
  sleep 2
done
echo "✅ Docker Engine is ready."

# ---- Build Docker image ----
echo "🔨 Building Docker image..."
docker build -t contosofunctionapp:$IMAGE_TAG .
docker tag contosofunctionapp:$IMAGE_TAG $IMAGE_NAME

# ---- Authenticate to Azure ACR properly ----
echo "🔐 Authenticating to Azure Container Registry..."
ACR_TOKEN_JSON=$(az acr login --name $ACR_NAME --expose-token --output json)

if [ -z "$ACR_TOKEN_JSON" ]; then
    echo "❌ Failed to obtain ACR token from Azure CLI."
    exit 1
fi

ACR_USERNAME=$(echo "$ACR_TOKEN_JSON" | jq -r '.username')
ACR_PASSWORD=$(echo "$ACR_TOKEN_JSON" | jq -r '.accessToken')

# ---- Docker login using exchanged ACR access token ----
echo "🔑 Logging into ACR Docker registry..."
echo "$ACR_PASSWORD" | docker login "$REGISTRY_SERVER" -u "$ACR_USERNAME" --password-stdin

# ---- Push Docker image to ACR ----
echo "🚀 Pushing Docker image to ACR..."
docker push "$IMAGE_NAME"

# ---- Check if container app exists ----
echo "🔍 Checking if container app '$APP_NAME' exists..."
EXISTS=$(az containerapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "name" -o tsv 2>/dev/null || echo "")

if [ "$EXISTS" == "$APP_NAME" ]; then
  echo "♻️  Updating existing container app..."
  az containerapp update \
    --name "$APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --image "$IMAGE_NAME" \
    --cpu 0.5 \
    --memory 1.0Gi
else
  echo "🚀 Creating new container app..."
  az containerapp create \
    --name "$APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --environment "$ENV_NAME" \
    --image "$IMAGE_NAME" \
    --target-port 8000 \
    --ingress external \
    --registry-server "$REGISTRY_SERVER" \
    --registry-username "$ACR_USERNAME" \
    --registry-password "$ACR_PASSWORD" \
    --cpu 0.5 \
    --memory 1.0Gi
fi

# ---- Output live app URL ----
echo "🌐 Live container app URL:"
az containerapp show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "properties.configuration.ingress.fqdn" -o tsv

echo "✅ Deployment completed successfully."

# ====================================================================================
# ---- Cleanup ----

echo "🧹 Cleaning up local Docker images..."

docker rmi contosofunctionapp:$IMAGE_TAG || true

docker rmi $IMAGE_NAME || true

echo "🧼 Local Docker images cleaned up."

echo "🎉 Deployment script finished successfully!"

echo "🚀 Contoso Invoice Automation is now live!"

echo "Thank you for using the Contoso Invoice Automation Deployment Script!"

echo "For any issues, please refer to the documentation or contact support."

# ====================================================================================
# Note: This script is designed to be run in a CI/CD pipeline or local development environment.
# It assumes that the Azure CLI and Docker are installed and configured properly.
# Ensure you have the necessary permissions to create and manage Azure resources.
# ====================================================================================
# ---- End of deployment script ----
# ====================================================================================