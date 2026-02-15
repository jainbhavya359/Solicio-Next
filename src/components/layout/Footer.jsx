"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-slate-400">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        {/* TOP GRID */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          {/* BRAND */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-xl font-bold text-white">
                Solicio
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-sm mb-6">
              Helping small businesses manage stock, sales,
              money & decisions — all in one powerful, easy-to-use platform.
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                hello@solicio.com
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                Mumbai, India
              </li>
            </ul>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/integrations" className="hover:text-white transition">Integrations</Link></li>
              <li><Link href="/api" className="hover:text-white transition">API</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/press" className="hover:text-white transition">Press</Link></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/docs" className="hover:text-white transition">Documentation</Link></li>
              <li><Link href="/tutorials" className="hover:text-white transition">Tutorials</Link></li>
              <li><Link href="/community" className="hover:text-white transition">Community</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
              <li><Link href="/gdpr" className="hover:text-white transition">GDPR</Link></li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm">
            © {year} Solicio. All rights reserved.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-4">
            {["X", "in", "ig", "yt"].map((icon) => (
              <div
                key={icon}
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-sm hover:bg-white/10 transition cursor-pointer"
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
