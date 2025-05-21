// lib/useAuth.ts
import { useState, useEffect } from "react";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("auth") === "true";
        setIsAuthenticated(isLoggedIn);
        setUser(isLoggedIn ? { name: "Mock User" } : null);
    }, []);

    return { isAuthenticated, user };
}
