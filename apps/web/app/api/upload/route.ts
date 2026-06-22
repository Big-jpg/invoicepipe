import { createHash, randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalFilename = file.name;
    const sha256 = createHash("sha256").update(buffer).digest("hex");
    const uuid = randomUUID();

    try {
        // Check for duplicate by sha256 before insert
        const existing = await sql`
        SELECT id FROM invoice_uploads WHERE sha256 = ${sha256} LIMIT 1;
    `;

        if (existing.length > 0) {
            return NextResponse.json(
                { error: "Invoice already exists in database, try another record." },
                { status: 409 }
            );
        }

        // Estimate page count based on average PDF page size
        const estimatedPageCount = Math.max(1, Math.ceil(buffer.length / 60000)); // Aligns with frontend heuristic

        // Insert new PDF
        const result = await sql`
        INSERT INTO invoice_uploads (
        id, original_filename, content, filesize, sha256, estimated_page_count
        ) VALUES (
        ${uuid}, ${originalFilename}, ${buffer}, ${buffer.length}, ${sha256}, ${estimatedPageCount}
        ) RETURNING id;
    `;

        return NextResponse.json({ id: result[0].id });
    } catch (err) {
        console.error("Upload DB error:", err);
        return NextResponse.json({ error: "Failed to save invoice to database" }, { status: 500 });
    }
}
