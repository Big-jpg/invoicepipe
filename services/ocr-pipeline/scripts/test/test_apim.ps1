#==============================================================================
# test_apim.ps1 - Test APIM gateway endpoints
#==============================================================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("DEV", "PRD")]
    [string]$Environment = "PRD",
    
    [Parameter(Mandatory=$false)]
    [string]$FilePath = $env:OCR_TEST_FILE_PATH
)

# Default file path if not provided
if (-not $FilePath) {
    $FilePath = "C:\Users\rossf\Desktop\Invoices\Bidfood_Invoice_for_customer_245130_I66080861.pdf"
}

# Load the required assembly
Add-Type -AssemblyName System.Net.Http

Write-Host "================================================================================"
Write-Host "🧪 APIM Gateway Tests"
Write-Host "================================================================================"
Write-Host "🌍 Environment: $Environment"
Write-Host "📄 Test File: $FilePath"
Write-Host ""

# Select APIM URL and subscription key based on environment
if ($Environment -eq "DEV") {
    $ApimUrl = if ($env:OCR_DEV_APIM_URL) { $env:OCR_DEV_APIM_URL } else { "https://contoso-apim-dev.azure-api.net/ocr" }
    $SubscriptionKey = if ($env:OCR_DEV_APIM_SUBSCRIPTION_KEY) { $env:OCR_DEV_APIM_SUBSCRIPTION_KEY } else { "YOUR_DEV_APIM_KEY_HERE" }
} else {
    $ApimUrl = if ($env:OCR_PRD_APIM_URL) { $env:OCR_PRD_APIM_URL } else { "https://contoso-apim.azure-api.net/invoice" }
    $SubscriptionKey = if ($env:OCR_PRD_APIM_SUBSCRIPTION_KEY) { $env:OCR_PRD_APIM_SUBSCRIPTION_KEY } else { "5405f15bced34763b89a3f98712b714a" }
}

Write-Host "📍 APIM URL: $ApimUrl"
Write-Host "🔑 Subscription Key: $($SubscriptionKey.Substring(0, [Math]::Min(8, $SubscriptionKey.Length)))..."
Write-Host ""

# Construct endpoints
$ApiUrlAnalyze = "$ApimUrl/analyzepdf"
$ApiUrlProcess = "$ApimUrl/process-invoice/"

# Verify file existence
if (-not (Test-Path $FilePath)) {
    Write-Host "❌ PDF file not found at: $FilePath" -ForegroundColor Red
    Write-Host "👉 Set OCR_TEST_FILE_PATH environment variable or provide -FilePath parameter"
    exit 1
}

# Check for placeholder subscription key
if ($SubscriptionKey -like "*YOUR_*") {
    Write-Host "⚠️  Warning: Subscription key appears to be a placeholder" -ForegroundColor Yellow
    Write-Host "👉 Update the environment configuration with a valid APIM subscription key"
    Write-Host ""
}

# Create and configure HTTP client
$HttpClient = [System.Net.Http.HttpClient]::new()
$HttpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", $SubscriptionKey)
$HttpClient.Timeout = [TimeSpan]::FromSeconds(120)

try {
    #
    # Test 1: /analyzepdf (multipart/form-data)
    #
    Write-Host "📤 Test 1: POST $ApiUrlAnalyze" -ForegroundColor Cyan
    
    $Multipart = [System.Net.Http.MultipartFormDataContent]::new()
    $Stream    = [System.IO.File]::OpenRead($FilePath)
    $FileCont  = [System.Net.Http.StreamContent]::new($Stream)
    $FileCont.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("application/pdf")
    $Multipart.Add($FileCont, "file", [System.IO.Path]::GetFileName($FilePath))
    
    try {
        $Resp1 = $HttpClient.PostAsync($ApiUrlAnalyze, $Multipart).Result
        $Body1 = $Resp1.Content.ReadAsStringAsync().Result
        
        if ($Resp1.IsSuccessStatusCode) {
            Write-Host "✅ Test 1 succeeded ($($Resp1.StatusCode)):" -ForegroundColor Green
            Write-Output $Body1
        } else {
            Write-Host "❌ Test 1 failed ($($Resp1.StatusCode)):" -ForegroundColor Red
            Write-Output $Body1
        }
    }
    catch {
        Write-Host "❌ Test 1 failed with exception:" -ForegroundColor Red
        Write-Host "   $_"
        if ($_.Exception.InnerException) {
            Write-Host "   Inner: $($_.Exception.InnerException.Message)"
        }
        Write-Host ""
        Write-Host "⚠️  Endpoint may be unreachable or not deployed yet" -ForegroundColor Yellow
    }
    finally {
        $Multipart.Dispose()
        $Stream.Dispose()
    }
    
    Write-Host ""
    
    #
    # Test 2: /process-invoice/ (JSON with base64 payload)
    #
    Write-Host "📤 Test 2: POST $ApiUrlProcess" -ForegroundColor Cyan
    
    $Bytes    = [System.IO.File]::ReadAllBytes($FilePath)
    $Base64   = [Convert]::ToBase64String($Bytes)
    $Payload  = @{
        filename     = [System.IO.Path]::GetFileName($FilePath)
        file_content = $Base64
    } | ConvertTo-Json -Depth 2
    
    $StringContent = [System.Net.Http.StringContent]::new($Payload, [System.Text.Encoding]::UTF8, "application/json")
    
    try {
        $Resp2 = $HttpClient.PostAsync($ApiUrlProcess, $StringContent).Result
        $Body2 = $Resp2.Content.ReadAsStringAsync().Result
        
        if ($Resp2.IsSuccessStatusCode) {
            Write-Host "✅ Test 2 succeeded ($($Resp2.StatusCode)):" -ForegroundColor Green
            Write-Output $Body2
        } else {
            Write-Host "❌ Test 2 failed ($($Resp2.StatusCode)):" -ForegroundColor Red
            Write-Output $Body2
        }
    }
    catch {
        Write-Host "❌ Test 2 failed with exception:" -ForegroundColor Red
        Write-Host "   $_"
        if ($_.Exception.InnerException) {
            Write-Host "   Inner: $($_.Exception.InnerException.Message)"
        }
        Write-Host ""
        Write-Host "⚠️  Endpoint may be unreachable or not deployed yet" -ForegroundColor Yellow
    }
    finally {
        $StringContent.Dispose()
    }
}
catch {
    Write-Host "❌ Unhandled exception:" -ForegroundColor Red
    Write-Host "   $_"
}
finally {
    if ($HttpClient) { $HttpClient.Dispose() }
}

Write-Host ""
Write-Host "================================================================================"
Write-Host "✅ APIM tests completed"
Write-Host "================================================================================"
