// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");

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
            if (result?.ok) router.push(result.url ?? "/dashboard");
            else throw new Error("Failed to sign in after registration.");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-8">
                <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-6">
                    Create an Account
                </h1>
                <form onSubmit={handleRegister} className="space-y-4">
                    <Input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}
                    <Button type="submit" className="w-full">
                        Create Account
                    </Button>
                </form>
                <p className="text-center text-sm text-muted-foreground mt-4">
                    Already have an account?{" "}
                    <a
                        href="/sign-in"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Sign in here
                    </a>
                </p>
            </div>
            <p className="text-xs text-muted-foreground mt-4 opacity-60">
                © {new Date().getFullYear()} InvoicePipe – Empowering AP Automation
            </p>
        </main>
    );
}
