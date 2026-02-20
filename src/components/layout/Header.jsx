"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setShow(current < lastScroll || current < 80);
      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/dashboard", label: "Dashboard" }
  ];

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: show ? 0 : -120, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200"
    >
      <header className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black">
            <TrendingUp />
          </div>
          <span className="text-xl font-extrabold text-slate-900">
            Solicio
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-8">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold transition
                  ${active
                    ? "text-emerald-600"
                    : "text-slate-600 hover:text-slate-900"
                  }
                `}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-emerald-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP CTA */}
        <SignedOut>
          <Link
            href="/signup"
            className="hidden md:inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold
            hover:bg-emerald-700 transition shadow"
          >
            Get Started Free
          </Link>
        </SignedOut>
        <SignedIn>
          <SignOutButton>
            <button className="hidden md:inline-block px-5 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-300 transition shadow">
              Log Out
            </button>
          </SignOutButton>
        </SignedIn>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
          )}
        </button>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-b border-slate-200"
          >
            <nav className="flex flex-col p-6 gap-4">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-semibold ${active ? "text-emerald-600" : "text-slate-600"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <hr className="border-slate-100 my-2" />
              <SignedOut>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow"
                >
                  Get Started Free
                </Link>
              </SignedOut>
              <SignedIn>
                <SignOutButton>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-5 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold shadow"
                  >
                    Log Out
                  </button>
                </SignOutButton>
              </SignedIn>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

