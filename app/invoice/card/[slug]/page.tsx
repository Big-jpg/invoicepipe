// app/invoice/card/[slug]/page.tsx

export const dynamic = "force-dynamic";

import sql from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Buffer } from "buffer";
import { InvoiceCard } from "@/components/InvoiceCard";

export default async function InvoiceCardPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let upload, invoice;
    try {
        const uploads = await sql`
    SELECT id, original_filename, filesize, uploaded_at, content
    FROM invoice_uploads
    WHERE id = ${slug}::uuid
    LIMIT 1;
    `;
        upload = uploads[0];

        const invoices = await sql`
    SELECT * FROM invoices
    WHERE filename = ${upload.original_filename}
    LIMIT 1;
    `;
        invoice = invoices[0];
    } catch (error) {
        console.error("Database query failed:", error);
        return notFound();
    }

    if (!upload || !invoice) return notFound();

    const base64 = Buffer.from(upload.content).toString("base64");
    const pdfDataUrl = `data:application/pdf;base64,${base64}`;

    return (
        <main className="bg-background text-foreground min-h-screen px-4 py-12 flex flex-col items-center justify-center">
            <InvoiceCard
                originalFilename={upload.original_filename}
                uploadedAt={new Date(upload.uploaded_at).toLocaleString()}
                filesize={upload.filesize}
                vendorName={invoice.vendor ?? ""}
                company={invoice.company ?? ""}
                invoiceId={invoice.invoice_number ?? ""}
                purchaseOrder={invoice.po_number ?? ""}
                amountDue={invoice.amount_due}
                total={invoice.total}
                documentType={invoice.document_type ?? ""}
                dueDate={invoice.due_date ?? undefined}
                customerName={invoice.customer_name ?? undefined}
                invoiceDate={invoice.invoice_date ? new Date(invoice.invoice_date).toISOString().split("T")[0] : undefined}
                invoiceTotal={invoice.invoice_total}
                subTotal={invoice.sub_total}
                totalTax={invoice.total_tax}
                pdfDataUrl={pdfDataUrl}
            />

            <div className="flex justify-center mt-8">
                <Link href="/">
                    <button className="px-8 py-3 rounded-full font-bold bg-gradient-to-r from-emerald-600 via-fuchsia-400 to-purple-500 text-white shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-cyan-400/40">
                        🏠 Back to Home
                    </button>
                </Link>
            </div>
        </main>
    );
}
