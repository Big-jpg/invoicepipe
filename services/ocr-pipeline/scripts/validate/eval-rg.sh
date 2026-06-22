#!/usr/bin/env bash
set -euo pipefail

# Usage: ./eval-rg.sh [resource-group] [subscription-id(optional)]
RG="${1:-contoso-azr-dev-rg}"
SUB="${2:-}"

banner () {
    echo ""
    echo "╔══════════════════════════════════════════════════════╗"
    printf "║    %-50s ║\n" "$1"
    echo "╚══════════════════════════════════════════════════════╝"
    echo ""
}

section () {
    echo ""
    echo "─── $1 ─────────────────────────────────────────────────────"
}

if ! command -v az >/dev/null 2>&1; then
    echo "Azure CLI (az) is not installed or not on PATH."
    exit 1
fi

banner "Azure Resource Group State Evaluation"

echo "Target resource group : $RG"
if [[ -n "$SUB" ]]; then
    echo "Target subscription: $SUB"
    az account set --subscription "$SUB"
fi

echo ""
echo "Checking login / subscription..."
az account show -o table >/dev/null

section "Resource Group Info"
az group show -n "$RG" \
    --query '{name:name, location:location, managedBy:managedBy, tags:tags}' \
    -o jsonc

section "Resource Inventory (counts by type)"
az resource list -g "$RG" \
    --query "[].type" -o tsv | sort | uniq -c | sort -nr

section "App Services (Web Apps / Functions)"
az webapp list -g "$RG" \
    --query '[].{name:name, kind:kind, state:state, host:defaultHostName, vnet:virtualNetworkSubnetId}' \
    -o table || echo "No Web Apps found."

section "Function Apps (if any, via Microsoft.Web/sites)"
az functionapp list -g "$RG" \
    --query '[].{name:name, state:state, host:defaultHostName}' \
    -o table || echo "No Function Apps found."

section "Container Apps"
az containerapp list -g "$RG" \
    --query '[].{name:name, env:properties.environmentId, fqdn:properties.configuration.ingress.fqdn, ingress:properties.configuration.ingress.external, targetPort:properties.configuration.ingress.targetPort}' \
    -o table || echo "No Container Apps found."

section "API Management"
az apim list -g "$RG" \
    --query '[].{name:name, sku:sku.name, location:location, vnet:virtualNetworkType, publisherEmail:publisherEmail, privateIP:privateIPAddresses[0]}' \
    -o table || echo "No APIM instances found."

section "Redis Cache"
az redis list -g "$RG" \
    --query '[].{name:name, sku:sku.name, family:sku.family, capacity:sku.capacity, host:hostName, sslPort:sslPort, publicNetworkAccess:publicNetworkAccess}' \
    -o table || echo "No Redis instances found."

section "SQL Servers & Databases"
az sql server list -g "$RG" \
    --query '[].{name:name, fqdn:fullyQualifiedDomainName, version:version}' \
    -o table || echo "No SQL servers found."

for server in $(az sql server list -g "$RG" --query '[].name' -o tsv 2>/dev/null || true); do
    echo ""
    echo "Databases on server: $server"
    az sql db list -g "$RG" -s "$server" \
        --query '[].{name:name, status:status, maxSizeGB:maxSizeBytes}' \
        -o table
done

section "Storage Accounts"
az storage account list -g "$RG" \
    --query '[].{name:name, kind:kind, sku:sku.name, httpsOnly:enableHttpsTrafficOnly}' \
    -o table || echo "No storage accounts found."

section "Virtual Networks & Subnets"
az network vnet list -g "$RG" \
    --query '[].{name:name, addressPrefixes:addressSpace.addressPrefixes, subnets:subnets[].name}' \
    -o jsonc || echo "No VNets found."

section "Network Security Groups"
az network nsg list -g "$RG" \
    --query '[].{name:name, location:location, rules:length(securityRules)}' \
    -o table || echo "No NSGs found."

section "Private Endpoints"
az network private-endpoint list -g "$RG" \
    --query '[].{name:name, subnet:subnet.id, target:privateLinkServiceConnections[0].privateLinkServiceId, groupId:privateLinkServiceConnections[0].groupIds[0]}' \
    -o table || echo "No private endpoints found."

section "Private DNS Zones"
az network private-dns zone list -g "$RG" \
    --query '[].{name:name, resourceGroup:resourceGroup}' \
    -o table || echo "No private DNS zones found."

zones=$(az network private-dns zone list -g "$RG" --query '[].name' -o tsv 2>/dev/null || true)

for z in $zones; do
    echo ""
    echo "VNet links for Private DNS zone: $z"
    # Don't let failures kill the whole script
    az network private-dns link vnet list -g "$RG" -z "$z" \
        --query '[].{name:name, vnet:virtualNetwork.id, registrationEnabled:registrationEnabled}' \
        -o table 2>/dev/null || echo "  (no VNet links or listing not supported for this zone)"
done


section "Public IP Addresses"
az network public-ip list -g "$RG" \
    --query '[].{name:name, ipAddress:ipAddress, sku:sku.name, allocation:publicIpAllocationMethod}' \
    -o table || echo "No Public IPs found."

section "Logic Apps (Standard / Consumption)"
# Logic App (Consumption)
az resource list -g "$RG" --resource-type "Microsoft.Logic/workflows" \
    --query '[].{name:name, type:type, location:location}' \
    -o table || true

# Logic App (Standard as Web Apps with kind 'functionapp,workflowapp')
echo ""
echo "Logic Apps (Standard) candidates (workflowapp kind):"
az webapp list -g "$RG" \
    --query "[?contains(kind, 'workflowapp')].{name:name, state:state, host:defaultHostName}" \
    -o table || true

section "Global Health Check (provisioning states)"
az resource list -g "$RG" \
    --query '[].{name:name, type:type, state:properties.provisioningState}' \
    -o table

echo ""
echo "Done. Review the sections above for:"
echo "• Container App FQDNs + ingress"
echo "• APIM SKU and VNet mode"
echo "• Private Endpoints and Private DNS mappings"
echo "• Web Apps / Function Apps and their VNet integration"
echo ""
echo "Use this snapshot as the baseline before wiring APIM into your container app."
