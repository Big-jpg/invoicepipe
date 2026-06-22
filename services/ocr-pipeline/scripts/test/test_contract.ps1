# test_contract.ps1 - API Contract Validation Tests
# This script tests the invoice processing API against expected outputs

param(
    [string]$BaseUrl = $env:OCR_LOCAL_BASE_URL,
    [string]$FixturesPath = "$PSScriptRoot\fixtures"
)

# Default base URL if not provided
if (-not $BaseUrl) {
    $BaseUrl = "http://localhost:8000"
}

Write-Host "================================================================================"
Write-Host "🧪 API Contract Validation Tests"
Write-Host "================================================================================"
Write-Host "📍 Base URL: $BaseUrl"
Write-Host "📂 Fixtures: $FixturesPath"
Write-Host ""

# Check if fixtures directory exists
if (-not (Test-Path $FixturesPath)) {
    Write-Host "❌ Fixtures directory not found: $FixturesPath"
    exit 1
}

# Find all expected JSON files
$ExpectedFiles = Get-ChildItem -Path $FixturesPath -Filter "*.expected.json"

if ($ExpectedFiles.Count -eq 0) {
    Write-Host "⚠️  No test fixtures found in $FixturesPath"
    Write-Host "👉 Add .expected.json files to the fixtures directory"
    exit 1
}

Write-Host "Found $($ExpectedFiles.Count) test fixture(s)"
Write-Host ""

$Results = @()

foreach ($ExpectedFile in $ExpectedFiles) {
    $PdfName = $ExpectedFile.Name -replace '\.expected\.json$', '.pdf'
    $PdfPath = Join-Path $FixturesPath $PdfName
    
    Write-Host "🔍 Testing: $PdfName"
    
    if (-not (Test-Path $PdfPath)) {
        Write-Host "  ⚠️  PDF file not found: $PdfPath"
        Write-Host "  👉 Create $PdfName or update the expected JSON filename"
        $Results += $false
        Write-Host ""
        continue
    }
    
    try {
        # Load expected output
        $Expected = Get-Content $ExpectedFile.FullName | ConvertFrom-Json
        
        # Read PDF and encode to base64
        Write-Host "  📤 Sending $PdfName to API..."
        $FileBytes = [System.IO.File]::ReadAllBytes($PdfPath)
        $Base64Content = [Convert]::ToBase64String($FileBytes)
        
        # Prepare request
        $Body = @{
            filename = $PdfName
            file_content = $Base64Content
        } | ConvertTo-Json
        
        # Send request
        $Response = Invoke-RestMethod -Uri "$BaseUrl/process-invoice/" -Method Post -Body $Body -ContentType "application/json"
        
        # Compare outputs
        $Differences = @()
        
        # Check each expected field
        foreach ($Property in $Expected.PSObject.Properties) {
            $Key = $Property.Name
            $ExpectedValue = $Property.Value
            
            if (-not $Response.PSObject.Properties[$Key]) {
                $Differences += "Missing field in actual output: $Key"
                continue
            }
            
            $ActualValue = $Response.$Key
            
            # Skip comparison for tolerance fields
            if ($Key -match 'confidence|timestamp|id|guid') {
                continue
            }
            
            # Compare values
            if ($ExpectedValue -is [double] -or $ExpectedValue -is [int]) {
                # Numeric comparison with tolerance
                $Tolerance = 0.01
                if ([Math]::Abs($ExpectedValue - $ActualValue) -gt $Tolerance) {
                    $Differences += "Field '$Key': Numeric difference exceeds tolerance (expected=$ExpectedValue, actual=$ActualValue)"
                }
            }
            elseif ($ExpectedValue -is [string]) {
                # String comparison (case-insensitive)
                if ($ExpectedValue.Trim().ToLower() -ne $ActualValue.Trim().ToLower()) {
                    $Differences += "Field '$Key': String mismatch (expected='$ExpectedValue', actual='$ActualValue')"
                }
            }
            else {
                # Direct comparison
                if ($ExpectedValue -ne $ActualValue) {
                    $Differences += "Field '$Key': Value mismatch (expected=$ExpectedValue, actual=$ActualValue)"
                }
            }
        }
        
        # Check for extra fields
        foreach ($Property in $Response.PSObject.Properties) {
            $Key = $Property.Name
            if (-not $Expected.PSObject.Properties[$Key] -and $Key -notmatch 'confidence|timestamp|id|guid') {
                $Differences += "Extra field in actual output: $Key"
            }
        }
        
        # Report results
        if ($Differences.Count -eq 0) {
            Write-Host "  ✅ Contract matches expected output"
            $Results += $true
        }
        else {
            Write-Host "  ❌ Contract validation failed:"
            foreach ($Diff in $Differences) {
                Write-Host "    $Diff"
            }
            $Results += $false
        }
    }
    catch {
        Write-Host "  ❌ Test failed with exception: $_"
        $Results += $false
    }
    
    Write-Host ""
}

# Summary
Write-Host "================================================================================"
$Passed = ($Results | Where-Object { $_ -eq $true }).Count
$Total = $Results.Count
Write-Host "📊 Results: $Passed/$Total tests passed"

if ($Results -contains $false) {
    Write-Host "❌ Some contract tests failed"
    exit 1
}
else {
    Write-Host "✅ All contract tests passed!"
    exit 0
}
