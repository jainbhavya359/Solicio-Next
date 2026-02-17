"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Icons as inline SVGs (Copied from DashBoard.tsx or imported if available, but for now copying to keep it self-contained or I can pass icons/use a library. DashBoard used inline. I will use lucide-react if available or copy the svg paths.)
// DashBoard used inline SVGs defined in a constant `Icons`. I'll implement them here or use lucide-react if the project has it (it does, I saw imports in other files).
// Let's check packages... I saw `import { ArrowUpRight, ArrowDownRight } from "lucide-react";` in TopProductCard.
// I will use lucide-react for standard icons to be cleaner, or copy the specific SVGs if they are custom.
// The `loans` icon in Dashboard was complex? No: <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /> -> CreditCard from lucide?
// Let's stick to copy-pasting the SVG paths used in Dashboard to ensure visual consistency 1:1, or wrap them in a helper.
// Actually, `Icons` object in Dashboard had `calendar`, `trash`, `loans`.

import { Calendar, Trash2, CreditCard } from "lucide-react";

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function LoanStatusBadge({ status }: { status: "active" | "overdue" | "closed" }) {
    const styles = {
        active: "bg-emerald-50 text-emerald-700 border-emerald-200",
        overdue: "bg-red-50 text-red-700 border-red-200",
        closed: "bg-stone-100 text-stone-600 border-stone-200",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
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
            alert("Failed to delete loan");
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 shadow-sm flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full"
                />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-12 shadow-sm text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
                    <CreditCard size={32} />
                </div>
                <p className="text-stone-500">No active loans found</p>
            </motion.div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {data.map((loan) => {
                const daysLeft = daysUntil(loan.nextDueDate);

                return (
                    <motion.div
                        key={loan._id}
                        variants={fadeInUp}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="font-semibold text-stone-900">
                                    {loan.loanType || "Loan"}
                                </p>
                                <p className="text-sm text-stone-500">
                                    {loan.lender || "—"}
                                </p>
                            </div>
                            <LoanStatusBadge status={loan.status} />
                        </div>

                        {/* EMI */}
                        <div className="mb-4">
                            <p className="text-emerald-700 font-bold text-2xl">
                                {formatMoney(loan.emiAmount)}
                            </p>
                            <p className="text-xs text-stone-500 mt-1">Monthly EMI</p>
                        </div>

                        {/* Meta */}
                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                                <span className="text-stone-500">Principal</span>
                                <span className="text-stone-900 font-medium">
                                    {formatMoney(loan.principalAmount)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-stone-500">Tenure</span>
                                <span className="text-stone-900 font-medium">
                                    {loan.tenure} {loan.tenureUnit} @ {loan.interestRate}%
                                </span>
                            </div>
                        </div>

                        {/* Due Date Badge */}
                        {loan.status === "active" && daysLeft !== undefined && (
                            <div
                                className={`text-xs px-3 py-2 rounded-lg inline-flex items-center gap-2 font-medium
                ${daysLeft <= 0
                                        ? "bg-red-50 text-red-700 border border-red-200"
                                        : daysLeft <= 7
                                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    }`}
                            >
                                <Calendar size={14} />
                                {daysLeft <= 0
                                    ? "EMI due today"
                                    : `Next EMI in ${daysLeft} days`}
                            </div>
                        )}

                        {/* Actions */}
                        {loan.status !== "closed" && (
                            <div className="mt-4 pt-4 border-t border-stone-100 flex justify-end">
                                <button
                                    onClick={() => handleDeleteLoan(loan._id)}
                                    className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                >
                                    <Trash2 size={14} />
                                    Remove loan
                                </button>
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
