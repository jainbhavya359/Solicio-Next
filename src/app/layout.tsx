import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Header from "@/src/components/layout/Header"
import Footer from "@/src/components/layout/Footer"
import { ClerkProvider } from "@clerk/nextjs"
import ThemeProvider from "@/src/components/ThemeProvider";

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
        <body className={`${outfit.variable} font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
