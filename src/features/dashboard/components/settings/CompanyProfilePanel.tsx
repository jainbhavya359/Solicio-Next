"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Building2, Receipt, MapPin, Check, Loader2 } from "lucide-react";

interface Props {
    email: string;
}

export default function CompanyProfilePanel({ email }: Props) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        logoUrl: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gstin: "",
        phone: "",
    });

    const [originalData, setOriginalData] = useState<any>(null);

    useEffect(() => {
        if (!email) return;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/company-profile?email=${email}`);
                if (res.data) {
                    const data = {
                        name: res.data.name || "",
                        logoUrl: res.data.logoUrl || "",
                        address: res.data.address || "",
                        city: res.data.city || "",
                        state: res.data.state || "",
                        pincode: res.data.pincode || "",
                        gstin: res.data.gstin || "",
                        phone: res.data.phone || "",
                    };
                    setFormData(data);
                    setOriginalData(data);
                }
            } catch (error) {
                toast.error("Failed to load company profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [email]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => {
            const next = { ...prev, [e.target.name]: e.target.value };
            setIsDirty(JSON.stringify(next) !== JSON.stringify(originalData));
            return next;
        });
    };

    const handleSave = async () => {
        if (!formData.name) {
            toast.error("Business Name is required");
            return;
        }

        try {
            setSaving(true);
            await axios.post("/api/company-profile", { email, ...formData });
            setOriginalData(formData);
            setIsDirty(false);
            toast.success("Profile fully synchronized.");
        } catch (error) {
            toast.error("Failed to push changes to engine.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-64 flex flex-col items-center justify-center bg-[#050505] rounded-3xl border border-white/5">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hydrating Profile Metadata...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative pb-24">
            
            {/* Identity Card */}
            <section className="bg-[#050505] rounded-3xl border border-white/5 overflow-hidden">
                <div className="border-b border-white/5 bg-white/[0.02] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">Business Identity</h2>
                            <p className="text-xs text-slate-500 font-medium">Core metadata defining your brand within the ecosystem.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputBlock label="Registered Business Name *" name="name" value={formData.name} onChange={handleChange} placeholder="Solicio Pvt Ltd" />
                   <InputBlock label="Brand Logo URL" name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="https://cdn.example.com/logo.png" />
                   <InputBlock label="Corporate Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                </div>
            </section>

            {/* Legal & Compliance Card */}
            <section className="bg-[#050505] rounded-3xl border border-white/5 overflow-hidden">
                <div className="border-b border-white/5 bg-white/[0.02] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                            <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">Legal & Tax Parameters</h2>
                            <p className="text-xs text-slate-500 font-medium">Required keys for automated financial routing and compliance.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputBlock label="GSTIN / Corporate Tax ID" name="gstin" value={formData.gstin} onChange={handleChange} placeholder="22AAAAA0000A1Z5" />
                </div>
            </section>

            {/* Address & Nodes Card */}
            <section className="bg-[#050505] rounded-3xl border border-white/5 overflow-hidden">
                <div className="border-b border-white/5 bg-white/[0.02] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">Locational Nodes</h2>
                            <p className="text-xs text-slate-500 font-medium">Primary physical nodes for your inventory and corporate endpoints.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
                   <div className="md:col-span-2">
                     <InputBlock label="Street Address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Trading Lane, Floor 2" />
                   </div>
                   <InputBlock label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" />
                   <InputBlock label="Pincode / Zip" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="400001" />
                   <div className="md:col-span-2">
                     <InputBlock label="State / Province" name="state" value={formData.state} onChange={handleChange} placeholder="Maharashtra" />
                   </div>
                </div>
            </section>

            {/* Floating Action Bar Container */}
            <AnimatePresence>
                {isDirty && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#0a0a0a] border border-white/10 px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(16,185,129,0.1)]"
                    >
                        <p className="text-sm font-bold text-slate-300 mr-4">Unsaved system changes deployed.</p>
                        
                        <button 
                          onClick={() => { setFormData(originalData); setIsDirty(false); }}
                          className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors mr-2"
                        >
                            Discard
                        </button>

                        <button 
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Commit Changes
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

function InputBlock({ label, name, value, onChange, placeholder }: any) {
    return (
        <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-500 group-focus-within:text-emerald-400 transition-colors uppercase tracking-widest flex items-center gap-2">
                {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:bg-white/[0.08] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none"
                />
            </div>
        </div>
    );
}
