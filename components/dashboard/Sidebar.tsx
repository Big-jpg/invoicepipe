// components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/history", label: "History" },
    { href: "/dashboard/settings", label: "Settings" },
    { href: "/dashboard/support", label: "Support" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-gray-100 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 py-6 px-4">
            <h2 className="text-2xl font-bold mb-6">InvoicePipe</h2>
            <nav className="space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800",
                            pathname === link.href && "bg-gray-300 dark:bg-gray-800 font-semibold"
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
