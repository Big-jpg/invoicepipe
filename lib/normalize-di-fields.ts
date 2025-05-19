// lib/normalize-di-fields.ts

export interface NormalizedInvoiceDI {
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
}

export interface DIFieldCurrency {
    amount?: number;
    currencyCode?: string;
}
export interface DIField {
    valueString?: string;
    content?: string;
    valueDate?: string;
    valueCurrency?: DIFieldCurrency;
    valueNumber?: number;
    valueArray?: unknown[];
}

export interface DIInvoiceFields {
    [key: string]: DIField | undefined;
}

export function normalizeDIFields(invoice: DIInvoiceFields): NormalizedInvoiceDI {
    const extract = (field: string): string | null =>
        invoice[field]?.valueString ??
        invoice[field]?.content ??
        invoice[field]?.valueDate ??
        null;

    const extractCurrency = (field: string): number | string | null =>
        invoice[field]?.valueCurrency?.amount ??
        invoice[field]?.valueNumber ??
        invoice[field]?.valueString ??
        invoice[field]?.content ??
        null;

    return {
        invoiceId: extract("InvoiceId"),
        purchaseOrder: extract("PurchaseOrder"),
        amountDue: extractCurrency("AmountDue"),
        vendorName: extract("VendorName"),
        company: extract("Company") ?? extract("CustomerName"),
        total: extractCurrency("InvoiceTotal") || extractCurrency("Total"),
        documentType: extract("DocumentType") ?? null,
        dueDate: extract("DueDate"),
        customerName: extract("CustomerName"),
        invoiceDate: extract("InvoiceDate"),
        invoiceTotal: extractCurrency("InvoiceTotal"),
        subTotal: extractCurrency("SubTotal"),
        totalTax: extractCurrency("TotalTax"),
    };
}
