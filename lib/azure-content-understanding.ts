// lib/azure-content-understanding.ts

type HeadersMap = Record<string, string>;

export interface CUField {
    content?: string;
    valueNumber?: number;
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

// Next.js provides native fetch, no import needed

const endpoint = process.env.AZURE_CU_ENDPOINT!;
const apiVersion = process.env.AZURE_CU_API_VERSION!;
const analyzerId = process.env.AZURE_CU_ANALYZER_ID || "custom-tax-invoice-advanced"; 
const subscriptionKey = process.env.AZURE_CU_KEY!;

export async function analyzeWithContentUnderstanding(
    fileUrlOrBuffer: string | Buffer
): Promise<CUResult> {
    let data: string | Buffer;
    let headers: HeadersMap;
    if (
        typeof fileUrlOrBuffer === "string" &&
        (fileUrlOrBuffer.startsWith("http://") || fileUrlOrBuffer.startsWith("https://"))
    ) {
        data = JSON.stringify({ url: fileUrlOrBuffer });
        headers = {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": subscriptionKey,
            "x-ms-useragent": "cu-sample-node",
        };
    } else if (Buffer.isBuffer(fileUrlOrBuffer)) {
        data = fileUrlOrBuffer;
        headers = {
            "Content-Type": "application/octet-stream",
            "Ocp-Apim-Subscription-Key": subscriptionKey,
            "x-ms-useragent": "cu-sample-node",
        };
    } else {
        throw new Error("fileUrlOrBuffer must be a URL or a Buffer");
    }

    const analyzeUrl = `${endpoint}/contentunderstanding/analyzers/${analyzerId}:analyze?api-version=${apiVersion}`;
    const resp = await fetch(analyzeUrl, {
        method: "POST",
        headers,
        body: data as BodyInit,
    });

    if (!resp.ok) throw new Error(`[CU] Analyze failed: ${await resp.text()}`);
    const operationLocation = resp.headers.get("operation-location");
    if (!operationLocation) throw new Error("[CU] No operation-location header received");

    // 2. Poll for result
    let status: string = "notStarted";
    let result: CUResult | null = null;
    const pollHeaders: HeadersMap = {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Content-Type": "application/json",
    };
    let attempts = 0;
    while (status !== "succeeded" && status !== "failed" && attempts < 60) {
        await new Promise((res) => setTimeout(res, 2000));
        const pollResp = await fetch(operationLocation, { headers: pollHeaders });
        result = (await pollResp.json()) as CUResult;
        status = (result.status || "").toLowerCase();
        attempts++;
    }
    if (status !== "succeeded") throw new Error(`[CU] Operation failed: ${JSON.stringify(result)}`);
    return result!;
}
