import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Header from "@/src/components/layout/Header"
import Footer from "@/src/components/layout/Footer"
import { ClerkProvider } from "@clerk/nextjs"
import AnalyticsTracker from "@/src/components/telemetry/AnalyticsTracker"

import "./globals.css";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solicio | Premium MSME Dashboard",
  description: "Advanced analytics and insights for modern businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider >
      <html lang="en">
        <body className={`${outfit.variable} font-sans bg-white text-slate-900 antialiased`}>
          <AnalyticsTracker />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
