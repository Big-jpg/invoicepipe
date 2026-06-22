"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Don't redirect based on `status` alone. Wait for session presence.
        if (status !== "loading" && !session?.user?.email) {
            router.replace("/sign-in");
        }
    }, [status, session, mounted, router]);

    if (!mounted || status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen text-muted-foreground">
                Validating session...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 px-6 py-8 overflow-y-auto">{children}</main>
        </div>
    );
}
