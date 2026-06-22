# Load the required assembly
Add-Type -AssemblyName System.Net.Http

# Define the file and endpoints
# Read from environment variables with defaults
$BaseUrl = if ($env:OCR_LOCAL_BASE_URL) { $env:OCR_LOCAL_BASE_URL } else { "http://localhost:8000" }
$FilePath = if ($env:OCR_TEST_FILE_PATH) { $env:OCR_TEST_FILE_PATH } else { "LOCAL_URL_TO_PDF_WITH_EXTENSION.PDF" }

$ApiUrlAnalyze = "$BaseUrl/analyzepdf"
$ApiUrlProcess = "$BaseUrl/process-invoice/"

Write-Host "🌐 Base URL: $BaseUrl"
Write-Host "📄 Test File: $FilePath"

# Verify file existence
if (-not (Test-Path $FilePath)) {
    Write-Host "❌ PDF file not found at: $FilePath"
    exit 1
}

# Create HTTP client
$HttpClient = New-Object System.Net.Http.HttpClient

try {
    # Test 1: Analyze PDF (/analyzepdf)
    Write-Host "📤 Starting Test 1: Sending request to $ApiUrlAnalyze"
    
    $MultipartContent = New-Object System.Net.Http.MultipartFormDataContent

    Write-Host "🔍 Opening file stream..."
    try {
        $FileStream = [System.IO.File]::OpenRead($FilePath)
        if (-not $FileStream) {
            Write-Host "❌ Failed to open file stream."
            exit 1
        }
    } catch {
        Write-Host "❌ Exception opening file stream: $_"
        exit 1
    }

    Write-Host "📦 Creating HTTP stream content..."
    try {
        $FileContent = New-Object System.Net.Http.StreamContent($FileStream)
        $FileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("application/pdf")
    } catch {
        Write-Host "❌ Failed to initialize file content: $_"
        $FileStream.Dispose()
        exit 1
    }

    $MultipartContent.Add($FileContent, "file", [System.IO.Path]::GetFileName($FilePath))

    $ResponseAnalyze = $HttpClient.PostAsync($ApiUrlAnalyze, $MultipartContent).Result
    $ResultAnalyze = $ResponseAnalyze.Content.ReadAsStringAsync().Result

    if ($ResponseAnalyze.IsSuccessStatusCode) {
        Write-Host "✅ Test 1 Success:"
        Write-Output $ResultAnalyze
    } else {
        Write-Host "❌ Test 1 Error: $($ResponseAnalyze.StatusCode)"
        Write-Output $ResultAnalyze
    }

    # Dispose multipart content for Test 1
    $MultipartContent.Dispose()
    $FileStream.Dispose()

    # Test 2: Process Invoice (/process-invoice/)
    Write-Host "📤 Starting Test 2: Sending request to $ApiUrlProcess"
    
    try {
        $FileBytes = [System.IO.File]::ReadAllBytes($FilePath)
        $Base64Content = [Convert]::ToBase64String($FileBytes)
    } catch {
        Write-Host "❌ Failed to read or encode file: $_"
        exit 1
    }

    $JsonPayload = @(
        '{',
        '"filename":"{0}",' -f ([System.IO.Path]::GetFileName($FilePath)),
        '"file_content":"{0}"' -f $Base64Content,
        '}'
    ) -join ""

    $Content = New-Object System.Net.Http.StringContent($JsonPayload, [System.Text.Encoding]::UTF8, "application/json")

    $ResponseProcess = $HttpClient.PostAsync($ApiUrlProcess, $Content).Result
    $ResultProcess = $ResponseProcess.Content.ReadAsStringAsync().Result

    if ($ResponseProcess.IsSuccessStatusCode) {
        Write-Host "✅ Test 2 Success:"
        Write-Output $ResultProcess
    } else {
        Write-Host "❌ Test 2 Error: $($ResponseProcess.StatusCode)"
        Write-Output $ResultProcess
    }
}
catch {
    Write-Host "❌ Unhandled Exception:"
    Write-Output $_.Exception.Message
    Write-Output $_.Exception.StackTrace
}
finally {
    if ($HttpClient) { $HttpClient.Dispose() }
    if ($FileStream) { $FileStream.Dispose() }
    if ($Content) { $Content.Dispose() }
}
