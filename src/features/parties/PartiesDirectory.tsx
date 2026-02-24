"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, User, Building2, MapPin, Phone, Mail, Hash, Layers, Calendar, TrendingUp, TrendingDown, FileText, Edit2, History } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import PartyModal from "./PartyModal";
import PaymentModal from "./PaymentModal";
import PartyLedgerModal from "./PartyLedgerModal";

export default function PartiesDirectory() {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    const [parties, setParties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showLedgerModal, setShowLedgerModal] = useState(false);

    const fetchParties = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const res = await axios.get("/api/parties", {
                params: { email, search, t: Date.now() } // Cache-buster to ensure updated balances
            });
            setParties(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchParties();
        }, 500);
        return () => clearTimeout(timer);
    }, [email, search]);


    const [selectedParty, setSelectedParty] = useState<any>(null);

    const handleEdit = (party: any) => {
        setSelectedParty(party);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedParty(null);
    };

    const handleSettle = (party: any) => {
        setSelectedParty(party);
        setShowPaymentModal(true);
    };

    const handleHistory = (party: any) => {
        setSelectedParty(party);
        setShowLedgerModal(true);
    };

    // Helper to calculate credit status
    const getCreditStatus = (lastTxDate: string | Date | undefined, terms: string | undefined, totalAmount: number) => {
        if (!terms || terms === "Immediate" || terms === "Standard Terms" || totalAmount === 0 || !lastTxDate) {
            return null;
        }

        const match = terms.match(/Net (\d+)/);
        if (!match) return null;

        const creditDays = parseInt(match[1]);
        const txDate = new Date(lastTxDate);
        const dueDate = new Date(txDate.getTime() + creditDays * 24 * 60 * 60 * 1000);
        const today = new Date();

        // strip time from today for accurate diff
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);

        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { overdue: true, text: `Overdue by ${Math.abs(diffDays)} Days`, color: 'bg-rose-100 text-rose-700 border-rose-200' };
        } else if (diffDays === 0) {
            return { overdue: false, text: `Due Today`, color: 'bg-amber-100 text-amber-700 border-amber-200' };
        } else {
            return { overdue: false, text: `${diffDays} Days Left`, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
        }
    };

    const totalToTake = parties.reduce((sum, party) => sum + ((party.totalSales || 0) - (party.totalReceived || 0)), 0);
    const totalToGive = parties.reduce((sum, party) => sum + ((party.totalPurchases || 0) - (party.totalPaid || 0)), 0);
    const netBalance = totalToTake - totalToGive;

    // Calculate total money received vs paid to determine "Current Balance" (Cash proxy)
    const totalReceived = parties.reduce((sum, party) => sum + (party.totalReceived || 0), 0);
    const totalPaid = parties.reduce((sum, party) => sum + (party.totalPaid || 0), 0);
    const currentBalance = totalReceived - totalPaid;

    return (
        <div className="space-y-8 font-outfit">
            {/* ... Header ... */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Connections</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your customer and supplier relationships.</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search directory..."
                            className="h-12 pl-11 pr-4 rounded-xl bg-white border border-slate-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all w-64 md:w-80 font-bold text-slate-900 placeholder:font-medium"
                        />
                    </div>

                    <button
                        onClick={() => { setSelectedParty(null); setShowModal(true); }}
                        className="h-12 px-6 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 active:scale-95 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Contact</span>
                    </button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white p-5 lg:p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-emerald-500" /> Total to take</p>
                        <h3 className="text-2xl lg:text-3xl font-black text-emerald-600 tracking-tight">₹{totalToTake.toLocaleString('en-IN')}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 lg:p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 flex items-center gap-1.5"><TrendingDown className="w-3 h-3 text-rose-500" /> Total to give</p>
                        <h3 className="text-2xl lg:text-3xl font-black text-rose-600 tracking-tight">₹{totalToGive.toLocaleString('en-IN')}</h3>
                    </div>
                </div>
                <div className="bg-white border text-slate-900 border-indigo-200 p-5 lg:p-6 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 flex items-center gap-1.5"><Layers className="w-3 h-3 text-indigo-500" /> Net Credit/Debit</p>
                        <h3 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
                            {netBalance >= 0 ? '+' : '-'}₹{Math.abs(netBalance).toLocaleString('en-IN')}
                        </h3>
                    </div>
                </div>
                <div className="bg-slate-900 p-5 lg:p-6 rounded-3xl shadow-xl shadow-slate-900/10 flex items-center justify-between text-white ring-4 ring-slate-900/20">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 flex items-center gap-1.5"><FileText className="w-3 h-3 text-emerald-400" /> Current Balance</p>
                        <h3 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
                            ₹{currentBalance.toLocaleString('en-IN')}
                        </h3>
                    </div>
                </div>
            </div>

            {/* 📇 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 rounded-[2rem] bg-slate-100 animate-pulse" />
                        ))
                    ) : parties.length > 0 ? (
                        parties.map((party) => (
                            <motion.div
                                key={party._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                whileHover={{ y: -4 }}
                                onClick={() => handleEdit(party)}
                                className="group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden cursor-pointer"
                            >
                                {/* Card Background Pattern */}
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                    <Layers className="w-32 h-32" />
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${party.category === 'Company' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                                {party.category === 'Company' ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 leading-tight">{party.name}</h3>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{party.category} • {party.type}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 flex-1">
                                        {party.phone && (
                                            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                {party.phone}
                                            </div>
                                        )}
                                        {party.emailAddress && (
                                            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                {party.emailAddress}
                                            </div>
                                        )}
                                        {party.gstin && (
                                            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Hash className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-slate-700">{party.gstin}</span>
                                            </div>
                                        )}
                                        {party.state && (
                                            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                {party.state}
                                            </div>
                                        )}
                                        {party.category === 'Company' && (
                                            <div className="flex items-center gap-2 pt-2">
                                                {getCreditStatus(party.lastTransactionDate, party.paymentTerms, party.type === 'Customer' ? party.totalSales : party.totalPurchases) ? (
                                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${getCreditStatus(party.lastTransactionDate, party.paymentTerms, party.type === 'Customer' ? party.totalSales : party.totalPurchases)?.color}`}>
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {getCreditStatus(party.lastTransactionDate, party.paymentTerms, party.type === 'Customer' ? party.totalSales : party.totalPurchases)?.text}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        Settled / No terms
                                                    </div>
                                                )}
                                                {party.paymentTerms && party.paymentTerms !== "Standard Terms" && (
                                                    <span className="text-[10px] font-bold text-slate-400">({party.paymentTerms})</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                <TrendingUp className="w-3 h-3 text-emerald-500" /> To Take
                                            </p>
                                            <p className="text-lg font-black text-slate-900 tracking-tight">₹{Number((party.totalSales || 0) - (party.totalReceived || 0)).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div>
                                            <p className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                <TrendingDown className="w-3 h-3 text-rose-500" /> To Give
                                            </p>
                                            <p className="text-lg font-black text-slate-900 tracking-tight">₹{Number((party.totalPurchases || 0) - (party.totalPaid || 0)).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>

                                    {/* Action Hover Overlay */}
                                    <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px] p-4">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleHistory(party); }}
                                            className="flex flex-col items-center justify-center gap-1.5 w-16 h-16 bg-white hover:bg-slate-50 rounded-2xl shadow-lg border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all hover:scale-105 active:scale-95"
                                        >
                                            <History className="w-5 h-5" /> Hist
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(party); }}
                                            className="flex flex-col items-center justify-center gap-1.5 w-16 h-16 bg-white hover:bg-slate-50 rounded-2xl shadow-lg border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-all hover:scale-105 active:scale-95"
                                        >
                                            <Edit2 className="w-5 h-5" /> Edit
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleSettle(party); }}
                                            className="flex flex-col items-center justify-center gap-1.5 w-16 h-16 bg-slate-900 hover:bg-emerald-600 rounded-2xl shadow-lg shadow-slate-900/10 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95"
                                        >
                                            <FileText className="w-5 h-5" /> Pay
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-400 font-medium">No contacts found in directory.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <PartyModal
                open={showModal}
                onClose={handleClose}
                email={email || ""}
                onSave={fetchParties}
                initialData={selectedParty}
            />

            <AnimatePresence>
                {showPaymentModal && selectedParty && (
                    <PaymentModal
                        open={showPaymentModal}
                        onClose={() => setShowPaymentModal(false)}
                        party={selectedParty}
                        email={email || ""}
                        onSave={fetchParties}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showLedgerModal && selectedParty && (
                    <PartyLedgerModal
                        open={showLedgerModal}
                        onClose={() => setShowLedgerModal(false)}
                        party={selectedParty}
                        email={email || ""}
                    />
                )}
            </AnimatePresence>


        </div>
    );
}
