// app/register/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
    const router = useRouter();

    function handleRegister() {
        // 💡 Replace with real user creation logic later
        localStorage.setItem("auth", "true");
        router.push("/dashboard");
    }

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("auth") === "true";
        if (isAuthenticated) router.push("/dashboard");
    }, [router]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold mb-6">Create an Account</h1>
            <Button size="lg" onClick={handleRegister}>
                Mock Register & Sign In
            </Button>
        </main>
    );
}
