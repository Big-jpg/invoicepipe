"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const localTheme = localStorage.getItem("invoicepipe-theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const resolvedTheme = localTheme || (systemPrefersDark ? "dark" : "light");

        document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;
    return <>{children}</>;
}
