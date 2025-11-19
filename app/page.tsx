"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AltLandingPage() {
    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Top Bar */}
            <header className="w-full border-b border-border/60">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-fuchsia-500 neon-logo" />
                        <span className="font-semibold tracking-tight text-sm sm:text-base">
                            InvoicePipe
                        </span>
                    </Link>
                    <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
                        <Link href="#how-it-works" className="hover:text-foreground">
                            How it works
                        </Link>
                        <Link href="#use-cases" className="hover:text-foreground">
                            Use cases
                        </Link>
                        <Link href="#pricing" className="hover:text-foreground">
                            Pricing
                        </Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link href="/sign-in">
                            <Button variant="ghost" size="sm" className="text-sm">
                                Sign in
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm" className="text-sm">
                                Get started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="flex-1 border-b border-border/60">
                <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center">
                    <div className="space-y-6">
                        <p className="inline-flex items-center gap-2 text-xs font-medium rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            AI for AP teams that hate manual entry
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                            Turn messy{" "}
                            <span className="text-emerald-400">invoices into data</span>{" "}
                            your systems can actually use.
                        </h1>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
                            Upload a PDF, get back clean, typed invoice fields in seconds.
                            Built for Australian suppliers, AP teams, and automation-first
                            businesses.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/dashboard">
                                <Button size="lg" className="px-7 py-3 text-base">
                                    🚀 Upload an invoice
                                </Button>
                            </Link>
                            <Link href="#how-it-works">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-dashed border-border/70 bg-background/40"
                                >
                                    See how it works ↓
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4 pt-4 text-xs sm:text-sm text-muted-foreground">
                            <div>
                                <p className="font-semibold text-foreground">100 invoices</p>
                                <p className="opacity-80">Free every month</p>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">&lt; 20s</p>
                                <p className="opacity-80">Typical extraction time</p>
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">AU-first</p>
                                <p className="opacity-80">Tuned for local tax invoices</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side hero card */}
                    <div className="relative">
                        <div className="rounded-2xl border border-border bg-card/90 shadow-xl shadow-emerald-500/10 backdrop-blur p-4 sm:p-6">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground mb-3">
                                LIVE PREVIEW
                            </p>
                            <div className="rounded-xl border border-border/60 bg-background/80 overflow-hidden">
                                <Image
                                    src="/ogImage.png"
                                    alt="InvoicePipe dashboard preview"
                                    width={1200}
                                    height={630}
                                    className="w-full h-auto"
                                />
                            </div>
                            <div className="mt-4 grid gap-3 text-xs sm:text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Detected vendor</span>
                                    <span className="font-medium">Acme Supplies Pty Ltd</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Total (incl. GST)</span>
                                    <span className="font-semibold text-emerald-400">$4,892.10</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Confidence score</span>
                                    <span className="font-medium">98.3%</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:block absolute -bottom-6 -right-4">
                            <div className="rounded-xl bg-emerald-500 text-slate-950 text-xs px-4 py-2 shadow-lg">
                                “We went from hours of keying to a 30-second upload.” – AP Lead
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="border-b border-border/60">
                <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                            From PDF to structured data in three steps.
                        </h2>
                        <p className="text-muted-foreground">
                            InvoicePipe sits between your inbox and your finance stack. No
                            templates, no “training per vendor,” just upload and go.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-3">
                        <div className="space-y-2">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-sm font-semibold text-emerald-300">
                                1
                            </div>
                            <h3 className="font-semibold">Upload a PDF</h3>
                            <p className="text-sm text-muted-foreground">
                                Drag-and-drop a tax invoice or route an email attachment
                                directly into InvoicePipe.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-9 h-9 rounded-xl bg-fuchsia-500/15 flex items-center justify-center text-sm font-semibold text-fuchsia-300">
                                2
                            </div>
                            <h3 className="font-semibold">We extract the fields</h3>
                            <p className="text-sm text-muted-foreground">
                                Azure Document Intelligence plus our normalization layer
                                detect vendor, totals, GST, PO, dates, and more.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-sm font-semibold text-blue-300">
                                3
                            </div>
                            <h3 className="font-semibold">You export or sync</h3>
                            <p className="text-sm text-muted-foreground">
                                Export as CSV/JSON or wire into your accounting system,
                                RPA, or low-code flows.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use cases & Pricing teaser */}
            <section
                id="use-cases"
                className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-secondary/5 to-background"
            >
                <div className="max-w-6xl mx-auto px-6 py-16 grid gap-12 lg:grid-cols-2">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                            Designed for teams that already have too many tabs open.
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            InvoicePipe is a thin, sharp tool – not another monolith. Drop
                            it into your existing workflows and let it take care of the
                            boring part.
                        </p>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>• AP teams cleaning up emailed supplier invoices</li>
                            <li>• Finance leads tracking spend across multiple entities</li>
                            <li>• Automation folks feeding data into Power BI or Fabric</li>
                            <li>• Small businesses who just want their evenings back</li>
                        </ul>
                    </div>
                    <div id="pricing" className="lg:pl-8">
                        <div className="rounded-2xl border border-border bg-background/80 shadow-lg p-6 space-y-4">
                            <h3 className="text-xl font-semibold">Simple, usage-based pricing</h3>
                            <p className="text-sm text-muted-foreground">
                                Start free, then scale when you&apos;re ready.
                            </p>
                            <div className="rounded-xl border border-border/70 bg-card/80 px-5 py-4 flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Starter</span>
                                    <span className="text-sm text-muted-foreground">Free</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Up to 100 invoices / month. Ideal for trial, prototypes,
                                    and small AP teams.
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Higher-volume and API-only plans for integrators and
                                automation teams are coming soon.
                            </p>
                            <Link href="/register">
                                <Button className="w-full mt-2">Create a free account</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-xs text-muted-foreground">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p>© {new Date().getFullYear()} InvoicePipe. Built with ❤️ in WA.</p>
                    <div className="flex gap-4">
                        <Link href="/sign-in" className="hover:text-foreground">
                            Sign in
                        </Link>
                        <Link href="/register" className="hover:text-foreground">
                            Register
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}
