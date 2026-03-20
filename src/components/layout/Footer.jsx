"use client";

import Link from "next/link";
import { TrendingUp, ShieldCheck, Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] text-[#A1A1AA] overflow-hidden border-t border-white/5 font-sans">
      
      {/* MASSIVE WATERMARK TEXT */}
      <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 text-[26vw] font-serif tracking-tighter text-white/[0.03] select-none pointer-events-none whitespace-nowrap z-0">
        solicio
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative z-10">
        
        {/* OPTIONAL TOP ROW (Disclaimer & Powered By) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-xs text-[#71717A] mb-12 pb-6 border-b border-white/5 gap-4">
          <p className="max-w-3xl leading-relaxed">
            Solicio Technologies Inc is not yet a replacement for manual accounting.
            Prior to fully relying on AI-generated insights for your inventory and business decisions,
            ensure manual verification. Our tool is intended to augment your workflow, not constitute certified financial advice.
          </p>
          <div className="flex items-center gap-2 whitespace-nowrap">
            Powered by <span className="text-white font-medium flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-emerald-500" /> Solicio AI</span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-4">
          
          {/* LEFT SECTION (Logo, Info, Badges, Copyright) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white bg-white/5 group-hover:bg-white/10 transition-colors">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xl font-medium text-white tracking-tight">
                solicio
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-8 max-w-[300px] text-[#A1A1AA]">
              Solicio Technologies Limited is a company registered in the cloud.<br />
              Registration number 9827341. Our headquarters is located globally to serve small businesses everywhere.
            </p>

            {/* TRUST BADGES */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-[#0A0A0A] text-[9px] font-bold text-white shadow-sm hover:border-emerald-500/30 transition-colors cursor-pointer group">
                 <ShieldCheck className="w-4 h-4 text-[#A1A1AA] group-hover:text-emerald-500 transition-colors mb-0.5" />
                 GDPR
              </div>
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-[#0A0A0A] text-[9px] font-bold text-white shadow-sm hover:border-amber-500/30 transition-colors cursor-pointer group">
                 <Zap className="w-4 h-4 text-[#A1A1AA] group-hover:text-amber-500 transition-colors mb-0.5" />
                 SECURE
              </div>
            </div>

            <p className="text-xs text-[#71717A] max-w-sm leading-relaxed">
              © {year} Solicio Technologies Limited. Solicio is the registered trademark of Solicio Technologies Limited.
            </p>
          </div>

          {/* RIGHT SECTIONS (Links) */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 text-sm pt-2">
            
            {/* PRODUCT */}
            <div>
              <h4 className="text-white font-medium mb-6">Product</h4>
              <ul className="space-y-4">
                <li><Link href="/features" className="hover:text-white transition-colors duration-200 block w-fit">AI Business Management</Link></li>
                <li><Link href="/insights" className="hover:text-white transition-colors duration-200 block w-fit">Automated Stock & P&L</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors duration-200 block w-fit">Pricing Plans</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors duration-200 block w-fit">Integrations</Link></li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="text-white font-medium mb-6">Solicio</h4>
              <ul className="space-y-4">
                <li><Link href="/resources" className="hover:text-white transition-colors duration-200 block w-fit">Resources</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors duration-200 block w-fit">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors duration-200 block w-fit">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors duration-200 block w-fit">Contact Us</Link></li>
                <li><Link href="https://linkedin.com" className="hover:text-white transition-colors duration-200 block w-fit">LinkedIn</Link></li>
                <li><Link href="https://twitter.com" className="hover:text-white transition-colors duration-200 block w-fit">Twitter / X</Link></li>
              </ul>
            </div>

            {/* OTHERS */}
            <div className="col-span-2 md:col-span-1 mt-4 md:mt-0">
              <h4 className="text-white font-medium mb-6">Others</h4>
              <ul className="space-y-4">
                <li><Link href="/privacy" className="hover:text-white transition-colors duration-200 block w-fit">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors duration-200 block w-fit">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors duration-200 block w-fit">Cookie Policy</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors duration-200 block w-fit">Security</Link></li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
