"use client";

import { ArrowLeft, Printer } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DocumentHeader() {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto my-6 flex justify-between items-center px-8 print:hidden font-outfit">
            <button
                onClick={() => router.push("/inventory")}
                className="flex items-center gap-2 h-10 px-6 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 group"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Hub
            </button>

            <button
                onClick={() => window.print()}
                className="flex items-center gap-2 h-10 px-8 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
            >
                <Printer className="w-4 h-4" />
                Execute Print
            </button>
        </div>
    );
}
