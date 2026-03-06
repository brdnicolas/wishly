import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://envly.app"),
  title: "Envly — Vos wishlists, magnifiquement partagées",
  description: "Créez de superbes wishlists, partagez-les avec vos proches et laissez-les réserver des cadeaux anonymement. Fini les doublons, fini les surprises gâchées.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "Envly — Vos wishlists, magnifiquement partagées",
    description: "Créez de superbes wishlists, partagez-les avec vos proches et laissez-les réserver des cadeaux anonymement. Fini les doublons, fini les surprises gâchées.",
    type: "website",
    siteName: "Envly",
  },
  twitter: {
    card: "summary_large_image",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
