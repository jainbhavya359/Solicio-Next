"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-white overflow-hidden">

      {/* Ambient Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-24 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">

        {/* TOP GRID */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-pink-500 to-amber-400 flex items-center justify-center font-black text-black">
                S
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                Solicio
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Empowering small businesses — <br />
              <span className="text-slate-300">छोटे व्यवसायों को सशक्त बनाना</span>
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/services" className="hover:text-white transition">
                  Services
                </Link>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition">
                  How it works
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Email: hello@solicio.in</li>
              <li>Support: +91-00000 00000</li>
              <li>
                <Link
                  href="/profile"
                  className="inline-block mt-2 px-5 py-2 rounded-full text-sm font-semibold
                  bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400
                  text-black hover:opacity-90 transition shadow-lg"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-12 h-px bg-white/10" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <p>© {year} Solicio. All rights reserved.</p>
          <p className="text-slate-500">
            Built with ❤️ for small businesses
          </p>
        </div>

      </div>
    </footer>
  );
}

