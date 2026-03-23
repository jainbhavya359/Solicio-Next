"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Network, Plus } from "lucide-react";

// The Intelligence Components
import PartiesHero from "../components/parties/PartiesHero";
import CashflowAlertStrip from "../components/parties/CashflowAlertStrip";
import PartyInsightPanel from "../components/parties/PartyInsightPanel";
import PartiesFilterBar from "../components/parties/PartiesFilterBar";
import PartyCard from "../components/parties/PartyCard";

// The Legacy Modals (Pre-existing)
import PartyModal from "../../parties/PartyModal";
import PaymentModal from "../../parties/PaymentModal";
import PartyLedgerModal from "../../parties/PartyLedgerModal";

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function PartiesSection() {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    const [parties, setParties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<"All" | "Customer" | "Supplier">("All");
    const [sortBy, setSortBy] = useState<"Recent" | "HighValue" | "Overdue">("Recent");

    // Modal States
    const [selectedParty, setSelectedParty] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showLedgerModal, setShowLedgerModal] = useState(false);

    const fetchParties = async () => {
        if (!email) return;
        setLoading(true);
        try {
            // Re-fetch all. Local filtering will handle sorting so we don't spam the DB with string matches
            const res = await axios.get("/api/parties", {
                params: { email, t: Date.now() }
            });
            setParties(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParties();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email]);

    // Modal Handlers
    const handleNew = () => { setSelectedParty(null); setShowModal(true); };
    const handleEdit = (party: any) => { setSelectedParty(party); setShowModal(true); };
    const handlePay = (party: any) => { setSelectedParty(party); setShowPaymentModal(true); };
    const handleHistory = (party: any) => { setSelectedParty(party); setShowLedgerModal(true); };

    // Advanced Filtering and Sorting Engine
    const filteredParties = parties.filter((party) => {
        const matchesSearch = party.name.toLowerCase().includes(search.toLowerCase()) || 
                              (party.phone && party.phone.includes(search)) || 
                              (party.gstin && party.gstin.toLowerCase().includes(search.toLowerCase()));
        
        const matchesType = filterType === "All" ? true : party.type === filterType;
        
        return matchesSearch && matchesType;
    }).sort((a, b) => {
        if (sortBy === "Recent") {
             const dateA = new Date(a.lastTransactionDate || 0).getTime();
             const dateB = new Date(b.lastTransactionDate || 0).getTime();
             return dateB - dateA;
        }
        if (sortBy === "HighValue") {
             const valA = Math.max(a.totalSales || 0, a.totalPurchases || 0);
             const valB = Math.max(b.totalSales || 0, b.totalPurchases || 0);
             return valB - valA;
        }
        if (sortBy === "Overdue") {
             // Basic sort proxy: parties with HIGHEST receivable net balance float to top
             const netA = (a.totalSales || 0) - (a.totalReceived || 0);
             const netB = (b.totalSales || 0) - (b.totalReceived || 0);
             return netB - netA;
        }
        return 0;
    });

    return (
        <div className="flex flex-col gap-6 max-w-[1400px] w-full mx-auto relative z-10 mb-10 overflow-x-hidden">
            
            {/* 1. Hero KPIs */}
            <PartiesHero parties={parties} />

            {/* 2. Overdue Alert Strip */}
            <CashflowAlertStrip parties={parties} />

            {/* 3. AI CRM Generation */}
            {parties.length > 0 && (
               <div className="mt-4">
                 <PartyInsightPanel parties={parties} />
               </div>
            )}

            {/* 4. Controls */}
            <PartiesFilterBar 
               search={search} setSearch={setSearch}
               filterType={filterType} setFilterType={setFilterType}
               sortBy={sortBy} setSortBy={setSortBy}
               onNew={handleNew}
            />

            {/* 5. The Core CRM Grid */}
            <section className="mt-4">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="bg-[#050505] rounded-[2rem] border border-white/5 p-24 shadow-sm flex flex-col items-center justify-center">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                            <p className="mt-8 text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Synchronizing Network...</p>
                        </div>
                    ) : filteredParties.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#050505] rounded-[2rem] border border-white/5 p-20 shadow-sm text-center flex flex-col items-center"
                        >
                            <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
                                <Network size={40} />
                            </div>
                            <p className="text-white font-black text-xl tracking-tight">Zero Institutional Links</p>
                            <p className="text-sm text-slate-500 mt-2 max-w-xs font-medium">No parties matched the current intelligence filters.</p>
                            {!parties.length && (
                                <button
                                    onClick={handleNew}
                                    className="mt-8 h-12 px-6 rounded-xl bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 active:scale-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Initialize First Contact
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid xl:grid-cols-3 md:grid-cols-2 gap-6"
                        >
                            {filteredParties.map((p) => (
                                <PartyCard 
                                   key={p._id} 
                                   party={p}
                                   onEdit={handleEdit}
                                   onPay={handlePay}
                                   onHistory={handleHistory}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* --- Legacy Modals Re-Mounted --- */}
            {showModal && (
                <PartyModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    email={email || ""}
                    onSave={fetchParties}
                    initialData={selectedParty}
                />
            )}

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
