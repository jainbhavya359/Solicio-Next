
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, User, Building2, MapPin, Phone, Mail, Hash, Layers } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import PartyModal from "./PartyModal";

export default function PartiesDirectory() {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    const [parties, setParties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const fetchParties = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const res = await axios.get("/api/parties", {
                params: { email, search }
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
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Volume</p>
                                            <p className="text-xl font-black text-slate-900 tracking-tight">₹{Number(party.totalSales + party.totalPurchases).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${party.type === 'Customer' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {party.type}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Edit Hint Overlay */}
                                    <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                        <div className="px-4 py-2 bg-white rounded-xl shadow-lg text-xs font-bold uppercase tracking-widest text-slate-900">
                                            Edit Contact
                                        </div>
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


        </div>
    );
}
