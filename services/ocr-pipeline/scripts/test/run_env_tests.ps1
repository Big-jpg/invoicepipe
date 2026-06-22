#==============================================================================
# run_env_tests.ps1 - Run all environment tests (DEV or PRD)
#==============================================================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("DEV", "PRD")]
    [string]$Environment = "PRD",
    
    [Parameter(Mandatory=$false)]
    [string]$FilePath = $env:OCR_TEST_FILE_PATH
)

Write-Host ""
Write-Host "================================================================================"
Write-Host "🚀 Contoso Invoice OCR - Environment Test Suite"
Write-Host "================================================================================"
Write-Host "🌍 Target Environment: $Environment"
Write-Host "📅 Test Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "================================================================================"
Write-Host ""

# Track test results
$TestResults = @{
    Live = $null
    APIM = $null
}

# Determine script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Test 1: Live Container App
Write-Host "═══════════════════════════════════════════════════════════════════════════════"
Write-Host "TEST 1: Live Container App Endpoints"
Write-Host "═══════════════════════════════════════════════════════════════════════════════"
Write-Host ""

try {
    if ($FilePath) {
        & "$ScriptDir\test_live.ps1" -Environment $Environment -FilePath $FilePath
    } else {
        & "$ScriptDir\test_live.ps1" -Environment $Environment
    }
    
    if ($LASTEXITCODE -eq 0) {
        $TestResults.Live = "PASS"
    } else {
        $TestResults.Live = "FAIL"
    }
}
catch {
    Write-Host "❌ Live tests failed with exception: $_" -ForegroundColor Red
    $TestResults.Live = "ERROR"
}

Write-Host ""
Write-Host ""

# Test 2: APIM Gateway
Write-Host "═══════════════════════════════════════════════════════════════════════════════"
Write-Host "TEST 2: APIM Gateway Endpoints"
Write-Host "═══════════════════════════════════════════════════════════════════════════════"
Write-Host ""

try {
    if ($FilePath) {
        & "$ScriptDir\test_apim.ps1" -Environment $Environment -FilePath $FilePath
    } else {
        & "$ScriptDir\test_apim.ps1" -Environment $Environment
    }
    
    if ($LASTEXITCODE -eq 0) {
        $TestResults.APIM = "PASS"
    } else {
        $TestResults.APIM = "FAIL"
    }
}
catch {
    Write-Host "❌ APIM tests failed with exception: $_" -ForegroundColor Red
    $TestResults.APIM = "ERROR"
}

Write-Host ""
Write-Host ""

# Summary
Write-Host "================================================================================"
Write-Host "📊 TEST SUMMARY - $Environment Environment"
Write-Host "================================================================================"
Write-Host ""

$PassCount = 0
$FailCount = 0
$ErrorCount = 0

foreach ($Test in $TestResults.Keys) {
    $Result = $TestResults[$Test]
    $Icon = switch ($Result) {
        "PASS"  { "✅"; $PassCount++; $Result }
        "FAIL"  { "❌"; $FailCount++; $Result }
        "ERROR" { "⚠️"; $ErrorCount++; $Result }
        default { "❓"; $ErrorCount++; "UNKNOWN" }
    }
    
    Write-Host "  $Icon $Test : $Result"
}

Write-Host ""
Write-Host "  Total: $($TestResults.Count) tests"
Write-Host "  Passed: $PassCount"
Write-Host "  Failed: $FailCount"
Write-Host "  Errors: $ErrorCount"
Write-Host ""

if ($FailCount -eq 0 -and $ErrorCount -eq 0) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ Some tests failed or encountered errors" -ForegroundColor Red
    exit 1
}
