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
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md print:hidden"
            />

            {/* Modal Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/30 overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:rounded-none print:max-h-none print:relative print:scale-100 print:bg-white"
            >
                {/* Header - Hidden on Print */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm print:hidden">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Financial Audit</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                                Strategic Asset & Revenue Analysis
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 h-12 px-6 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                        >
                            <Printer className="w-4 h-4" />
                            Print Statement
                        </button>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center group"
                        >
                            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible bg-white">
                    {loading || !data ? (
                        <div className="py-32 flex flex-col items-center justify-center space-y-4 bg-white">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-emerald-100 rounded-full" />
                                <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Extrapolating Financial Data...</p>
                        </div>
                    ) : (
                        <div className="space-y-12 pb-12 print:pb-0">

                            {/* ON-SCREEN FILTERS - Hidden on Print */}
                            <div className="print:hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <div className="flex items-center gap-6 px-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Start</span>
                                        <input
                                            type="date"
                                            value={from}
                                            onChange={e => setFrom(e.target.value)}
                                            className="text-sm font-bold text-slate-900 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                                        />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-200" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit End</span>
                                        <input
                                            type="date"
                                            value={to}
                                            onChange={e => setTo(e.target.value)}
                                            className="text-sm font-bold text-slate-900 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={loadReport}
                                    className="h-12 px-8 rounded-xl bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95"
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
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4">Statement View</span>
                                    <div className="bg-white rounded-[2rem] border border-slate-100 p-2 shadow-xl shadow-slate-200/40">
                                        <NavBtn active={activeView === "summary"} label="Financial Summary" onClick={() => setActiveView("summary")} icon={Layout} />
                                        <NavBtn active={activeView === "sales"} label="Revenue Streams" onClick={() => setActiveView("sales")} icon={TrendingUp} />
                                        <NavBtn active={activeView === "purchases"} label="Cost Centers" onClick={() => setActiveView("purchases")} icon={TrendingDown} />
                                        <NavBtn active={activeView === "inventory"} label="Asset Allocation" onClick={() => setActiveView("inventory")} icon={Package} />
                                    </div>

                                    <div className="p-6 rounded-[2rem] bg-emerald-50/50 border border-emerald-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Profit Margin</p>
                                            <p className="text-2xl font-black text-slate-900 tracking-tightest">{data.summary.netMargin}%</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Data Tables */}
                                <div className="lg:col-span-3 space-y-24 print:lg:col-span-4">

                                    {/* 1. FINANCIAL SUMMARY SECTION (Trading Account) */}
                                    <section className={(activeView === "summary" ? "block" : "hidden print:block") + " space-y-8"}>
                                        <SectionHeader title="Financial Summary" subtitle="Trading & Profit Loss Distribution" />
                                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
                                            <div className="p-10 grid md:grid-cols-2 gap-16">
                                                <div className="space-y-6">
                                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Operational Revenue</h4>
                                                    <SummaryRow label="Total Sales (Revenue)" value={data.summary.sales} />
                                                    <SummaryRow label="Opening Stock Capital" value={data.summary.openingStock} />
                                                    <SummaryRow label="Closing Stock Capital" value={data.summary.closingStock} />
                                                </div>
                                                <div className="space-y-6">
                                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Cost Distribution</h4>
                                                    <SummaryRow label="Total Purchases" value={data.summary.purchases} />
                                                    <SummaryRow label="Operational Expenses" value={data.summary.expenses} />
                                                    <SummaryRow label="Inventory Write-downs" value={data.summary.inventoryWriteDowns} />
                                                </div>
                                            </div>
                                            <div className="px-10 py-8 bg-slate-900 flex items-center justify-between print:rounded-b-[2.5rem]">
                                                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Audited Net Profit</span>
                                                <span className="text-4xl font-extrabold text-emerald-400 tracking-tightest">₹{data.summary.netProfit.toLocaleString()}</span>
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
                <div className="px-8 py-6 border-t border-slate-100 bg-white flex items-center justify-between print:hidden">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                        Solicio Tactical Audit Hub • Institutional Ledger Verified
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="h-12 px-8 rounded-xl bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
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
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100",
        slate: "bg-slate-50 text-slate-500 border-slate-100",
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 group hover:border-emerald-200 transition-all duration-500 print:shadow-none print:border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                <div className={`p-3 rounded-2xl ${styles[variant]} transition-all group-hover:bg-slate-900 group-hover:text-white print:bg-slate-50 print:text-slate-900`}>
                    <Icon size={20} />
                </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tightest">₹{Number(value).toLocaleString()}</p>
        </div>
    );
}

function NavBtn({ active, label, onClick, icon: Icon }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${active ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 active:scale-95" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}`}
        >
            <Icon size={16} className={active ? "text-emerald-400" : "text-slate-300"} />
            {label}
        </button>
    );
}

function SectionHeader({ title, subtitle, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-6">
            {Icon && (
                <div className="w-14 h-14 rounded-3xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-900/20 print:bg-slate-900 print:text-white">
                    <Icon size={24} />
                </div>
            )}
            <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tightest">{title}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>
            </div>
        </div>
    );
}

function SummaryRow({ label, value }: any) {
    return (
        <div className="flex items-center justify-between group">
            <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px]">{label}</span>
            <span className="text-lg font-extrabold text-slate-900 tracking-tightest">₹{Number(value).toLocaleString()}</span>
        </div>
    );
}

function DetailedTable({ headers, data }: any) {
    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden print:shadow-none print:border-slate-200">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 print:bg-slate-100">
                            {headers.map((h: string) => (
                                <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] print:text-slate-900">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                {row.map((cell: any, j: number) => (
                                    <td key={j} className="px-8 py-6 text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors capitalize print:text-slate-900">
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

