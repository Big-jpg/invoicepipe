// components/dashboard/InvoicePreview.tsx
"use client";

import { InvoiceCard } from "@/components/InvoiceCard";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Invoice {
    vendor: string | null;
    company: string | null;
    invoice_number: string | null;
    po_number: string | null;
    amount_due: number | null;
    total: number | null;
    document_type: string | null;
    due_date: string | null;
    customer_name: string | null;
    invoice_date: string | null;
    invoice_total: number | null;
    sub_total: number | null;
    total_tax: number | null;
}

interface Upload {
    id: string;
    original_filename: string;
    filesize: number;
    uploaded_at: string;
    content: string; // base64 string
}

interface Props {
    slug: string;
}

export function InvoicePreview({ slug }: Props) {
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [upload, setUpload] = useState<Upload | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError("");

            try {
                const res = await fetch(`/api/invoice/card/${slug}`);
                const isJSON = res.headers.get("content-type")?.includes("application/json");

                if (!res.ok) {
                    const fallback = isJSON ? await res.json() : await res.text();
                    throw new Error(
                        typeof fallback === "string"
                            ? fallback
                            : fallback.error || "Failed to load invoice"
                    );
                }

                const data = await res.json();
                if (!data.invoice || !data.upload) {
                    throw new Error("Missing invoice data or upload payload.");
                }

                setUpload(data.upload);
                setInvoice(data.invoice);
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : "An unknown error occurred";
                setError(message);
            } finally {
                setLoading(false);
            }
        }

        if (slug) fetchData();
    }, [slug]);


    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <p className="text-muted-foreground animate-pulse">Loading invoice preview…</p>
            </motion.div>
        );
    }
    
    if (error) {
        return (
            <motion.p 
                className="text-red-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                ⚠️ {error}
            </motion.p>
        );
    }
    
    if (!invoice || !upload) return null;

    const pdfDataUrl = `data:application/pdf;base64,${upload.content}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <InvoiceCard
                originalFilename={upload.original_filename}
                uploadedAt={new Date(upload.uploaded_at).toLocaleString()}
                filesize={upload.filesize}
                vendorName={invoice.vendor ?? undefined}
                company={invoice.company ?? undefined}
                invoiceId={invoice.invoice_number ?? undefined}
                purchaseOrder={invoice.po_number ?? undefined}
                amountDue={invoice.amount_due ?? undefined}
                total={invoice.total ?? undefined}
                documentType={invoice.document_type ?? undefined}
                dueDate={invoice.due_date ?? undefined}
                customerName={invoice.customer_name ?? undefined}
                invoiceDate={
                    invoice.invoice_date
                        ? new Date(invoice.invoice_date).toISOString().split("T")[0]
                        : undefined
                }
                invoiceTotal={invoice.invoice_total ?? undefined}
                subTotal={invoice.sub_total ?? undefined}
                totalTax={invoice.total_tax ?? undefined}
                pdfDataUrl={pdfDataUrl}
            />
        </motion.div>
    );

}
