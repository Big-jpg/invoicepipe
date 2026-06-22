/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./lib/**/*.{ts,tsx}",
    ],
    darkMode: "class", // Enable Chakra/Horizon compatibility
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)", "sans-serif"],
                mono: ["var(--font-geist-mono)", "monospace"],
            },
            borderRadius: {
                xl: "1.25rem",
                "2xl": "1.5rem",
            },
            boxShadow: {
                glow: "0 0 0 3px rgba(59, 130, 246, 0.4)",
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
