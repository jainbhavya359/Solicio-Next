"use client";

import { AnimatePresence, motion } from "framer-motion";
import Icons from "../constants/icons";

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

export default function DashboardMobileHeader({ sidebarOpen, setSidebarOpen }: Props) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white rounded-b-2xl shadow-sm border-b border-slate-100">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            {Icons.logo}
          </div>
          <span className="font-semibold text-stone-900">Solicio</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
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
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
        />
      )}
    </AnimatePresence>
  );
}
