// components/dashboard/InvoicePreview.tsx
"use client";

import { InvoiceCard } from "@/components/InvoiceCard";
import { useEffect, useState } from "react";

interface Props {
    slug: string;
}

export function InvoicePreview({ slug }: Props) {
    const [invoice, setInvoice] = useState<any>(null);
    const [upload, setUpload] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/invoice/card/${slug}`); // You may want to create this API route
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to load invoice");
                setUpload(data.upload);
                setInvoice(data.invoice);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (slug) fetchData();
    }, [slug]);

    if (loading) return <p className="text-muted-foreground animate-pulse">Loading invoice preview…</p>;
    if (error) return <p className="text-red-500">⚠️ {error}</p>;
    if (!invoice || !upload) return null;

    const base64 = typeof upload.content === "string" ? upload.content : Buffer.from(upload.content).toString("base64");
    const pdfDataUrl = `data:application/pdf;base64,${base64}`;

    return (
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
    );
}
