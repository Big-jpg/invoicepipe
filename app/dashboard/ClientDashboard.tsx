// app/dashboard/ClientDashboard.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { InvoicePreview } from "@/components/dashboard/InvoicePreview";
import type { FileUploaderProps } from "@/components/ui/file-uploader";

const FileUploader = dynamic<FileUploaderProps>(
    () => import("@/components/ui/file-uploader").then((mod) => mod.FileUploader),
    { ssr: false }
);

// simple heuristic: ~60 KB per page
const estimatePages = (file: File) => Math.ceil(file.size / 60000);

export default function ClientDashboard() {
    const [slug, setSlug] = useState("");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    const handleExtractInvoice = async () => {
        setError("");
        setStatusMessage("Extracting and analyzing invoice...");
        try {
            const processRes = await fetch("/api/invoice/cu-process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug }),
            });

            const processData = await processRes.json();
            if (!processRes.ok) {
                throw new Error(processData.error || "Invoice processing failed.");
            }

            setStatusMessage("");
            toast("✅ Invoice processed successfully!", {
                description: "Structured data extracted.",
            });

            setShowPreview(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unexpected error.");
            setStatusMessage("");
        }
    };

    const handleReset = () => {
        setSlug("");
        setUploadedFile(null);
        setError("");
        setStatusMessage("");
        setShowPreview(false);
        toast("✨ Ready for new invoice.", { duration: 3000 });
    };

    const handleUploaded = (slug: string, file: File) => {
        setSlug(slug);
        setUploadedFile(file);
    };

    const estimatedPages = uploadedFile ? estimatePages(uploadedFile) : 0;

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between gap-12">
                <div className="w-full max-w-xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Invoice Uploader</h1>
                            <p className="text-muted-foreground">
                                Upload and extract structured data from PDF invoices
                            </p>
                        </div>
                    </div>

                    <FileUploader onUploaded={handleUploaded} disabled={!!uploadedFile} />

                    {uploadedFile && (
                        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded shadow">
                            <p className="font-semibold">{uploadedFile.name}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Estimated Pages: {estimatedPages} | Size:{" "}
                                {(uploadedFile.size / 1024).toFixed(1)} KB
                            </p>
                            <Button
                                variant="ghost"
                                className="text-red-500 mt-2"
                                onClick={handleReset}
                            >
                                Remove
                            </Button>
                        </div>
                    )}

                    {!showPreview && (
                        <Button
                            onClick={handleExtractInvoice}
                            disabled={!slug || !uploadedFile || estimatedPages > 20}
                            className="mt-4"
                        >
                            🔍 Extract Invoice Details
                        </Button>
                    )}

                    {showPreview && (
                        <Button
                            variant="secondary"
                            onClick={handleReset}
                            className="mt-4"
                        >
                            🔁 Upload Another Invoice
                        </Button>
                    )}

                    {estimatedPages > 20 && (
                        <p className="text-yellow-600 text-sm italic">
                            Large file – advanced processing may be required.
                        </p>
                    )}

                    <div className="mt-6">
                        {statusMessage && (
                            <p className="text-blue-600 animate-pulse">
                                {statusMessage}
                            </p>
                        )}
                        {error && <p className="text-red-500">⚠️ {error}</p>}
                    </div>
                </div>

                {showPreview && slug && (
                    <div className="flex-1 mt-2">
                        <h2 className="text-xl font-semibold mb-4">Invoice Preview</h2>
                        <InvoicePreview slug={slug} />
                    </div>
                )}
            </div>
        </div>
    );
}
