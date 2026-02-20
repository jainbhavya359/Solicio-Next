"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import StockHistory from "@/src/features/stock/StockHistory";
import Header from "@/src/components/layout/Header";

export default function TransactionsPage() {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    const [data, setData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!email) return;

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/stock", { params: { email } });
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch stock history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [email]);

    return (
        <main className="min-h-screen bg-[#F7FAF9] font-outfit relative overflow-hidden">
            <Header />
            {/* Background radial grid */}
            <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24">
                {loading ? (
                    <section className="rounded-[2.5rem] border border-slate-200 bg-white p-12 shadow-sm border-dashed flex flex-col items-center justify-center min-h-[400px]">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-emerald-600 mb-4" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Synchronizing Audit Logs...
                        </p>
                    </section>
                ) : (
                    <StockHistory data={data || []} />
                )}
            </div>
        </main>
    );
}