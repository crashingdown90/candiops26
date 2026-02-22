import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthContext";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CANDI OPS 26 — Briefing Rahasia",
  description: "Paparan Strategi Operasi Intelijen — SANGAT RAHASIA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${jetbrains.variable} ${inter.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
