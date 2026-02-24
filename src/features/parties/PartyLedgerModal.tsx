"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, History, TrendingUp, TrendingDown, ArrowRightLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface PartyLedgerModalProps {
    open: boolean;
    onClose: () => void;
    party: any;
    email: string;
}

export default function PartyLedgerModal({ open, onClose, party, email }: PartyLedgerModalProps) {
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState<any[]>([]);

    useEffect(() => {
        if (!open || !party || !email) return;

        const fetchLedger = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/payments", {
                    params: { email, partyName: party.name }
                });
                setPayments(res.data);
            } catch (err) {
                toast.error("Failed to load payment history");
            } finally {
                setLoading(false);
            }
        };

        fetchLedger();
    }, [open, party, email]);

    if (!open || !party) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-outfit px-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
                <div className="px-6 py-6 sm:px-8 sm:py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 border border-slate-200">
                            <History className="w-3 h-3" />
                            Payment History
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{party.name}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : payments.length > 0 ? (
                        <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[1.35rem] before:w-px before:bg-slate-100 pl-1">
                            {payments.map((payment) => (
                                <div key={payment._id} className="relative flex gap-4 sm:gap-6 group">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm transition-transform group-hover:scale-110 ${payment.type === "RECEIVE" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                                        }`}>
                                        {payment.type === "RECEIVE" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-200">
                                        <div className="flex justify-between items-start mb-2 border-b border-slate-50 pb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${payment.type === "RECEIVE" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                                        }`}>
                                                        {payment.type === "RECEIVE" ? "Received" : "Paid"}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-400">
                                                        {new Date(payment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className="font-bold text-slate-700 text-sm mt-2">{payment.notes || "Settlement Transaction"}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xl font-black tabular-nums tracking-tight ${payment.type === "RECEIVE" ? "text-emerald-600" : "text-rose-600"
                                                    }`}>
                                                    ₹{payment.amount.toLocaleString('en-IN')}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center justify-end gap-1">
                                                    <ArrowRightLeft className="w-3 h-3" /> {payment.voucherNo}
                                                </p>
                                            </div>
                                        </div>
                                        {payment.sourceTransaction && (
                                            <p className="text-xs font-semibold text-slate-500 pt-1">
                                                Source: <span className="text-slate-900 border-b border-slate-300 border-dashed">{payment.sourceTransaction}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <History className="w-8 h-8" />
                            </div>
                            <p className="text-slate-500 font-bold">No payment records found.</p>
                            <p className="text-sm text-slate-400 font-medium mt-1">Settle account to see history here.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
