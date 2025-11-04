import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { AnalyticsUnlock } from "@/components/analytics-unlock";

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

export const metadata: Metadata = {
  title: "Tristan Yi's Portfolio",
  description: "Personal website of Tristan Yi - Computer Science and Statistics student at Duke University",
  icons: {
    icon: "/snorlax-pixel.gif",
  },
  openGraph: {
    title: "Tristan Yi's Portfolio",
    description: "Personal portfolio of Tristan Yi - Computer Science and Statistics student at Duke University",
    url: "https://tristanyi.vercel.app",
    siteName: "Tristan Yi's Portfolio",
    images: [
      {
        url: "/backgorund.jpg",
        width: 1200,
        height: 630,
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
    images: ["/backgorund.jpg"],
  },
  metadataBase: new URL("https://tristanyi.vercel.app"),
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
