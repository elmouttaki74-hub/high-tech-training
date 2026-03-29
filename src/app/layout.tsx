import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "High Tech Training Center El Jadida - Gestion",
  description: "Système de gestion complet pour High Tech Training Center El Jadida. Gérez les apprenants, formateurs, cours, paiements et certificats.",
  keywords: ["centre de formation", "El Jadida", "High Tech", "formation", "langues", "apprentissage", "informatique"],
  authors: [{ name: "High Tech Training Center El Jadida" }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "High Tech Training Center El Jadida",
    description: "Système de gestion complet pour centre de formation",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "High Tech Training Center El Jadida",
    description: "Système de gestion complet pour centre de formation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
