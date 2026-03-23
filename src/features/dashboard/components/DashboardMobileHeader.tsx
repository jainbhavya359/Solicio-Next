"use client";

import { AnimatePresence, motion } from "framer-motion";
import Icons from "../constants/icons";

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

export default function DashboardMobileHeader({ sidebarOpen, setSidebarOpen }: Props) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl rounded-b-2xl shadow-md border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-[#050505] shadow-[0_0_15px_rgba(52,211,153,0.3)]">
            {Icons.logo}
          </div>
          <span className="font-bold text-white tracking-tight">Solicio</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
        >
          {sidebarOpen ? Icons.close : Icons.menu}
        </button>
      </div>
    </header>
  );
}

/** Semi-transparent overlay that closes the sidebar on mobile */
export function SidebarOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}
    </AnimatePresence>
  );
}
