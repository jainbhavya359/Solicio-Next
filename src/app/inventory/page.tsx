import Inventory from "@/src/components/Inventory";
import { Suspense } from "react";

export default function InventoryPage() {
    return (
        <div className="bg-white text-slate-900 antialiased">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Loading Inventory...</div>}>
                <Inventory />
            </Suspense>
        </div>
    )
}