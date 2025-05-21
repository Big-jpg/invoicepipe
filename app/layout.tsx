// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/landing/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "InvoicePipe – Streamlined Invoice Processing",
  description:
    "Upload your invoice PDFs and let InvoicePipe extract, structure, and prepare your data for action. Fast, accurate, and built for automation.",
  openGraph: {
    title: "InvoicePipe – Streamlined Invoice Processing",
    description:
      "Upload your invoice PDFs and let InvoicePipe extract, structure, and prepare your data for action. Fast, accurate, and built for automation.",
    url: "https://invoicepipe.site",
    siteName: "InvoicePipe",
    images: [
      {
        url: "/ogImage.png",
        width: 1200,
        height: 630,
        alt: "InvoicePipe – Invoice Automation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoicePipe – Streamlined Invoice Processing",
    description:
      "AI-powered invoice ingestion and field extraction made simple.",
    images: ["https://invoicepipe.site/ogImage.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground tracking-tight selection:bg-blue-200 dark:selection:bg-blue-700`}
      >
        <ThemeProvider>
          <Navbar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}