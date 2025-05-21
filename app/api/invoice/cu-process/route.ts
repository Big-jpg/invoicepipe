import { NextRequest, NextResponse } from "next/server";
import { analyzeWithContentUnderstanding } from "@/lib/azure-content-understanding";
import sql from "@/lib/db";
import { normalizeCUFields } from "@/lib/normalize-cu-fields";

export async function POST(req: NextRequest) {
    try {
        const { slug } = await req.json();
        if (!slug) {
            console.error("[CU] Missing slug in request body");
            return NextResponse.json({ error: "Missing slug." }, { status: 400 });
        }

        const upload = await sql`
            SELECT content, original_filename FROM invoice_uploads
            WHERE id = ${slug}::uuid LIMIT 1;
        `;
        if (!upload.length) {
            console.error("[CU] No upload found for slug:", slug);
            return NextResponse.json({ error: "No upload found." }, { status: 404 });
        }

        const buffer = upload[0].content;
        console.log("[CU] Calling Content Understanding API...");
        const result = await analyzeWithContentUnderstanding(buffer);

        if (!result || typeof result !== "object") {
            console.error("[CU] Invalid CU response:", result);
            return NextResponse.json({ error: "Azure CU returned invalid result." }, { status: 502 });
        }

        console.log("[CU] CU API Raw Response:", JSON.stringify(result, null, 2));

        const normalized = normalizeCUFields(result);
        console.log("[CU] Normalized Invoice Fields:", normalized);

        Object.entries(normalized).forEach(([k, v]) =>
            console.log(`[CU] Field: ${k} =`, v)
        );

        if (!normalized.invoiceId || !normalized.total) {
            console.warn("[CU] Critical fields missing, skipping insert");
            return NextResponse.json({
                error: "Critical invoice fields not extracted. Please review manually.",
                normalized,
                raw: result,
            }, { status: 422 });
        }

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
                ${upload[0].original_filename},
                ${normalized.vendorName},
                ${normalized.company},
                ${normalized.invoiceId},
                ${normalized.purchaseOrder},
                ${normalized.invoiceDate},
                ${normalized.dueDate},
                ${normalized.amountDue},
                ${normalized.total},
                ${normalized.documentType},
                ${normalized.customerName},
                ${normalized.invoiceTotal},
                ${normalized.subTotal},
                ${normalized.totalTax}
            ) RETURNING id;
        `;

        console.log("[CU] Inserted invoice with id:", inserted[0]?.id);

        return NextResponse.json({
            success: true,
            invoice_id: inserted[0]?.id,
            normalized,
            raw: result,
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : typeof err === "string" ? err : "CU Processing Failed";
        console.error("[CU] Unexpected error:", err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
