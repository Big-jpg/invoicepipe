import { NextRequest, NextResponse } from "next/server";
import { analyzeWithContentUnderstanding } from "@/lib/azure-content-understanding";
import sql from "@/lib/db";
import { normalizeCUFields } from "@/lib/normalize-cu-fields";

/**
 * POST /api/invoice/cu-process
 * Processes an uploaded invoice using Azure Content Understanding
 * Matches production implementation from Azure Content Understanding build
 */
export async function POST(req: NextRequest) {
    const startTime = Date.now();
    
    try {
        const { slug } = await req.json();
        
        if (!slug) {
            console.error("[CU] Missing slug in request body");
            return NextResponse.json({ error: "Missing slug parameter." }, { status: 400 });
        }

        console.log(`[CU] Processing invoice with slug: ${slug}`);

        // Fetch the uploaded PDF from database
        const upload = await sql`
            SELECT content, original_filename, filesize 
            FROM invoice_uploads
            WHERE id = ${slug}::uuid 
            LIMIT 1;
        `;
        
        if (!upload.length) {
            console.error(`[CU] No upload found for slug: ${slug}`);
            return NextResponse.json({ error: "Upload not found." }, { status: 404 });
        }

        const { content: buffer, original_filename, filesize } = upload[0];
        console.log(`[CU] Processing file: ${original_filename} (${filesize} bytes)`);

        // Call Azure Content Understanding API
        console.log("[CU] Calling Azure Content Understanding API...");
        const cuStartTime = Date.now();
        
        const result = await analyzeWithContentUnderstanding(buffer);
        
        const cuDuration = Date.now() - cuStartTime;
        console.log(`[CU] Azure API responded in ${cuDuration}ms`);

        // Validate response
        if (!result || typeof result !== "object") {
            console.error("[CU] Invalid response from Azure CU:", result);
            return NextResponse.json({ 
                error: "Azure Content Understanding returned invalid result." 
            }, { status: 502 });
        }

        // Log raw response for debugging (truncated in production)
        if (process.env.NODE_ENV === "development") {
            console.log("[CU] Raw API Response:", JSON.stringify(result, null, 2));
        }

        // Normalize fields to standard invoice format
        const normalized = normalizeCUFields(result);
        console.log("[CU] Normalized Invoice Fields:", normalized);

        // Log individual fields for debugging
        Object.entries(normalized).forEach(([key, value]) => {
            if (value !== null) {
                console.log(`[CU]   ${key}: ${value}`);
            }
        });

        // Validate critical fields
        const criticalFields = {
            invoiceId: normalized.invoiceId,
            total: normalized.total,
            vendorName: normalized.vendorName,
        };

        const missingFields = Object.entries(criticalFields)
            .filter(([, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            console.warn(`[CU] Missing critical fields: ${missingFields.join(", ")}`);
            return NextResponse.json({
                error: "Critical invoice fields not extracted. Manual review required.",
                missingFields,
                normalized,
                raw: process.env.NODE_ENV === "development" ? result : undefined,
            }, { status: 422 });
        }

        // Insert into database
        console.log("[CU] Inserting invoice into database...");
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
                ${original_filename},
                ${normalized.vendorName},
                ${normalized.company},
                ${normalized.invoiceId},
                ${normalized.purchaseOrder ?? normalized.poNumber},
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

        const invoiceId = inserted[0]?.id;
        const totalDuration = Date.now() - startTime;
        
        console.log(`[CU] ✅ Successfully processed invoice ${invoiceId} in ${totalDuration}ms`);

        return NextResponse.json({
            success: true,
            invoice_id: invoiceId,
            normalized,
            processing_time_ms: totalDuration,
            azure_api_time_ms: cuDuration,
            raw: process.env.NODE_ENV === "development" ? result : undefined,
        });
        
    } catch (err: unknown) {
        const totalDuration = Date.now() - startTime;
        
        // Enhanced error logging
        if (err instanceof Error) {
            console.error(`[CU] ❌ Error after ${totalDuration}ms:`, {
                message: err.message,
                stack: err.stack,
                name: err.name,
            });
        } else {
            console.error(`[CU] ❌ Unknown error after ${totalDuration}ms:`, err);
        }

        const message = err instanceof Error 
            ? err.message 
            : typeof err === "string" 
            ? err 
            : "Invoice processing failed";

        return NextResponse.json({ 
            error: message,
            processing_time_ms: totalDuration,
        }, { status: 500 });
    }
}
