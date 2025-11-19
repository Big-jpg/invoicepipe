// app/register-alt/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterAltPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");

            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
                callbackUrl: "/dashboard",
            });

            if (result?.error) throw new Error(result.error);
            router.push(result?.url ?? "/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex bg-background text-foreground">
            {/* Left: value prop */}
            <div className="hidden md:flex flex-1 bg-gradient-to-br from-primary/30 via-secondary/30 to-background border-r border-border/50">
                <div className="m-auto max-w-md px-10 py-12 space-y-6">
                    <p className="text-xs font-semibold tracking-[0.22em] uppercase text-muted-foreground">
                        START FREE
                    </p>
                    <h2 className="text-2xl font-bold">
                        Spin up a serious invoice pipeline in under 5 minutes.
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Create a free InvoicePipe account, upload a handful of invoices,
                        and see exactly how much manual keying you can eliminate.
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-2">
                        <li>• 100 free invoices every month</li>
                        <li>• No credit card required</li>
                        <li>• Built for Australian AP teams and integrators</li>
                    </ul>
                </div>
            </div>

            {/* Right: form */}
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
                            Create your account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            A few details and you&apos;re ready to start processing invoices.
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-1 text-sm">
                            <label className="text-xs font-medium text-muted-foreground">
                                Full name
                            </label>
                            <Input
                                type="text"
                                placeholder="Jess AP-Lead"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
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
                            {loading ? "Creating account..." : "Create free account"}
                        </Button>
                    </form>

                    <p className="text-xs text-muted-foreground text-center">
                        Already using InvoicePipe?{" "}
                        <Link
                            href="/sign-in-alt"
                            className="text-emerald-400 hover:underline"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
