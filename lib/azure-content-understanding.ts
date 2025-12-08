// lib/azure-content-understanding.ts

type HeadersMap = Record<string, string>;

export interface CUField {
    content?: string;
    valueString?: string;
    valueNumber?: number;
    valueDate?: string;
    [key: string]: unknown;
}

export interface CUFields {
    [key: string]: CUField | undefined;
}

export interface CUContent {
    fields?: CUFields;
    tables?: unknown[];
    [key: string]: unknown;
}

export interface CUResult {
    status?: string;
    result?: { contents?: CUContent[] };
    contents?: CUContent[];
    fields?: CUFields;
    [key: string]: unknown;
}

// Environment variables
const endpoint = process.env.AZURE_CU_ENDPOINT!;
const apiVersion = process.env.AZURE_CU_API_VERSION!;
const analyzerId = process.env.AZURE_CU_ANALYZER_ID || "custom-tax-invoice-advanced"; 
const subscriptionKey = process.env.AZURE_CU_KEY!;

/**
 * Analyzes a PDF document using Azure Content Understanding (Document Intelligence)
 * @param fileUrlOrBuffer - Either a URL string or a Buffer containing the PDF data
 * @param timeoutSeconds - Maximum time to wait for processing (default: 3600 seconds)
 * @param pollingIntervalMs - Time between polling attempts (default: 1000ms)
 * @returns Parsed result from Content Understanding API
 */
export async function analyzeWithContentUnderstanding(
    fileUrlOrBuffer: string | Buffer,
    timeoutSeconds: number = 3600,
    pollingIntervalMs: number = 1000
): Promise<CUResult> {
    // Validate environment variables
    if (!endpoint) throw new Error("AZURE_CU_ENDPOINT is not configured");
    if (!apiVersion) throw new Error("AZURE_CU_API_VERSION is not configured");
    if (!subscriptionKey) throw new Error("AZURE_CU_KEY is not configured");

    let data: string | Buffer;
    let headers: HeadersMap;
    
    // Determine if input is URL or binary data
    if (
        typeof fileUrlOrBuffer === "string" &&
        (fileUrlOrBuffer.startsWith("http://") || fileUrlOrBuffer.startsWith("https://"))
    ) {
        // URL-based analysis
        data = JSON.stringify({ url: fileUrlOrBuffer });
        headers = {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": subscriptionKey,
            "x-ms-useragent": "invoicepipe-nextjs",
        };
    } else if (Buffer.isBuffer(fileUrlOrBuffer)) {
        // Binary PDF data analysis
        data = fileUrlOrBuffer;
        headers = {
            "Content-Type": "application/pdf",
            "Ocp-Apim-Subscription-Key": subscriptionKey,
            "x-ms-useragent": "invoicepipe-nextjs",
        };
    } else {
        throw new Error("fileUrlOrBuffer must be a URL string or a Buffer");
    }

    // Step 1: Begin analysis with stringEncoding parameter
    const analyzeUrl = `${endpoint}/contentunderstanding/analyzers/${analyzerId}:analyze?api-version=${apiVersion}&stringEncoding=utf16`;
    
    const resp = await fetch(analyzeUrl, {
        method: "POST",
        headers,
        body: data as BodyInit,
    });

    if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`[CU] Analyze failed (${resp.status}): ${errorText}`);
    }
    
    const operationLocation = resp.headers.get("operation-location");
    if (!operationLocation) {
        throw new Error("[CU] No operation-location header received from Azure");
    }

    // Step 2: Poll for result
    const startTime = Date.now();
    let status: string = "notStarted";
    let result: CUResult | null = null;
    
    const pollHeaders: HeadersMap = {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Content-Type": "application/json",
        "x-ms-useragent": "invoicepipe-nextjs",
    };

    while (true) {
        // Check timeout
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed > timeoutSeconds) {
            throw new Error(`[CU] Operation timed out after ${timeoutSeconds} seconds`);
        }

        // Wait before polling
        await new Promise((resolve) => setTimeout(resolve, pollingIntervalMs));

        // Poll the operation status
        const pollResp = await fetch(operationLocation, { 
            method: "GET",
            headers: pollHeaders 
        });

        if (!pollResp.ok) {
            const errorText = await pollResp.text();
            throw new Error(`[CU] Polling failed (${pollResp.status}): ${errorText}`);
        }

        result = (await pollResp.json()) as CUResult;
        status = (result.status || "").toLowerCase();

        // Check terminal states
        if (status === "succeeded") {
            return result;
        } else if (status === "failed") {
            throw new Error(`[CU] Operation failed: ${JSON.stringify(result)}`);
        }
        
        // Continue polling for: notStarted, running, etc.
    }
}

/**
 * Helper function to extract a field value from CU result
 * Tries valueString, valueNumber, valueDate, then content in that order
 */
export function extractFieldValue(field: CUField | undefined): string | number | null {
    if (!field) return null;
    
    return (
        field.valueString ??
        field.valueNumber ??
        field.valueDate ??
        field.content ??
        null
    );
}

/**
 * Extract all fields from a CU result into a flat object
 */
export function extractFields(result: CUResult): Record<string, string | number | null> {
    const fields = result?.result?.contents?.[0]?.fields ?? result?.fields ?? {};
    
    const extracted: Record<string, string | number | null> = {};
    
    for (const [key, value] of Object.entries(fields)) {
        extracted[key] = extractFieldValue(value);
    }
    
    return extracted;
}
