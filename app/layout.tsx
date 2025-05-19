import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  title: "MercyCare Automated Invoice Processing Demonstration",
  description: "Sign in, input Invoice Document (.pdf), Content is then extracted and parsed into appropriate output data format",
  openGraph: {
    title: "MercyCare Automated Invoice Processing Demonstration",
    description: "Sign in, input Invoice Document (.pdf), Content is then extracted and parsed into appropriate output data format",
    url: "https://MercyCareAutomatedInvoices.site",
    siteName: "MercyCareDemo",
    images: [
      {
        url: "/ogImage.png",
        width: 1200,
        height: 630,
        alt: "MercyCare Automated Invoices",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MercyCare Automated Invoice Processing Demonstration",
    description: "Demonstrate Automated Invoice Processing for MercyCare",
    images: ["https://MercyCareAutomatedInvoices.site.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
