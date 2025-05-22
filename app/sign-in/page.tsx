// app/sign-in/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-8">
                <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-6">
                    Welcome Back
                </h1>
                <form onSubmit={handleSignIn} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
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
                        Sign In
                    </Button>
                </form>
                <p className="text-center text-sm text-muted-foreground mt-4">
                    Don’t have an account?{" "}
                    <a
                        href="/register"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Register here
                    </a>
                </p>
            </div>
            <p className="text-xs text-muted-foreground mt-4 opacity-60">
                © {new Date().getFullYear()} InvoicePipe – AI for AP Automation
            </p>
        </main>
    );
}
