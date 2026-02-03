import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/src/components/Header"
import Footer from "@/src/components/Footer"
import { ClerkProvider } from "@clerk/nextjs"

import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solicio - Enterprise Business Management",
  description: "Premium accounting and business management platform for modern enterprises. Track finances, manage inventory, and gain insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider >
      <html lang="en">
       <body className={`${geistSans.variable} ${geistMono.variable} bg-zinc-50 text-slate-900 antialiased font-sans`}>
        <Toaster position="top-right" />
        {children}
      </body>
     </html>
    </ClerkProvider>
  );
}
