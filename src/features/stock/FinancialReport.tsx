"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import {
    Printer,
    Download,
    Calendar,
    TrendingUp,
    TrendingDown,
    Package,
    Layout,
    Activity,
    ArrowRight,
    FileText,
    Search,
    ChevronDown,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface FinancialReportProps {
    onClose: () => void;
}

export default function FinancialReport({ onClose }: FinancialReportProps) {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    const [from, setFrom] = useState(() => {
        const d = new Date();
        d.setDate(1); // First of current month
        return d.toISOString().split("T")[0];
    });
    const [to, setTo] = useState(new Date().toISOString().split("T")[0]);

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState<"summary" | "sales" | "purchases" | "inventory">("summary");

    const loadReport = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const res = await axios.get("/api/financial-report", {
                params: { email, from, to }
            });
            setData(res.data);
        } catch (err) {
            console.error("Failed to load financial report", err);
            toast.error("Cloud synchronization failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, [email]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-outfit">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md print:hidden"
            />

            {/* Modal Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-6xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:rounded-none print:max-h-none print:relative print:scale-100 print:bg-white print:border-none"
            >
                {/* Header - Hidden on Print */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 sm:px-8 py-5 sm:py-6 border-b border-white/5 bg-white/5 backdrop-blur-md print:hidden gap-4 sm:gap-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Financial Audit</h3>
                            <p className="text-[10px] font-black text-emerald-500/70 uppercase tracking-[0.2em] mt-0.5">
                                Strategic Asset & Revenue Analysis
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 h-12 px-6 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                        >
                            <Printer className="w-4 h-4" />
                            Statement
                        </button>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10 transition-all flex items-center justify-center group"
                        >
                            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 print:p-0 print:overflow-visible">
                    {loading || !data ? (
                        <div className="py-32 flex flex-col items-center justify-center space-y-4">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                                <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
                            </div>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Extrapolating Financial Data...</p>
                        </div>
                    ) : (
                        <div className="space-y-12 pb-12 print:pb-0">

                            {/* ON-SCREEN FILTERS - Hidden on Print */}
                            <div className="print:hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-6 bg-white/[0.02] border border-white/10 rounded-2xl sm:rounded-[2rem]">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 px-2 sm:px-4 w-full lg:w-auto">
                                    <div className="flex flex-col w-full sm:w-auto">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Audit Start</span>
                                        <input
                                            type="date"
                                            value={from}
                                            onChange={e => setFrom(e.target.value)}
                                            className="text-sm font-bold text-white bg-black/40 border border-white/10 rounded-xl p-3 w-full focus:ring-2 focus:ring-emerald-500/50 outline-none cursor-pointer h-12 [color-scheme:dark]"
                                        />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-emerald-500 hidden sm:block mt-6" />
                                    <div className="flex flex-col w-full sm:w-auto">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Audit End</span>
                                        <input
                                            type="date"
                                            value={to}
                                            onChange={e => setTo(e.target.value)}
                                            className="text-sm font-bold text-white bg-black/40 border border-white/10 rounded-xl p-3 w-full focus:ring-2 focus:ring-emerald-500/50 outline-none cursor-pointer h-12 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={loadReport}
                                    className="h-12 w-full lg:w-auto px-8 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all active:scale-95 whitespace-nowrap mt-auto"
                                >
                                    Sync Audit Data
                                </button>
                            </div>

                            {/* PRINT-ONLY HEADER */}
                            <div className="hidden print:block mb-12 border-b-2 border-slate-900 pb-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-4xl font-black uppercase tracking-tightest text-slate-900">Solicio Financial Audit</h1>
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Inventory Logic & Capital Deployment Report</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Report Period</p>
                                        <p className="text-lg font-bold text-slate-900">{from} — {to}</p>
                                    </div>
                                </div>
                            </div>

                            {/* KPI STRIP */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <KpiItem label="Total Sales Value" value={data.summary.sales} variant="emerald" icon={TrendingUp} />
                                <KpiItem label="Operational Cost" value={data.summary.purchases} variant="amber" icon={TrendingDown} />
                                <KpiItem label="Inventory Capital" value={data.summary.closingStock} variant="slate" icon={Package} />
                                <KpiItem label="Net Operational Profit" value={data.summary.netProfit} variant={data.summary.netProfit >= 0 ? "emerald" : "rose"} icon={Activity} />
                            </div>

                            {/* MAIN CONTENT AREA */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">

                                {/* Navigation Sidebar - Hidden on Print */}
                                <div className="print:hidden lg:sticky lg:top-0 space-y-4">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-4">Statement View</span>
                                    <div className="bg-white/5 rounded-[2rem] border border-white/10 p-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                                        <NavBtn active={activeView === "summary"} label="Financial Summary" onClick={() => setActiveView("summary")} icon={Layout} />
                                        <NavBtn active={activeView === "sales"} label="Revenue Streams" onClick={() => setActiveView("sales")} icon={TrendingUp} />
                                        <NavBtn active={activeView === "purchases"} label="Cost Centers" onClick={() => setActiveView("purchases")} icon={TrendingDown} />
                                        <NavBtn active={activeView === "inventory"} label="Asset Allocation" onClick={() => setActiveView("inventory")} icon={Package} />
                                    </div>

                                    <div className="p-6 rounded-[2rem] bg-black/40 border border-white/10 flex items-center gap-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Profit Margin</p>
                                            <p className="text-2xl font-black tracking-tightest text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">{data.summary.netMargin}%</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Data Tables */}
                                <div className="lg:col-span-3 space-y-24 print:lg:col-span-4">

                                    {/* 1. FINANCIAL SUMMARY SECTION (Trading Account) */}
                                    <section className={(activeView === "summary" ? "block" : "hidden print:block") + " space-y-8"}>
                                        <SectionHeader title="Financial Summary" subtitle="Trading & Profit Loss Distribution" />
                                        <div className="bg-[#111] rounded-2xl sm:rounded-[2.5rem] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden">
                                            <div className="p-5 sm:p-10 grid md:grid-cols-2 gap-8 sm:gap-16">
                                                <div className="space-y-6">
                                                    <h4 className="text-xs font-black text-emerald-500/70 uppercase tracking-widest border-b border-white/10 pb-4">Operational Revenue</h4>
                                                    <SummaryRow label="Total Sales (Revenue)" value={data.summary.sales} />
                                                    <SummaryRow label="Opening Stock Capital" value={data.summary.openingStock} />
                                                    <SummaryRow label="Closing Stock Capital" value={data.summary.closingStock} />
                                                </div>
                                                <div className="space-y-6">
                                                    <h4 className="text-xs font-black text-rose-500/70 uppercase tracking-widest border-b border-white/10 pb-4">Cost Distribution</h4>
                                                    <SummaryRow label="Total Purchases" value={data.summary.purchases} />
                                                    <SummaryRow label="Operational Expenses" value={data.summary.expenses} />
                                                    <SummaryRow label="Inventory Write-downs" value={data.summary.inventoryWriteDowns} />
                                                </div>
                                            </div>
                                            <div className="px-5 py-6 sm:px-10 sm:py-8 bg-[#0a0a0a] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 print:rounded-b-[2.5rem] print:bg-slate-50 print:border-slate-200">
                                                <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] print:text-slate-500">Audited Net Profit</span>
                                                <span className="text-3xl sm:text-4xl font-extrabold tracking-tightest text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] print:text-emerald-600 print:drop-shadow-none print:bg-none">
                                                    ₹{data.summary.netProfit.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </section>

                                    {/* 2. SALES DATA */}
                                    <section className={(activeView === "sales" ? "block" : "hidden print:block") + " space-y-8"}>
                                        <SectionHeader title="Revenue Streams" subtitle="Detailed sales transaction history" icon={TrendingUp} />
                                        <DetailedTable
                                            headers={["Voucher No", "Product/Asset", "Party", "Quantity", "Valuation"]}
                                            data={data.details.sales.map((s: any) => [
                                                s.voucherNo,
                                                s.itemName,
                                                s.partyName,
                                                `${s.creditQty} ${s.unit}`,
                                                `₹${s.amount.toLocaleString()}`
                                            ])}
                                        />
                                    </section>

                                    {/* 3. PURCHASES DATA */}
                                    <section className={(activeView === "purchases" ? "block" : "hidden print:block") + " space-y-8"}>
                                        <SectionHeader title="Cost Centers" subtitle="Detailed procurement history" icon={TrendingDown} />
                                        <DetailedTable
                                            headers={["Voucher No", "Strategic Asset", "Vendor", "Quantity", "Deployment Cost"]}
                                            data={data.details.purchases.map((p: any) => [
                                                p.voucherNo,
                                                p.itemName,
                                                p.partyName,
                                                `${p.debitQty} ${p.unit}`,
                                                `₹${p.amount.toLocaleString()}`
                                            ])}
                                        />
                                    </section>

                                    {/* 4. INVENTORY DATA */}
                                    <section className={(activeView === "inventory" ? "block" : "hidden print:block") + " space-y-8"}>
                                        <SectionHeader title="Asset Allocation" subtitle="Current inventory snapshot as of audit end" icon={Package} />
                                        <DetailedTable
                                            headers={["Asset Name", "Unit", "On Hand", "Selling Rate", "Current Value (Cost)"]}
                                            data={data.details.inventory.map((i: any) => [
                                                i.name,
                                                i.unit,
                                                i.quantity,
                                                `₹${i.rate.toLocaleString()}`,
                                                `₹${i.value.toLocaleString()}`
                                            ])}
                                        />
                                    </section>

                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions - Hidden on Print */}
                <div className="px-5 sm:px-8 py-5 sm:py-6 border-t border-white/5 bg-white/5 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center sm:text-left leading-tight">
                        Solicio Tactical Audit Hub • Institutional Ledger Verified
                    </p>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            className="h-12 w-full sm:w-auto px-8 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-95"
                        >
                            Dismiss Statement
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

/* ---------- UI HELPERS ---------- */

function KpiItem({ label, value, icon: Icon, variant }: any) {
    const styles: any = {
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]",
        amber: "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]",
        rose: "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
        slate: "text-slate-400 bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]",
    };

    return (
        <div className="bg-[#111111] rounded-[2.5rem] border border-white/10 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group hover:border-emerald-500/30 transition-all duration-500 print:shadow-none print:border-slate-200 print:bg-white">
            <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
                <div className={`p-3 rounded-2xl ${styles[variant]} transition-all group-hover:scale-110 print:bg-slate-50 print:border-slate-200 print:text-slate-900 print:shadow-none`}>
                    <Icon size={20} />
                </div>
            </div>
            <p className="text-3xl font-extrabold tracking-tightest text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 print:text-slate-900 print:bg-none">
                ₹{Number(value).toLocaleString()}
            </p>
        </div>
    );
}

function NavBtn({ active, label, onClick, icon: Icon }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${active ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)] active:scale-95" : "text-slate-500 hover:text-white hover:bg-white/5 border border-transparent"}`}
        >
            <Icon size={16} className={active ? "text-emerald-400" : "text-slate-500"} />
            {label}
        </button>
    );
}

function SectionHeader({ title, subtitle, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-6">
            {Icon && (
                <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 text-emerald-400 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] print:bg-slate-900 print:text-white print:border-none print:shadow-none">
                    <Icon size={24} />
                </div>
            )}
            <div>
                <h3 className="text-3xl font-black text-white tracking-tightest print:text-slate-900">{title}</h3>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1 print:text-slate-500">{subtitle}</p>
            </div>
        </div>
    );
}

function SummaryRow({ label, value }: any) {
    return (
        <div className="flex items-center justify-between group">
            <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest text-[10px]">{label}</span>
            <span className="text-lg font-extrabold text-white tracking-tightest">₹{Number(value).toLocaleString()}</span>
        </div>
    );
}

function DetailedTable({ headers, data }: any) {
    return (
        <div className="bg-[#111111] rounded-[2.5rem] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden print:shadow-none print:border-slate-200 print:bg-white">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-black/60 border-b border-white/10 print:bg-slate-100 print:border-slate-200">
                            {headers.map((h: string) => (
                                <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] print:text-slate-900">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-slate-50">
                        {data.map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group print:hover:bg-transparent">
                                {row.map((cell: any, j: number) => (
                                    <td key={j} className="px-8 py-6 text-sm font-bold text-slate-300 group-hover:text-white transition-colors capitalize print:text-slate-900 flex-shrink-0">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
