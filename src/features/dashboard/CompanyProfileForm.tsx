"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Icons = {
    building: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M16 6h.01" />
            <path d="M12 6h.01" />
            <path d="M12 10h.01" />
            <path d="M12 14h.01" />
            <path d="M16 10h.01" />
            <path d="M16 14h.01" />
            <path d="M8 10h.01" />
            <path d="M8 14h.01" />
        </svg>
    ),
    save: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    ),
    loader: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
};

interface CompanyProfileFormProps {
    email: string;
}

export default function CompanyProfileForm({ email }: CompanyProfileFormProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    useEffect(() => {
        if (!email) return;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/company-profile?email=${email}`);
                if (res.data) {
                    setFormData({
                        name: res.data.name || "",
                        logoUrl: res.data.logoUrl || "",
                        address: res.data.address || "",
                        city: res.data.city || "",
                        state: res.data.state || "",
                        pincode: res.data.pincode || "",
                        gstin: res.data.gstin || "",
                        phone: res.data.phone || "",
                    });
                }
            } catch (error) {
                console.error("Failed to load company profile", error);
                toast.error("Failed to load company profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [email]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Quick validation
        if (!formData.name) {
            toast.error("Business Name is required");
            setSaving(false);
            return;
        }

        try {
            await axios.post("/api/company-profile", {
                email,
                ...formData,
            });
            toast.success("Company profile saved successfully!");
        } catch (error) {
            console.error("Failed to save company profile", error);
            toast.error("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full flex justify-center py-10">
                <div className="text-emerald-600">{Icons.loader}</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden mt-6">
            <div className="border-b border-stone-100 bg-stone-50/50 px-6 py-4 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                    {Icons.building}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-stone-900">Company Profile</h2>
                    <p className="text-sm text-stone-500">Manage your business details, branding, and tax information.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-stone-900 border-b border-stone-100 pb-2">Business Information</h3>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Business Name <span className="text-rose-500">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Solicio Pvt Ltd"
                                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Contact Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Logo URL</label>
                            <input
                                type="text"
                                name="logoUrl"
                                value={formData.logoUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">GSTIN / Tax ID</label>
                            <input
                                type="text"
                                name="gstin"
                                value={formData.gstin}
                                onChange={handleChange}
                                placeholder="22AAAAA0000A1Z5"
                                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-stone-900 border-b border-stone-100 pb-2">Address Details</h3>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Street Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="123 Trading Lane, Floor 2"
                                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Mumbai"
                                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    placeholder="400001"
                                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">State / Province</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="Maharashtra"
                                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold shadow-lg shadow-slate-200 hover:shadow-xl hover:bg-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? Icons.loader : Icons.save}
                        <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
