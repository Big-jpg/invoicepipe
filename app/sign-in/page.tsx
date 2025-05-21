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
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
            <form
                onSubmit={handleSignIn}
                className="bg-white dark:bg-gray-900 border border-border p-8 rounded shadow max-w-sm w-full space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">Sign In</h1>

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

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <Button type="submit" className="w-full">
                    Sign In
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                    Don&apos;t have an account?{' '}
                    <a
                        href="/register"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Register here
                    </a>
                </p>
            </form>

        </main>
    );
}
