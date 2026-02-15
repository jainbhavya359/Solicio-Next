import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  LayoutGrid,
  Package,
  IndianRupee,
  BookOpen,
  Landmark,
  Bell,
  Settings,
} from "lucide-react";

const items = [
  { icon: LayoutGrid, label: "Overview", active: true },
  { icon: Package, label: "Inventory" },
  { icon: IndianRupee, label: "Finance" },
  { icon: BookOpen, label: "Ledger" },
  { icon: Landmark, label: "Loans" },
  { icon: Bell, label: "Alerts" },
  { icon: Settings, label: "Settings" },
];

export default function DashboardSidebar() {
  const { user } = useUser();

  return (
    <aside className="w-64 bg-[#f7f2ea] border-r border-black/5 px-4 py-6 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
          ↗
        </div>
        <div>
          <p className="font-semibold text-slate-900">Solicio</p>
          <p className="text-xs text-slate-500">Business Dashboard</p>
        </div>
      </div>

      <p className="text-xs font-semibold text-slate-400 mb-3 px-2">
        MENU
      </p>

      <nav className="space-y-1">
        {items.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-sm
              ${
                active
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-black/5"
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {label}
          </div>
        ))}
      </nav>

      {/* User Card */}
      <div className="mt-auto bg-[#efe8dc] p-3 rounded-2xl">
        <p className="font-medium text-sm text-slate-900">
          {user?.fullName}
        </p>
        <p className="text-xs text-slate-500 mb-2">
          {user?.primaryEmailAddress?.emailAddress}
        </p>
        <div className="text-xs text-slate-600 hover:underline" >
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
