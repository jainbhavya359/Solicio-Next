"use client";
import { motion } from "framer-motion";
import { Sparkles, Zap, Layout, FileText } from "lucide-react";

export default function InventoryActionBar({ 
  activeTab, 
  setActiveTab, 
  setShowFinancialModal 
}: { 
  activeTab: "report" | "purchase" | "sale";
  setActiveTab: (val: "report" | "purchase" | "sale") => void;
  setShowFinancialModal: (val: boolean) => void;
}) {
  return (
    // Fixed to viewport bottom so it never floats mid-page
    <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="bg-[#111111]/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.02)] flex items-center gap-1 p-1.5 pointer-events-auto"
      >
        <ActionButton
          active={activeTab === "purchase"}
          icon={<Sparkles className="w-3.5 h-3.5 flex-shrink-0" />}
          onClick={() => setActiveTab("purchase")}
          color="emerald"
          label="Dispatch Purchase"
          shortLabel="Purchase"
        />

        <ActionButton
          active={activeTab === "sale"}
          icon={<Zap className="w-3.5 h-3.5 flex-shrink-0" />}
          onClick={() => setActiveTab("sale")}
          color="cyan"
          label="Execute Sale"
          shortLabel="Sale"
        />

        <div className="w-px h-5 bg-white/10 mx-0.5 flex-shrink-0" />

        <ActionButton
          active={activeTab === "report"}
          icon={<Layout className="w-3.5 h-3.5 flex-shrink-0" />}
          onClick={() => setActiveTab("report")}
          color="indigo"
          label="Stock Matrix"
          shortLabel="Stock"
        />

        <ActionButton
          active={false}
          icon={<FileText className="w-3.5 h-3.5 flex-shrink-0" />}
          onClick={() => setShowFinancialModal(true)}
          color="amber"
          label="Fiscal Audit"
          shortLabel="Audit"
        />
      </motion.div>
    </div>
  );
}

function ActionButton({
  label,
  shortLabel,
  onClick,
  icon,
  active,
  color,
}: {
  label: string;
  shortLabel: string;
  onClick: () => void;
  icon: React.ReactNode;
  active: boolean;
  color: "emerald" | "cyan" | "indigo" | "amber";
}) {
  const activeStyles = {
    emerald: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
    cyan:    "bg-cyan-500/20    border-cyan-500/40    text-cyan-400",
    indigo:  "bg-indigo-500/20  border-indigo-500/40  text-indigo-400",
    amber:   "bg-amber-500/20   border-amber-500/40   text-amber-400",
  };

  const hoverStyles = {
    emerald: "hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/20",
    cyan:    "hover:bg-cyan-500/10    hover:text-cyan-300    hover:border-cyan-500/20",
    indigo:  "hover:bg-indigo-500/10  hover:text-indigo-300  hover:border-indigo-500/20",
    amber:   "hover:bg-amber-500/10   hover:text-amber-300   hover:border-amber-500/20",
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 rounded-full text-[11px] font-bold uppercase tracking-wider
        border transition-all duration-200 whitespace-nowrap select-none
        px-3.5 py-2.5 sm:px-4 sm:py-2.5
        ${active
          ? activeStyles[color]
          : `text-[#888] border-transparent ${hoverStyles[color]}`
        }
      `}
    >
      <span className={active ? "opacity-100" : "opacity-60"}>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{shortLabel}</span>
    </button>
  );
}
