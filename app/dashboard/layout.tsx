// app/dashboard/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in");
        }
    }, [status, router]);

    if (status === "loading") return null;

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 px-6 py-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
