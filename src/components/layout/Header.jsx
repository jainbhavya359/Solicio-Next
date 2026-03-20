"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Menu, X, Moon } from "lucide-react";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/dashboard", label: "Dashboard" }
  ];

  return (
    <>
      <div
        className={`fixed z-50 left-0 right-0 flex justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled ? "top-4 px-4" : "top-0 px-0"
        }`}
      >
        <header
          style={{ maxWidth: isScrolled ? "896px" : "100%" }}
          className={`w-full flex items-center justify-between overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isScrolled
              ? "rounded-full border border-white/10 bg-[#111111]/90 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] px-4 py-2.5"
              : "px-6 md:px-12 2xl:px-24 py-5 bg-[#050505]/70 backdrop-blur-2xl border-b border-white/5"
          }`}
        >
          {/* LOGO */}
          <Link href="/" className="flex items-center group shrink-0">
            <div className={`flex items-center justify-center text-emerald-400 font-black rounded-xl bg-white/5 border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/50 transition-all duration-500 ${
              isScrolled ? "w-8 h-8 rounded-lg border-transparent" : "w-10 h-10 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            }`}>
              <TrendingUp strokeWidth={2.5} className={isScrolled ? "w-4 h-4 text-white" : "w-5 h-5"} />
            </div>
            
            <span 
              className={`font-extrabold text-white tracking-tight whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isScrolled ? "w-0 opacity-0 text-[0px] ml-0" : "w-[65px] opacity-100 text-xl ml-3"
              }`}
            >
              Solicio
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav
            className={`hidden md:flex items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] text-sm rounded-full ${
              isScrolled
                ? "gap-6 px-0 py-0 bg-transparent border-transparent"
                : "gap-8 px-6 py-2.5 bg-white/5 border border-white/5"
            }`}
          >
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors whitespace-nowrap ${
                    active ? "text-white" : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* DESKTOP CTA */}
          <div className="hidden md:flex items-center justify-end transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 gap-4">
            <SignedOut>
              <Link
                href="/login"
                className={`font-medium text-[#A1A1AA] hover:text-white transition-all duration-500 ${
                  isScrolled ? "text-xs" : "text-sm"
                }`}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={`flex items-center justify-center rounded-full bg-emerald-500 text-black font-semibold transition-all duration-500 hover:bg-emerald-400 ${
                  isScrolled
                    ? "px-4 py-1.5 text-xs shadow-none border border-emerald-400 whitespace-nowrap"
                    : "px-5 py-2.5 text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] whitespace-nowrap"
                }`}
              >
                Get Started
                
                {/* Expandable Arrow */}
                <span className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center ${
                  isScrolled ? "max-w-[10px] opacity-100 ml-1" : "max-w-0 opacity-0 ml-0"
                }`}>
                  <span className="text-[10px] leading-none mb-[1px]">›</span>
                </span>
              </Link>
            </SignedOut>
            <SignedIn>
              <SignOutButton>
                <button className={`whitespace-nowrap rounded-full border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-all duration-500 flex items-center justify-center ${
                  isScrolled ? "px-3 py-1.5 text-xs" : "px-5 py-2 text-sm"
                }`}>
                  Log Out
                </button>
              </SignOutButton>
            </SignedIn>

            {/* Expandable Moon Icon */}
            <div className={`overflow-hidden flex items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isScrolled ? "w-6 opacity-100 ml-1" : "w-0 opacity-0 ml-0"
            }`}>
              <button className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors">
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
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
              className="fixed top-full left-0 w-full md:hidden overflow-hidden bg-[#0A0A0A] border-b border-white/5 rounded-b-2xl mt-1 z-50"
            >
              <nav className="flex flex-col p-6 gap-4">
                {links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium p-2 rounded-lg transition-colors ${active
                          ? "text-emerald-400 bg-emerald-500/10"
                          : "text-[#A1A1AA] hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <hr className="border-white/5 my-2" />
                <SignedOut>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center p-3 rounded-xl border border-white/10 text-white font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center p-3 rounded-xl bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)] mt-2"
                  >
                    Get Started Free
                  </Link>
                </SignedOut>
                <SignedIn>
                  <SignOutButton>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center p-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium"
                    >
                      Log Out
                    </button>
                  </SignOutButton>
                </SignedIn>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
