"use client";

import { Analytics } from "@vercel/analytics/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import type { FileUploaderProps } from "@/components/ui/file-uploader";

const FileUploader = dynamic<FileUploaderProps>(
    () => import("@/components/ui/file-uploader").then(mod => mod.FileUploader),
    { ssr: false }
);

export default function DashboardPage() {
    const [slug, setSlug] = useState("");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [theme, setTheme] = useState("light");
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem("invoicepipe-theme");
        const match = window.matchMedia("(prefers-color-scheme: dark)");
        const preferred = stored || (match.matches ? "dark" : "light");
        document.documentElement.classList.toggle("dark", preferred === "dark");
        setTheme(preferred);

        const listener = (e: MediaQueryListEvent) => {
            if (!stored) {
                const newTheme = e.matches ? "dark" : "light";
                document.documentElement.classList.toggle("dark", newTheme === "dark");
                setTheme(newTheme);
            }
        };
        match.addEventListener("change", listener);
        return () => match.removeEventListener("change", listener);
    }, []);

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
            if (!processRes.ok) throw new Error(processData.error || "Invoice processing failed.");
            setStatusMessage("");
            toast("✅ Invoice processed successfully!", {
                description: "Structured data extracted.",
            });
            router.push(`/invoice/card/${slug}`);
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
        toast("✨ Ready for new invoice.", { duration: 3000 });
    };

    const handleUploaded = (slug: string, file: File) => {
        setSlug(slug);
        setUploadedFile(file);
    };

    const estimatePages = (file: File) => Math.ceil(file.size / 60000);
    const estimatedPages = uploadedFile ? estimatePages(uploadedFile) : 0;

    return (
        <main className="min-h-screen w-full px-6 py-12 flex flex-col items-center gap-12">
            <Button
                variant="ghost"
                className="absolute top-6 right-6"
                onClick={() => {
                    const newTheme = theme === "dark" ? "light" : "dark";
                    document.documentElement.classList.toggle("dark", newTheme === "dark");
                    setTheme(newTheme);
                    localStorage.setItem("invoicepipe-theme", newTheme);
                }}
            >
                {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </Button>

            <div className="max-w-4xl text-center">
                <Image
                    src="/invoicepipe-logo.svg"
                    alt="InvoicePipe Logo"
                    width={300}
                    height={100}
                    className="mx-auto mb-6"
                />
                <h1 className="text-5xl font-bold">Invoice Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                    Upload and extract data from your PDF invoices
                </p>
            </div>

            <div className="w-full max-w-xl flex flex-col items-center gap-4">
                <FileUploader onUploaded={handleUploaded} disabled={!!uploadedFile} />
                {uploadedFile && (
                    <div className="w-full bg-gray-200 dark:bg-gray-800 p-4 rounded shadow">
                        <p className="font-semibold">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Estimated Pages: {estimatedPages} | Size: {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                        <Button variant="ghost" className="text-red-500 mt-2" onClick={handleReset}>
                            Remove
                        </Button>
                    </div>
                )}

                <Button
                    onClick={handleExtractInvoice}
                    disabled={!slug || !uploadedFile || estimatedPages > 20}
                    className="mt-4"
                >
                    🔍 Extract Invoice Details
                </Button>

                {estimatedPages > 20 && (
                    <p className="text-yellow-600 text-sm italic">
                        Large file – advanced processing may be required.
                    </p>
                )}
            </div>

            <div className="w-full max-w-3xl text-center mt-8">
                {statusMessage && <p className="text-blue-600 animate-pulse">{statusMessage}</p>}
                {error && <p className="text-red-500">⚠️ {error}</p>}
                {!statusMessage && !error && slug && (
                    <Button variant="secondary" onClick={handleReset} className="mt-4">
                        🔁 Start New Invoice
                    </Button>
                )}
            </div>

            <Analytics />
        </main>
    );
}
