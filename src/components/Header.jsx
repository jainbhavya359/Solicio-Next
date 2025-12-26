"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 80) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: show ? 0 : -120, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="
        fixed top-0 w-full z-50
        backdrop-blur-xl bg-black/50
        border-b border-white/10
        shadow-[0_8px_30px_rgba(0,0,0,0.4)]
      "
    >
      <header className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4 text-white">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 via-pink-500 to-amber-400 shadow-lg group-hover:scale-105 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6 text-black"
              fill="currentColor"
            >
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
            </svg>
          </div>

          <span className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            Solicio
          </span>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative text-sm font-semibold tracking-wide
                  transition-all duration-300
                  ${isActive ? "text-white" : "text-slate-300 hover:text-white"}
                  after:absolute after:left-0 after:-bottom-2
                  after:h-[2px] after:w-full after:origin-left
                  after:scale-x-0 after:bg-gradient-to-r
                  after:from-indigo-400 after:via-pink-400 after:to-amber-400
                  after:transition-transform after:duration-300
                  hover:after:scale-x-100
                  ${isActive ? "after:scale-x-100" : ""}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/services"
            className="
              px-5 py-2 rounded-full font-bold text-sm
              bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400
              text-black
              hover:opacity-90 transition
              shadow-lg
            "
          >
            Get Started
          </Link>
        </div>

      </header>
    </motion.div>
  );
}
