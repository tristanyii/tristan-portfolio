import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tristan Yi | CS & Stats @ Duke",
  description: "Personal website of Tristan Yi - Computer Science and Statistics student at Duke University",
  icons: {
    icon: "/snorlax-pixel.gif",
  },
  openGraph: {
    title: "Tristan Yi Portfolio",
    description: "Personal portfolio of Tristan Yi - Computer Science and Statistics student at Duke University",
    url: "https://tristanyi.vercel.app",
    siteName: "Tristan Yi Portfolio",
    images: [
      {
        url: "/og-image.jpg", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "Tristan Yi Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tristan Yi Portfolio",
    description: "Personal portfolio of Tristan Yi - Computer Science and Statistics student at Duke University",
    images: ["/og-image.jpg"], // Same image as OpenGraph
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
