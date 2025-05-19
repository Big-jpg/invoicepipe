import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import DocumentIntelligence, {
    getLongRunningPoller,
    isUnexpected
} from "@azure-rest/ai-document-intelligence";
import { normalizeDIFields } from "@/lib/normalize-di-fields";
import type { DIInvoiceFields } from "@/lib/normalize-di-fields";

const endpoint = process.env.AZURE_DOC_INTEL_ENDPOINT!;
const key = process.env.AZURE_DOC_INTEL_KEY!;

async function getUploadWithRetry(slug: string, attempts = 4, delayMs = 250) {
    for (let i = 0; i < attempts; i++) {
        try {
            const result = await sql`
                SELECT content, original_filename FROM invoice_uploads
                WHERE id = ${slug}::uuid LIMIT 1;
            `;
            if (result.length > 0) return result[0];
            if (i < attempts - 1) await new Promise(res => setTimeout(res, delayMs));
        } catch (e) {
            console.error(`[Retry] SQL error on attempt ${i + 1}:`, e);
        }
    }

    if (process.env.NODE_ENV !== "production") {
        try {
            const allSlugs = await sql`SELECT id FROM invoice_uploads LIMIT 20;`;
            console.warn(`[Retry] Available slugs:`, allSlugs.map(r => r.id));
        } catch (err) {
            console.error("[Retry] Failed to list slugs:", err);
        }
    }

    return null;
}

export async function POST(req: NextRequest) {
    try {
        const { slug } = await req.json();

        if (!slug || typeof slug !== "string" || !/^[0-9a-fA-F-]{36}$/.test(slug)) {
            return NextResponse.json({ error: "Missing or invalid slug." }, { status: 400 });
        }

        const upload = await getUploadWithRetry(slug, 4, 500);
        if (!upload || !upload.content) {
            return NextResponse.json({ error: "Uploaded PDF content is missing." }, { status: 404 });
        }

        const buffer = upload.content;
        const client = DocumentIntelligence(endpoint, { key });

        const initialResponse = await client
            .path("/documentModels/{modelId}:analyze", "prebuilt-invoice")
            .post({ contentType: "application/pdf", body: buffer });

        if (isUnexpected(initialResponse)) {
            return NextResponse.json({ error: "Azure rejected initial request." }, { status: 502 });
        }

        const poller = getLongRunningPoller(client, initialResponse);
        const result = await poller.pollUntilDone();

        const analyzeResult = (result.body as {
            analyzeResult?: { documents?: { fields?: DIInvoiceFields }[] }
        }).analyzeResult;

        const invoice: DIInvoiceFields = analyzeResult?.documents?.[0]?.fields ?? {};
        const {
            invoiceId,
            purchaseOrder,
            amountDue,
            vendorName,
            company,
            total,
            documentType,
            dueDate,
            customerName,
            invoiceDate,
            invoiceTotal,
            subTotal,
            totalTax,
        } = normalizeDIFields(invoice);

        const inserted = await sql`
            INSERT INTO invoices (
                filename,
                vendor,
                company,
                invoice_number,
                po_number,
                invoice_date,
                due_date,
                amount_due,
                total,
                document_type,
                customer_name,
                invoice_total,
                sub_total,
                total_tax
            ) VALUES (
                ${upload.original_filename},
                ${vendorName},
                ${company},
                ${invoiceId},
                ${purchaseOrder},
                ${invoiceDate},
                ${dueDate},
                ${amountDue},
                ${total},
                ${documentType},
                ${customerName},
                ${invoiceTotal},
                ${subTotal},
                ${totalTax}
            ) RETURNING id;
        `;

        return NextResponse.json({
            success: true,
            invoice_id: inserted[0].id,
            result: {
                invoiceId,
                purchaseOrder,
                amountDue,
                vendorName,
                company,
                total,
                documentType,
                dueDate,
                customerName,
                invoiceDate,
                invoiceTotal,
                subTotal,
                totalTax
            }
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Invoice processing failed.";
        console.error("[POST] Unexpected error:", err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
