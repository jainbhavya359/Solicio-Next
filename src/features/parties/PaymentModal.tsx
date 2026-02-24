"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, TrendingUp, TrendingDown, Calendar, FileText } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const formatIndianNumber = (value: string | number) => {
    if (value === null || value === undefined || value === "") return "";
    const strValue = value.toString();
    const parts = strValue.split(".");
    if (parts[0] && parts[0] !== "-") {
        parts[0] = Number(parts[0]).toLocaleString('en-IN');
    }
    return parts.join(".");
};

interface PaymentModalProps {
    open: boolean;
    onClose: () => void;
    party: any;
    email: string;
    onSave: () => void;
}

export default function PaymentModal({ open, onClose, party, email, onSave }: PaymentModalProps) {
    const [loading, setLoading] = useState(false);

    const [type, setType] = useState<"RECEIVE" | "PAY">("RECEIVE");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState("");

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, "");
        if (/^\d*\.?\d*$/.test(raw)) {
            setAmount(raw);
        }
    };

    if (!open || !party) return null;

    const toTake = (party.totalSales || 0) - (party.totalReceived || 0);
    const toGive = (party.totalPurchases || 0) - (party.totalPaid || 0);

    const maxAllowed = type === "RECEIVE" ? toTake : toGive;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = Number(amount);

        if (!amount || numAmount <= 0) {
            toast.error("Enter a valid amount");
            return;
        }

        if (numAmount > maxAllowed) {
            toast.error(`Cannot ${type === "RECEIVE" ? "receive" : "pay"} more than ₹${maxAllowed.toLocaleString('en-IN')}`);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                email,
                partyName: party.name,
                type,
                amount: numAmount,
                date,
                notes
            };

            const res = await axios.post("/api/payments", payload);
            if (res.data.success) {
                toast.success(`Payment of ₹${amount} recorded`);
                onSave();
                onClose();
                setAmount("");
                setNotes("");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to record payment");
        } finally {
            setLoading(false);
        }
    };

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
                className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
                <div className="px-6 py-6 sm:px-8 sm:py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 border border-slate-200">
                            <FileText className="w-3 h-3" />
                            Settle Account
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

                {/* Current Balance Summary */}
                <div className="px-6 py-4 sm:px-8 sm:py-6 bg-slate-900 text-white flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3 text-emerald-400" /> To Take
                        </p>
                        <p className="text-xl font-black tracking-tight text-white">₹{toTake.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 flex justify-end items-center gap-1.5">
                            <TrendingDown className="w-3 h-3 text-rose-400" /> To Give
                        </p>
                        <p className="text-xl font-black tracking-tight text-white">₹{toGive.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction Direction</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setType("RECEIVE")}
                                className={`h-12 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${type === "RECEIVE"
                                    ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-500"
                                    : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                                    }`}
                            >
                                Money Received
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("PAY")}
                                className={`h-12 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${type === "PAY"
                                    ? "bg-rose-100 text-rose-700 border-2 border-rose-500"
                                    : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                                    }`}
                            >
                                Money Paid
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount Settled (₹)</label>
                        <input
                            type="text"
                            required
                            value={formatIndianNumber(amount)}
                            onChange={handleAmountChange}
                            placeholder={`Max: ₹${maxAllowed.toLocaleString('en-IN')}`}
                            className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all text-lg placeholder:text-slate-300 placeholder:font-medium"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none"
                            />
                            <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference / Notes</label>
                        <input
                            type="text"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="e.g. Cleared pending invoice"
                            className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50 font-medium text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-2xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Record Settlement"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
