"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    Calendar,
    Trash2,
    CreditCard,
    ArrowUpRight,
    Wallet,
    Clock,
    ShieldCheck,
    AlertCircle
} from "lucide-react";

export interface Loan {
    _id: string;
    loanType?: string;
    lender?: string;
    status: "active" | "overdue" | "closed";
    emiAmount?: number;
    principalAmount?: number;
    tenure?: number;
    tenureUnit?: string;
    interestRate?: number;
    nextDueDate?: string;
}

interface ActiveLoansProps {
    data: Loan[];
    loading: boolean;
    setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
}

const formatMoney = (value: number | undefined | null) => {
    if (typeof value !== "number") return "—";
    return `₹${value.toLocaleString()}`;
};

const daysUntil = (date: string | undefined | null) => {
    if (!date) return undefined;
    const now = new Date();
    const target = new Date(date);
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

function LoanStatusBadge({ status }: { status: "active" | "overdue" | "closed" }) {
    const styles = {
        active: "bg-emerald-50 text-emerald-600 border-emerald-100",
        overdue: "bg-rose-50 text-rose-600 border-rose-100",
        closed: "bg-slate-50 text-slate-500 border-slate-100",
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
            {status}
        </span>
    );
}

export default function ActiveLoans({ data, loading, setLoans }: ActiveLoansProps) {
    const handleDeleteLoan = async (loanId: string) => {
        const ok = confirm("Are you sure you want to remove this loan?");
        if (!ok) return;
        try {
            await fetch(`/api/loans?id=${loanId}`, { method: "DELETE" });
            setLoans((prev) => prev.filter((l) => l._id !== loanId));
        } catch (error) {
            console.error("Failed to delete loan", error);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-24 shadow-sm flex flex-col items-center justify-center">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-emerald-50 rounded-full" />
                    <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Loans...</p>
            </div>
        );
    }

    return (
        <section className="space-y-8">
            {/* SECTION HEADER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100/50">
                        <CreditCard className="h-7 w-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
                            Active Loans
                        </h2>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Credit Facility & Monthly EMIs
                        </p>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {data.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2rem] border border-slate-100 p-20 shadow-sm text-center flex flex-col items-center"
                    >
                        <div className="w-20 h-20 rounded-[2.5rem] bg-emerald-50 text-emerald-200 flex items-center justify-center mb-6">
                            <ShieldCheck size={40} />
                        </div>
                        <p className="text-slate-900 font-bold text-xl tracking-tight">No active loans found</p>
                        <p className="text-sm text-slate-400 mt-2 max-w-xs">Your credit profile is clean. Active loans will appear here once registered.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {data.map((loan) => {
                            const daysLeft = daysUntil(loan.nextDueDate);
                            const urgencyColor = daysLeft !== undefined && daysLeft <= 0
                                ? "text-rose-600 bg-rose-50 border-rose-100"
                                : daysLeft !== undefined && daysLeft <= 7
                                    ? "text-amber-600 bg-amber-50 border-amber-100"
                                    : "text-emerald-600 bg-emerald-50 border-emerald-100";

                            return (
                                <motion.div
                                    key={loan._id}
                                    variants={fadeInUp}
                                    whileHover={{ y: -4 }}
                                    className="group bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col relative overflow-hidden"
                                >
                                    {/* Decorative background element */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />

                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                                <Wallet size={18} />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 leading-none tracking-tight">
                                                    {loan.loanType || "Personal Loan"}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                                    <ShieldCheck size={10} className="text-emerald-500" />
                                                    {loan.lender || "Financial Inst."}
                                                </p>
                                            </div>
                                        </div>
                                        <LoanStatusBadge status={loan.status} />
                                    </div>

                                    {/* Principal & Rate Row */}
                                    <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-50">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Principal</p>
                                            <p className="font-bold text-slate-900 tracking-tight">{formatMoney(loan.principalAmount)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Interest</p>
                                            <p className="font-bold text-emerald-600 tracking-tight">{loan.interestRate}% <span className="text-[10px] text-slate-400">P.A.</span></p>
                                        </div>
                                    </div>

                                    {/* Progress Strip - Visual EMI focus */}
                                    <div className="bg-slate-50 rounded-2xl p-4 mb-6 group-hover:bg-emerald-50/30 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly EMI</p>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-100">
                                                <ArrowUpRight size={10} className="text-emerald-500" />
                                                {loan.tenure} {loan.tenureUnit}
                                            </div>
                                        </div>
                                        <p className="text-2xl font-black text-slate-900 tracking-tighter">
                                            {formatMoney(loan.emiAmount)}
                                        </p>
                                    </div>

                                    {/* Due Date Indicator */}
                                    {loan.status === "active" && daysLeft !== undefined && (
                                        <div className={`mt-auto p-3 rounded-xl border flex items-center gap-3 transition-all ${urgencyColor}`}>
                                            <div className="h-8 w-8 rounded-lg bg-white/50 flex items-center justify-center">
                                                <Clock size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Next Payment</p>
                                                <p className="text-xs font-bold mt-1">
                                                    {daysLeft <= 0 ? "Due Today" : `In ${daysLeft} days`}
                                                </p>
                                            </div>
                                            <AlertCircle size={16} className="opacity-50" />
                                        </div>
                                    )}

                                    {/* Delete Option - Subtle until hover */}
                                    {loan.status !== "closed" && (
                                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDeleteLoan(loan._id)}
                                                className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                title="Remove loan record"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
