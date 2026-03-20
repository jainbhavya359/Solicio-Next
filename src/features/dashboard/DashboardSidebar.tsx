"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { navItems, SectionId } from "./constants/navItems";
import Icons from "./constants/icons";

interface Props {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

export default function DashboardSidebar({
  activeSection,
  onNavigate,
  sidebarOpen,
  setSidebarOpen,
}: Props) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <aside
      className={`peer fixed top-0 left-0 z-50 h-full w-[260px] lg:w-20 hover:lg:w-[280px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-x-hidden group
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:z-30 shadow-2xl lg:shadow-none`}
    >
      {/* Logo / Brand */}
      <div className="p-6 lg:pl-[18px] lg:pr-4 lg:py-6 shrink-0">
        <div className="flex items-center gap-3 shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 lg:w-11 lg:h-11 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200"
          >
            {Icons.logo}
          </motion.div>
          <div className="transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 whitespace-nowrap overflow-hidden">
            <h1 className="font-extrabold text-slate-900 text-lg lg:text-xl tracking-tight">Solicio</h1>
            <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Command Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2 overflow-y-auto overflow-x-hidden">
        <p className="px-4 lg:px-6 mb-2 lg:mb-3 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 whitespace-nowrap">
          Menu Navigation
        </p>
        <div className="space-y-1 lg:space-y-1.5 shrink-0">
          {/* External links */}
          <motion.a
            href="/"
            className="w-full flex items-center gap-3 px-4 lg:px-3 py-2.5 lg:py-3 rounded-2xl text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 hover:text-emerald-600 overflow-hidden transition-all duration-200"
            whileHover={{ x: 2 }}
          >
            <div className="w-8 flex items-center justify-center shrink-0 text-lg">🏚️</div>
            <span className="font-bold text-sm transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 whitespace-nowrap">Main Landing</span>
          </motion.a>
          <motion.a
            href="/features"
            className="w-full flex items-center gap-3 px-4 lg:px-3 py-2.5 lg:py-3 rounded-2xl text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 overflow-hidden transition-all duration-200"
            whileHover={{ x: 2 }}
          >
            <div className="w-8 flex items-center justify-center shrink-0 text-slate-500">{Icons.features}</div>
            <span className="font-bold text-sm transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 whitespace-nowrap">Product Features</span>
          </motion.a>

          <div className="h-3 lg:h-4" />
          <p className="px-4 lg:px-6 mb-2 lg:mb-3 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 whitespace-nowrap">
            Insights & Control
          </p>

          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
              whileHover={{ x: activeSection === item.id ? 0 : 2 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-between px-4 lg:px-3 py-2.5 lg:py-3 rounded-2xl text-left transition-all duration-200 shrink-0 overflow-hidden
                ${activeSection === item.id
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                  : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                }`}
            >
              <div className="flex items-center gap-3 shrink-0">
                <div className={`w-8 flex items-center justify-center shrink-0 ${activeSection === item.id ? "text-emerald-400" : "text-slate-400"}`}>
                  {item.icon}
                </div>
                <span className="font-bold text-sm transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 whitespace-nowrap">
                  {item.label}
                </span>
              </div>
              {activeSection === item.id && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-white/40 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 shrink-0"
                >
                  {Icons.chevronRight}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* User / Sign Out */}
      <div className="py-3 px-3 lg:py-4 shrink-0">
        <div className="bg-slate-50 rounded-[28px] lg:rounded-[24px] p-2 lg:p-1 border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-3 p-2 lg:p-1 rounded-2xl bg-white border border-slate-100 shadow-sm shrink-0 overflow-hidden w-full">
            <div className="w-9 h-9 lg:w-10 lg:h-10 shrink-0 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              {user?.firstName?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 whitespace-nowrap overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.fullName || "User"}</p>
              <p className="text-[10px] font-medium text-slate-400 truncate tracking-tight">{email}</p>
            </div>
          </div>
          <SignOutButton>
            <button className="w-full mt-2 lg:mt-1 flex items-center gap-3 px-4 lg:px-1 py-2.5 lg:py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all shrink-0 border border-transparent">
              <div className="w-10 shrink-0 flex items-center justify-center">{Icons.signOut}</div>
              <span className="text-xs font-bold uppercase tracking-widest transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 whitespace-nowrap overflow-hidden">Sign out</span>
            </button>
          </SignOutButton>
        </div>
      </div>
    </aside>
  );
}
