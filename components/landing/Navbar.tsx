import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Navbar() {
    const { data: session } = useSession();
    const isAuthenticated = !!session;
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const stored = localStorage.getItem("invoicepipe-theme");
        const match = window.matchMedia("(prefers-color-scheme: dark)");
        const preferred = stored || (match.matches ? "dark" : "light");
        document.documentElement.classList.toggle("dark", preferred === "dark");
        setTheme(preferred);

        const listener = (e: MediaQueryListEvent) => {
            if (!stored) {
                const newTheme = e.matches ? "dark" : "light";
                document.documentElement.classList.toggle("dark", newTheme === "dark");
                setTheme(newTheme);
            }
        };
        match.addEventListener("change", listener);
        return () => match.removeEventListener("change", listener);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        setTheme(newTheme);
        localStorage.setItem("invoicepipe-theme", newTheme);
    };

    return (
        <header className="w-full border-b border-border/20 backdrop-blur bg-white/60 dark:bg-background/80 sticky top-0 z-50">
            <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight">InvoicePipe</Link>
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Button variant="ghost" size="sm" onClick={toggleTheme}>
                                {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
                            </Button>
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm">Dashboard</Button>
                            </Link>
                            <Button size="sm" variant="destructive" onClick={() => signOut({ callbackUrl: "/" })}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in">
                                <Button variant="ghost" size="sm">Sign In</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Register</Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
