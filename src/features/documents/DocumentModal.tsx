"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, CheckCircle2, Download, ExternalLink } from "lucide-react";
import axios from "axios";
import PrintableDocument from "./PrintableDocument";

interface DocumentModalProps {
    open: boolean;
    onClose: () => void;
    voucherNo: string;
    email: string;
}

export default function DocumentModal({
    open,
    onClose,
    voucherNo,
    email,
}: DocumentModalProps) {
    const [docData, setDocData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open && voucherNo && email) {
            setLoading(true);
            axios
                .get("/api/document", { params: { email, voucherNo } })
                .then((res) => {
                    setDocData(res.data);
                })
                .catch((err) => {
                    console.error("Failed to fetch document:", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [open, voucherNo, email]);

    if (!open) return null;

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
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/30 overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:rounded-none print:max-h-none print:relative print:scale-100"
            >
                {/* Header - Hidden on Print */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm print:hidden">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Transaction Successful</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                                Voucher #{voucherNo} • Operational Sync Complete
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 h-12 px-6 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                        >
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center group"
                        >
                            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        </button>
                    </div>
                </div>

                {/* Document Content */}
                <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible bg-slate-50/30">
                    {loading ? (
                        <div className="py-32 text-center">
                            <div className="relative w-16 h-16 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-emerald-100 rounded-full" />
                                <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Generating Digital Receipt...</p>
                        </div>
                    ) : docData ? (
                        <div className="bg-white print:bg-transparent overflow-hidden">
                            <PrintableDocument type={docData.type} doc={docData} />
                        </div>
                    ) : (
                        <div className="py-20 text-center text-rose-500 font-bold uppercase tracking-widest text-xs">
                            Synchronization Error: Document Not Found
                        </div>
                    )}
                </div>

                {/* Footer Actions - Hidden on Print */}
                <div className="px-8 py-6 border-t border-slate-100 bg-white flex items-center justify-between print:hidden">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                        Solicio Tactical Document Hub • Encrypted SSL Transaction
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="h-12 px-8 rounded-xl bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
