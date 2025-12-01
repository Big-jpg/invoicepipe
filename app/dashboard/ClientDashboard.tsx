// app/dashboard/ClientDashboard.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { InvoicePreview } from "@/components/dashboard/InvoicePreview";
import { motion, AnimatePresence } from "framer-motion";
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
    const [isProcessing, setIsProcessing] = useState(false);

    const handleExtractInvoice = async () => {
        setError("");
        setStatusMessage("Extracting fields…");
        setIsProcessing(true);
        
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
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setSlug("");
        setUploadedFile(null);
        setError("");
        setStatusMessage("");
        setShowPreview(false);
        setIsProcessing(false);
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
                <motion.div 
                    className="w-full max-w-xl space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Invoice Uploader</h1>
                            <p className="text-muted-foreground">
                                Upload and extract structured data from PDF invoices
                            </p>
                        </div>
                    </div>

                    <FileUploader onUploaded={handleUploaded} disabled={!!uploadedFile} />

                    <AnimatePresence mode="wait">
                        {uploadedFile && (
                            <motion.div 
                                className="rounded-3xl border border-border/60 bg-card/90 shadow-xl shadow-emerald-500/20 backdrop-blur-lg p-6 transition-transform hover:scale-[1.01] ease-out"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="font-semibold text-foreground">{uploadedFile.name}</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Estimated Pages: {estimatedPages} | Size:{" "}
                                    {(uploadedFile.size / 1024).toFixed(1)} KB
                                </p>
                                <Button
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600 mt-3"
                                    onClick={handleReset}
                                >
                                    Remove
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!showPreview && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <Button
                                onClick={handleExtractInvoice}
                                disabled={!slug || !uploadedFile || estimatedPages > 20 || isProcessing}
                                className="mt-4 transition-transform hover:scale-[1.02] ease-out"
                            >
                                {isProcessing ? "Processing..." : "🔍 Extract Invoice Details"}
                            </Button>
                        </motion.div>
                    )}

                    {showPreview && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Button
                                variant="secondary"
                                onClick={handleReset}
                                className="mt-4 transition-transform hover:scale-[1.02] ease-out"
                            >
                                🔁 Upload Another Invoice
                            </Button>
                        </motion.div>
                    )}

                    {estimatedPages > 20 && (
                        <motion.p 
                            className="text-yellow-600 text-sm italic"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            Large file – advanced processing may be required.
                        </motion.p>
                    )}

                    <AnimatePresence mode="wait">
                        {statusMessage && (
                            <motion.div
                                className="mt-6 rounded-3xl border border-border/60 bg-card/90 shadow-xl shadow-emerald-500/20 backdrop-blur-lg p-6"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <p className="text-emerald-400 font-medium">
                                        {statusMessage}
                                    </p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    This typically takes 5–16 seconds based on real-world documents.
                                </p>
                                {/* Loading shimmer overlay */}
                                <div className="mt-4 h-32 rounded-xl bg-gradient-to-r from-card via-muted/20 to-card animate-pulse" />
                            </motion.div>
                        )}
                        {error && (
                            <motion.p 
                                className="text-red-500 mt-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                ⚠️ {error}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                <AnimatePresence mode="wait">
                    {showPreview && slug && (
                        <motion.div 
                            className="flex-1 mt-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-xl font-semibold mb-4">Invoice Preview</h2>
                            <InvoicePreview slug={slug} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
