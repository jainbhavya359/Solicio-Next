
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, User, Phone, Mail, MapPin, Hash, CheckCircle2, AlertTriangle, ChevronDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface PartyModalProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    email: string;
    initialData?: any; // For editing
}

export default function PartyModal({ open, onClose, onSave, email, initialData }: PartyModalProps) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false); // Confirmation State

    const [formData, setFormData] = useState({
        name: "",
        type: "Customer", // Customer | Supplier
        category: "Individual", // Individual | Company
        contactPerson: "",
        phone: "",
        emailAddress: "",
        gstin: "",
        pan: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        paymentTerms: "",
    });

    const PAYMENT_TERMS = [
        { label: "Immediate", value: "Immediate" },
        { label: "Net 7", value: "Net 7" },
        { label: "Net 15", value: "Net 15" },
        { label: "Net 30", value: "Net 30" },
    ];

    // Populate form if editing
    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    name: initialData.name || "",
                    type: initialData.type || "Customer",
                    category: initialData.category || "Individual",
                    contactPerson: initialData.contactPerson || "",
                    phone: initialData.phone || "",
                    emailAddress: initialData.emailAddress || "",
                    gstin: initialData.gstin || "",
                    pan: initialData.pan || "",
                    address: initialData.address || "",
                    city: initialData.city || "",
                    state: initialData.state || "",
                    pincode: initialData.pincode || "",
                    paymentTerms: initialData.paymentTerms || "",
                });
            } else {
                // Reset for new entry
                setFormData({
                    name: "",
                    type: "Customer",
                    category: "Individual",
                    contactPerson: "",
                    phone: "",
                    emailAddress: "",
                    gstin: "",
                    pan: "",
                    address: "",
                    city: "",
                    state: "",
                    pincode: "",
                    paymentTerms: "",
                });
            }
        }
    }, [open, initialData]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = () => {
        if (!formData.name) {
            toast.error("Name is required");
            return;
        }
        // Show confirmation before saving/updating
        setShowConfirm(true);
    };

    const confirmSave = async () => {
        setLoading(true);
        setShowConfirm(false); // Close confirmation modal locally

        try {
            let res;
            if (initialData && initialData._id) {
                // UPDATE
                res = await axios.put("/api/parties", {
                    _id: initialData._id,
                    email,
                    ...formData
                });
            } else {
                // CREATE
                res = await axios.post("/api/parties", {
                    email,
                    ...formData
                });
            }

            if (res.data.success) {
                toast.success(initialData ? "Contact Updated" : "Contact Saved");
                onSave();
                onClose();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to save contact");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-outfit">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{initialData ? "Edit Contact" : "New Contact"}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {initialData ? "Update Details" : "Add to Rolodex"}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 flex items-center justify-center transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Form */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">

                        {/* Section 1: Identity */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Identity Protocol</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Entity Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter full name..."
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                                            autoFocus={!initialData}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Relationship</label>
                                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                                        {["Customer", "Supplier"].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setFormData(p => ({ ...p, type: t }))}
                                                className={`h-9 rounded-lg text-xs font-bold transition-all ${formData.type === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Structure</label>
                                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                                        {["Individual", "Company"].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setFormData(p => ({ ...p, category: c }))}
                                                className={`h-9 rounded-lg text-xs font-bold transition-all ${formData.category === c ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Coordinates */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Communication Uplink</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Mobile / Landline"
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            name="emailAddress"
                                            value={formData.emailAddress}
                                            onChange={handleChange}
                                            placeholder="email@domain.com"
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Compliance */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Fiscal Compliance</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">GSTIN</label>
                                    <div className="relative">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            name="gstin"
                                            value={formData.gstin}
                                            onChange={e => handleChange({ target: { name: 'gstin', value: e.target.value.toUpperCase() } })} /* Auto Uppercase */
                                            placeholder="Tax ID"
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">State</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="State Code or Name"
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                {formData.category === "Company" && (
                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Settlement Terms</label>
                                        <div className="relative">
                                            <select
                                                name="paymentTerms"
                                                value={formData.paymentTerms}
                                                onChange={handleChange}
                                                className="w-full h-12 pl-4 pr-12 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Standard Terms</option>
                                                {PAYMENT_TERMS.map((p) => (
                                                    <option key={p.value} value={p.value}>
                                                        {p.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                )}
                                <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Street address, City, Pincode..."
                                        className="w-full h-24 p-4 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 border-t border-slate-100 bg-white flex justify-end">
                        <button
                            onClick={handleSaveClick}
                            disabled={loading}
                            className="h-12 px-8 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 active:scale-95 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3 disabled:opacity-50"
                        >
                            {loading ? "Processing..." : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    {initialData ? "Update Record" : "Save Record"}
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* ⚠️ Warning Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowConfirm(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-slate-100"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Confirm Changes?</h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Are you sure you want to {initialData ? "update" : "save"} this contact? Please verify all details.
                                    </p>
                                </div>
                                <div className="flex gap-3 w-full pt-2">
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmSave}
                                        className="flex-1 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
