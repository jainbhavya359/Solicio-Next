import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Calendar, FileText, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
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

type FinancialEntryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    type: "Expense" | "TaxPayment" | "StockWriteOff";
    onSuccess: () => void;
};

export default function FinancialEntryModal({ isOpen, onClose, type, onSuccess }: FinancialEntryModalProps) {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [amount, setAmount] = useState("");
    const [narration, setNarration] = useState("");
    const [loading, setLoading] = useState(false);

    const [history, setHistory] = useState<any[]>([]);
    const [fetchingHistory, setFetchingHistory] = useState(false);

    // Labels based on type
    const typeLabels = {
        Expense: { title: "Operating Expenses", btn: "Add Expense", placeholder: "e.g., Office Rent, Electricity" },
        TaxPayment: { title: "Taxes Paid", btn: "Record Tax Payment", placeholder: "e.g., GST Payment Q1" },
        StockWriteOff: { title: "Inventory Write-downs", btn: "Record Write-down", placeholder: "e.g., Damaged Goods" }
    };
    const labels = typeLabels[type];

    useEffect(() => {
        if (isOpen && email) {
            fetchHistory();
        }
    }, [isOpen, email, type]);

    const fetchHistory = async () => {
        setFetchingHistory(true);
        try {
            const res = await axios.get("/api/financial-entry", { params: { email, type } });
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setFetchingHistory(false);
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, "");
        if (/^\d*\.?\d*$/.test(raw)) {
            setAmount(raw);
        }
    };

    const handleSave = async () => {
        if (!amount || Number(amount) <= 0) {
            toast.error("Enter a valid amount");
            return;
        }

        setLoading(true);
        try {
            await axios.post("/api/financial-entry", {
                email,
                date,
                voucherType: type,
                amount: Number(amount),
                narration
            });
            toast.success("Entry recorded successfully");
            setAmount("");
            setNarration("");
            fetchHistory();
            onSuccess();
        } catch (error: any) {
            console.error(error);
            const errMsg = error.response?.data?.error || "Failed to record entry";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this entry?")) return;
        try {
            await axios.delete("/api/financial-entry", { data: { id } });
            toast.success("Entry deleted");
            fetchHistory();
            onSuccess();
        } catch (err) {
            toast.error("Failed to delete entry");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0a0a0a] rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-full max-w-xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]"
            >
                <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/5 bg-white/5">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{labels.title}</h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">Record a new financial entry</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 border border-transparent flex items-center justify-center text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 sm:p-8 overflow-y-auto font-outfit">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                                    <Calendar size={14} /> Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 text-sm font-bold text-white outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all [color-scheme:dark]"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                                    <DollarSign size={14} /> Amount
                                </label>
                                <input
                                    type="text"
                                    value={formatIndianNumber(amount)}
                                    onChange={handleAmountChange}
                                    placeholder="₹ 0.00"
                                    className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 text-sm font-bold text-white outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                                <FileText size={14} /> Description
                            </label>
                            <input
                                type="text"
                                value={narration}
                                onChange={(e) => setNarration(e.target.value)}
                                placeholder={labels.placeholder}
                                className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 text-sm font-bold text-white outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600"
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full h-14 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all text-slate-950 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.3)] disabled:opacity-20 disabled:shadow-none"
                        >
                            <Plus size={18} className="stroke-[3]" />
                            {loading ? "Recording..." : labels.btn}
                        </button>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-sm font-bold text-white mb-4 tracking-tight">Recent Entries</h3>
                        {fetchingHistory ? (
                            <p className="text-xs font-semibold text-emerald-500 animate-pulse">Loading history...</p>
                        ) : history.length === 0 ? (
                            <div className="p-6 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 mb-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                                    <FileText size={24} />
                                </div>
                                <p className="text-sm font-bold text-slate-500">No recent entries found</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.map((entry) => (
                                    <div key={entry._id} className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 transition-colors">
                                        <div>
                                            <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{entry.narration || entry.voucherNo}</p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                                                {new Date(entry.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-black text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                                                ₹{entry.amount?.toLocaleString()}
                                            </span>
                                            <button
                                                onClick={() => handleDelete(entry._id)}
                                                className="w-8 h-8 rounded-lg bg-white/5 border border-transparent flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all"
                                                title="Delete Entry"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
