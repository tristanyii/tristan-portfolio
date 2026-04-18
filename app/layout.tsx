import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { AnalyticsUnlock } from "@/components/analytics-unlock";
import { AdminProvider } from "@/components/admin-provider";
import { IntroAnimation } from "@/components/intro-animation";

// Modern, friendly sans for body text
const geistSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Clean mono for code snippets
const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Distinct display font for headings
const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

// Next puts /favicon.ico?... first in <head>; `app/favicon.ico` is that file (copy of public/icon.png when you change the art).
/** Resolves OG URLs on the active host (Vercel preview, production, or custom domain). */
function getMetadataBase(): URL {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    (process.env.NODE_ENV === "production" ? "https://tristanyi.vercel.app" : "http://localhost:3000");
  return new URL(raw.endsWith("/") ? raw.slice(0, -1) : raw);
}

export const metadata: Metadata = {
  title: "Tristan Yi's Portfolio",
  description: "Personal website of Tristan Yi - Computer Science and Statistics student at Duke University",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/icon.png",
    apple: [{ url: "/apple-icon.png", sizes: "512x512", type: "image/png" }],
  },
  openGraph: {
    title: "Tristan Yi's Portfolio",
    description: "Personal portfolio of Tristan Yi - Computer Science and Statistics student at Duke University",
    url: "/",
    siteName: "Tristan Yi's Portfolio",
    images: [
      {
        url: "/og-thumbnail.png",
        width: 1024,
        height: 571,
        alt: "Tristan Yi's Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tristan Yi's Portfolio",
    description: "Personal portfolio of Tristan Yi - Computer Science and Statistics student at Duke University",
    images: ["/og-thumbnail.png"],
  },
  metadataBase: getMetadataBase(),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} antialiased`}
      >
        <div className="mesh-gradient-bg hidden md:block" />
        <Providers>
          <AnalyticsTracker />
          <AnalyticsUnlock />
          <IntroAnimation />
          <AdminProvider>
            {children}
          </AdminProvider>
        </Providers>
      </body>
    </html>
  );
}
