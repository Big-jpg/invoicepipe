"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-white to-slate-100 dark:from-[#0c0c0f] dark:to-[#1a1a1d] text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="text-center py-24 max-w-2xl">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Automate Your Invoices with <span className="text-blue-500">InvoicePipe</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Upload PDF invoices and extract structured data instantly with AI.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-6 py-3">
              🚀 Try It Now
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="ghost" className="text-lg px-6 py-3">
              Learn More ↓
            </Button>
          </Link>
        </div>
      </section>

      {/* Preview Image */}
      <section className="py-12 w-full max-w-5xl">
        <Image
          src="/ogImage.png"
          alt="InvoicePipe Preview"
          width={1200}
          height={630}
          className="rounded-xl shadow-xl border border-gray-200 dark:border-gray-800"
        />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 w-full max-w-4xl text-center space-y-16">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why InvoicePipe?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built for speed, precision, and clarity — InvoicePipe takes the manual work out of invoice processing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-semibold">⚡ Blazing Fast Extraction</h3>
            <p className="text-muted-foreground mt-2">Powered by Azure AI, optimized for Australian invoices.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-semibold">🧠 Smart Field Detection</h3>
            <p className="text-muted-foreground mt-2">No templates. No per-vendor config. Just results.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-semibold">🔒 Secure by Default</h3>
            <p className="text-muted-foreground mt-2">Runs on encrypted infra. Private, tenant-isolated processing.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-semibold">📦 Structured Output</h3>
            <p className="text-muted-foreground mt-2">JSON, CSV, or Excel — ready for accounting or sync.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">Start Processing Smarter Today</h2>
        <p className="mt-4 text-muted-foreground">
          Get started with 100 free invoices. No credit card required.
        </p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-6 py-3">
              Upload Your First Invoice →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-sm text-muted-foreground pb-10">
        &copy; {new Date().getFullYear()} InvoicePipe. Built with ❤️ in WA.
      </footer>
    </main>
  );
}