// app/api/invoice/card/[slug]/route.ts
import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(_: Request, context: { params: { slug: string } }) {
    const { slug } = context.params;

    if (!slug || !/^[0-9a-fA-F-]{36}$/.test(slug)) {
        return NextResponse.json({ error: "Invalid or missing slug." }, { status: 400 });
    }

    try {
        const uploads = await sql`
        SELECT id, original_filename, filesize, uploaded_at, encode(content, 'base64') AS content
        FROM invoice_uploads
        WHERE id = ${slug}::uuid
        LIMIT 1;
    `;
        const upload = uploads[0];

        if (!upload) {
            return NextResponse.json({ error: "Upload not found." }, { status: 404 });
        }

        const invoices = await sql`
        SELECT * FROM invoices
        WHERE filename = ${upload.original_filename}
        LIMIT 1;
    `;
        const invoice = invoices[0];

        if (!invoice) {
            return NextResponse.json({ error: "Invoice metadata not found." }, { status: 404 });
        }

        return NextResponse.json({ upload, invoice });
    } catch (error) {
        console.error("[API] Failed to fetch invoice preview:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
