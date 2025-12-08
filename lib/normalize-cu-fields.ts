// lib/normalize-cu-fields.ts

export interface CUField {
    content?: string;
    valueNumber?: number;
    valueString?: string;
    valueDate?: string;
    [key: string]: unknown;
}

export interface CUFields {
    [key: string]: CUField | undefined;
}

export interface CUContent {
    fields?: CUFields;
}

export interface CURawResult {
    result?: {
        contents?: CUContent[];
        documents?: CUContent[];
    };
    contents?: CUContent[];
    documents?: CUContent[];
    fields?: CUFields;
}

export interface NormalizedInvoice {
    invoiceId: string | null;
    purchaseOrder: string | null;
    amountDue: number | string | null;
    vendorName: string | null;
    company: string | null;
    total: number | string | null;
    documentType: string | null;
    dueDate: string | null;
    customerName: string | null;
    invoiceDate: string | null;
    invoiceTotal: number | string | null;
    subTotal: number | string | null;
    totalTax: number | string | null;
    vendorAddress: string | null;
    customerAddress: string | null;
    billingAddress: string | null;
    vendorTaxId: string | null;
    customerTaxId: string | null;
    poNumber: string | null;
}

/**
 * Normalizes Azure Content Understanding result into a standardized invoice format
 * Matches the production implementation from Azure DI build
 */
export function normalizeCUFields(result: CURawResult): NormalizedInvoice {
    // Extract fields from various possible locations in the response
    const fields: CUFields =
        result?.result?.contents?.[0]?.fields ??
        result?.result?.documents?.[0]?.fields ??
        result?.contents?.[0]?.fields ??
        result?.documents?.[0]?.fields ??
        result?.fields ??
        {};

    /**
     * Extract string value from field, trying multiple value types
     */
    const getString = (key: string): string | null => {
        const field = fields[key];
        if (!field) return null;
        return field.valueString ?? field.valueDate ?? field.content ?? null;
    };

    /**
     * Extract numeric or string value from field
     */
    const getNumberOrString = (key: string): number | string | null => {
        const field = fields[key];
        if (!field) return null;
        return field.valueNumber ?? field.valueString ?? field.content ?? null;
    };

    return {
        // Core invoice fields (matching Azure DI OutputSchema)
        invoiceId: getString("InvoiceId"),
        purchaseOrder: getString("PurchaseOrder"),
        amountDue: getNumberOrString("AmountDue"),
        vendorName: getString("VendorName"),
        company: getString("Company") ?? getString("CustomerName"),
        total: getNumberOrString("Total"),
        documentType: getString("DocumentType"),
        dueDate: getString("DueDate"),
        customerName: getString("CustomerName"),
        invoiceDate: getString("InvoiceDate"),
        invoiceTotal: getNumberOrString("InvoiceTotal"),
        subTotal: getNumberOrString("SubTotal"),
        totalTax: getNumberOrString("TotalTax"),
        
        // Extended fields (matching Azure DI OutputSchema)
        vendorAddress: getString("VendorAddress"),
        customerAddress: getString("CustomerAddress"),
        billingAddress: getString("BillingAddress"),
        vendorTaxId: getString("VendorTaxId"),
        customerTaxId: getString("CustomerTaxId"),
        poNumber: getString("PONumber") ?? getString("PurchaseOrder"),
    };
}

/**
 * Extract raw field value with proper type handling
 * Matches the production implementation logic
 */
export function extractFieldValue(field: CUField | undefined): string | number | null {
    if (!field) return null;
    
    // Try value types in priority order: valueString, valueNumber, valueDate, content
    return (
        field.valueString ??
        field.valueNumber ??
        field.valueDate ??
        field.content ??
        null
    );
}

/**
 * Extract all fields from result into a flat key-value object
 */
export function extractAllFields(result: CURawResult): Record<string, string | number | null> {
    const fields: CUFields =
        result?.result?.contents?.[0]?.fields ??
        result?.result?.documents?.[0]?.fields ??
        result?.contents?.[0]?.fields ??
        result?.documents?.[0]?.fields ??
        result?.fields ??
        {};

    const extracted: Record<string, string | number | null> = {};
    
    for (const [key, value] of Object.entries(fields)) {
        extracted[key] = extractFieldValue(value);
    }
    
    return extracted;
}
