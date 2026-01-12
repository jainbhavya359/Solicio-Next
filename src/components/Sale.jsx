import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react"
import { UNITS } from "../utils/store";
import axios from "axios";
import toast from "react-hot-toast";

export default function Sale(){

    const [name, setName] = useState("");
    const [ quantity, setQuantity] = useState(0);
    const [ price, setPrice ] = useState(0);
    const [ unit, setUnit ] = useState("");
    const [ firmName, setFirmName ] = useState("");
    const [ date, setDate ] = useState( new Date().toISOString().split("T")[0] );
    const [loading, setLoading] = useState(false);

    const [units, setUnits] = useState(UNITS);
    const [customUnit, setCustomUnit] = useState("");

    const {user} = useUser();
    
    const email = user?.primaryEmailAddress.emailAddress;

    useEffect(()=>{
        if(!email) return;
    },[email]);

    const handleCustomUnit = () => {
        const formatted = customUnit.trim();

        if (!formatted) return;

        // Normalize (important)
        const normalized =
        formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();

        // Prevent duplicates
        if (!units.includes(normalized)) {
        setUnits((prev) => [...prev.filter(u => u !== "Custom"), normalized, "Custom"]);
        }

        // Auto-select new unit
        setUnit(normalized);
        setCustomUnit("");
    };

    const removeStock = async () => {
        if (!name || quantity <= 0 || price <= 0 || unit.length == 0) {
            toast("Invalid Sale");
            return;
        }

        setLoading(true);
        try {
        const response = await axios.post("/api/sellStock",
            JSON.stringify({
                email,
                name: name.toLowerCase(),
                quantity,
                price,
                unit,
                date,
                voucher: "Sale",
            })
        );

        if (response.data.success) {
            setName("");
            setQuantity(1);
            setPrice(1000);
            toast("Stock sold successfully");
        } else {
            console.error("Failed to sell stock");
            toast("Failed to sell stock");
        }
        } catch (err) {
        console.error("Error:", err);
        toast("Failed to remove stock onto server");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
        <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent">
            Record a Sale
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
            <div>
            <label className="text-sm text-slate-300">Product Name</label>
            <input
                type="text"
                placeholder="e.g., Steel Pipes"
                value={name}
                onChange={(e) => {setName(e.target.value)}}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-red-400"
            />
            </div>

            <div>
            <label className="text-sm text-slate-300">Quantity</label>
            <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => {setQuantity(e.target.value)}}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-red-400"
            />
            </div>

            <div>
                <label className="text-sm text-slate-300">Unit (Recomended to keep same)</label>

                <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl 
                            bg-black/40 border border-white/10 
                            outline-none focus:border-emerald-400
                            text-slate-200"
                >
                <option value="" className="bg-slate-900">Select Unit</option>

                {UNITS.map((u) => (
                    <option key={u} value={u} className="bg-slate-900">
                    {u}
                    </option>
                ))}
                </select>

                {unit === "Custom" && (
                    <input
                    type="text"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    onBlur={handleCustomUnit}
                    placeholder="Enter custom unit"
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                    />
                )}

            </div>

            <div>
            <label className="text-sm text-slate-300">Price</label>
            <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => {setPrice(e.target.value)}}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-red-400"
            />
            </div>

            <div>
            <label className="text-sm text-slate-300">To</label>
            <input
                type="text"
                placeholder="e.g., ABC Traders"
                value={firmName}
                onChange={(e) => {setFirmName(e.target.value)}}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-red-400"
            />
            </div>

            <div>
                <label className="text-sm text-slate-300">Sale Date</label>
                <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
                />
            </div>
        </div>

        <button
            onClick={removeStock}
            className="mt-8 px-8 py-3 rounded-full font-bold text-black
            bg-gradient-to-r from-rose-400 to-red-500
            hover:opacity-90 transition shadow-lg"
        >
            Remove from Stock →
        </button>
        </div>
    )
}