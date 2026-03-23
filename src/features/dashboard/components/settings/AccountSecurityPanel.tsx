"use client";

import { UserProfile } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";

export default function AccountSecurityPanel() {
  return (
    <div className="space-y-6">
        
        {/* Sub-Header Context Block */}
        <div className="bg-[#050505] rounded-3xl border border-white/5 p-6 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
            <div>
                <h2 className="text-xl font-black text-white tracking-tight mb-1">Identity & Authentication</h2>
                <p className="text-sm text-slate-500 font-medium">Powered by Clerk. Secure your sessions, manage multiple OAuth connections, and enforce strict Multi-Factor Authentication (MFA).</p>
            </div>
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shrink-0">
                <ShieldCheck className="w-4 h-4" /> Endpoint Secured
            </div>
        </div>

        {/* Embedded Clerk Component styled into Dark Mode via Clerk Appearance Prop overrides or native CSS encapsulation */}
        <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm">
           {/* Forcing standard styling inside this wrapper so Clerk's default UI matches light-mode/glass seamlessly or preserves its intrinsic high-contrast container */}
           <UserProfile routing="hash" />
        </div>

    </div>
  );
}
