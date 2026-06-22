// app/sign-in/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError(result.error);
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <main className="min-h-screen flex bg-background text-foreground">
            {/* Left column: form */}
            <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16">
                <div className="w-full max-w-sm space-y-6">
                    <Link href="/" className="inline-flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-fuchsia-500 neon-logo" />
                        <span className="font-semibold text-sm tracking-tight">
                            InvoicePipe
                        </span>
                    </Link>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Sign in to upload, review, and export your invoices.
                        </p>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-1 text-sm">
                            <label className="text-xs font-medium text-muted-foreground">
                                Work email
                            </label>
                            <Input
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="space-y-1 text-sm">
                            <label className="text-xs font-medium text-muted-foreground">
                                Password
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-500 text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full mt-2"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>

                    <p className="text-xs text-muted-foreground text-center">
                        New to InvoicePipe?{" "}
                        <Link
                            href="/register"
                            className="text-emerald-400 hover:underline"
                        >
                            Create a free account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right column: marketing panel */}
            <div className="hidden md:flex flex-1 bg-gradient-to-br from-emerald-500/20 via-fuchsia-500/20 to-slate-900 border-l border-border/50">
                <div className="m-auto max-w-md px-10 py-12 space-y-6">
                    <p className="text-xs font-semibold tracking-[0.22em] uppercase text-emerald-200">
                        FOR AP TEAMS & BUILDERS
                    </p>
                    <h2 className="text-2xl font-bold">
                        Your invoices are already structured data. They just don&apos;t
                        know it yet.
                    </h2>
                    <p className="text-sm text-emerald-50/80">
                        InvoicePipe turns PDFs into reliable, typed fields that drop
                        straight into your finance stack or your next automation.
                    </p>
                    <ul className="text-xs text-emerald-50/80 space-y-2">
                        <li>• Tenant-isolated processing on encrypted infra</li>
                        <li>• Optimized for Australian tax invoices and GST</li>
                        <li>• Export-ready for CSV, JSON, or direct integration</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
