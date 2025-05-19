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

export default function Home() {
  const [slug, setSlug] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [theme, setTheme] = useState("light");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("replate-theme");
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
      toast("✅ Content Understanding: Invoice processed!", {
        descriptionClassName: "text-black dark:text-white",
        className: "bg-white text-black dark:bg-gray-900 dark:text-white",
        description: "Invoice fields extracted and saved.",
      });
      router.push(`/invoice/card/${slug}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error.");
      }
      setStatusMessage("");
    }
  };

  const handleReset = () => {
    setSlug("");
    setUploadedFile(null);
    setError("");
    setStatusMessage("");
    toast("✨ New Invoice Started", {
      descriptionClassName: "text-black dark:text-white",
      className: "bg-white text-black dark:bg-gray-900 dark:text-white",
      description: "Upload a new invoice when you're ready.",
      duration: 4000,
    });
  };

  const handleUploaded = (slug: string, file: File) => {
    setSlug(slug);
    setUploadedFile(file);
  };

  const estimatePages = (file: File) => {
    return Math.ceil(file.size / 60000); // ~60KB per page heuristic
  };

  const estimatedPages = uploadedFile ? estimatePages(uploadedFile) : 0;

  return (
    <main className="min-h-screen w-full bg-background text-foreground transition-colors px-6 py-12 flex flex-col items-center justify-start gap-12 relative">
      <Button
        variant="ghost"
        className="absolute top-6 right-6 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/40"
        onClick={() => {
          const newTheme = theme === "dark" ? "light" : "dark";
          document.documentElement.classList.toggle("dark", newTheme === "dark");
          setTheme(newTheme);
          localStorage.setItem("replate-theme", newTheme);
        }}
      >
        {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </Button>

      <div className="w-full max-w-4xl space-y-5 text-center">
        <div className="flex justify-center mb-8 mt-2">
          <Image
            src="/mercycare-logo.svg"
            alt="MercyCare Logo"
            width={362}
            height={105}
            className="h-16 w-auto select-none"
            draggable={false}
          />
        </div>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">MercyCare Invoice Demo</h1>
        <p className="text-lg text-muted-foreground">Demonstrate Automated Invoice Processing</p>
        <p className="text-lg text-muted-foreground italic">Upload a PDF invoice and extract structured metadata</p>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center gap-4">
        <FileUploader onUploaded={handleUploaded} disabled={!!uploadedFile} />

        {uploadedFile && (
          <div className="flex items-center justify-between w-full bg-gray-400 dark:bg-gray-800 rounded-lg px-4 py-3 mt-3 shadow">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="font-semibold text-teal-700 dark:text-teal-500">Ready:</span>
              <span className="font-mono text-sm text-gray-900">{uploadedFile.name}</span>
              <span className="text-xs text-gray-900">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
            <Button
              variant="ghost"
              className="text-red-500 dark:text-red-300 ml-4 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:shadow-red-500/40"
              onClick={handleReset}
              tabIndex={0}
            >
              Remove
            </Button>
          </div>
        )}

        <Button
          onClick={handleExtractInvoice}
          disabled={!slug || !uploadedFile || estimatedPages > 20}
          className="mt-4 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-emerald-400/40"
        >
          🔍 Extract Invoice Details
        </Button>

        {uploadedFile && estimatedPages > 20 && (
          <p className="text-yellow-500 text-sm italic">File appears to be quite long — advanced processing may be needed.</p>
        )}
      </div>

      <div className="w-full max-w-5xl space-y-4">
        {statusMessage && <p className="text-blue-500 font-medium animate-pulse text-center">{statusMessage}</p>}
        {error && <p className="text-red-500 font-mono text-center">⚠️ {error}</p>}
        {!statusMessage && !error && slug && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={handleReset}
              variant="secondary"
              className="mt-4 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40"
            >
              🔁 Start New Invoice
            </Button>
          </div>
        )}
      </div>
      <Analytics />
    </main>
  );
}
