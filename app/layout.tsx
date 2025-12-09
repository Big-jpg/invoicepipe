// app/layout.tsx
import { AuthSession } from "@/components/auth/AuthSession";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
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
  title: "InvoicePipe – AI-Powered Invoice Data Extraction",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://invoicepipe.site'),
  description:
    "Turn invoices into structured data with 98%+ accuracy. Australian-first invoice extraction API with 5-16s processing time. Perfect for accounting automation and ERP integration.",
  keywords: [
    "invoice extraction",
    "invoice OCR",
    "invoice automation",
    "invoice API",
    "Australian invoices",
    "ABN extraction",
    "GST extraction",
    "accounting automation",
    "invoice processing",
    "document AI",
  ],
  authors: [{ name: "InvoicePipe" }],
  openGraph: {
    title: "InvoicePipe – Turn Invoices Into Structured Data",
    description:
      "AI-powered invoice extraction with 98%+ accuracy. Australian-first solution for automated invoice processing and data extraction.",
    url: "https://invoicepipe.site",
    siteName: "InvoicePipe",
    images: [
      {
        url: "/og-hero.png",
        width: 1200,
        height: 630,
        alt: "InvoicePipe – AI-powered invoice extraction with 98%+ accuracy",
      },
      {
        url: "/og-demo.png",
        width: 1200,
        height: 630,
        alt: "InvoicePipe product demo showing invoice extraction results",
      },
      {
        url: "/og-square.png",
        width: 1200,
        height: 1200,
        alt: "InvoicePipe – Australian-first invoice automation",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoicePipe – Automate Invoice Data Extraction",
    description: "Turn invoices into structured data with 98%+ accuracy. 5-16s processing. Australian-first.",
    images: ["/twitter-card.png"],
    creator: "@invoicepipe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <AuthSession>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthSession>
      </body>
    </html>
  );
}