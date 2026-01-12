import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react"

export default function Sale({email}){

    const [name, setName] = useState("");
    const [ quantity, setQuantity] = useState(0);
    const [ price, setPrice ] = useState(0);

    // useEffect(()=>{

    // }, []);

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
                defaultValue="0"
                value={quantity}
                onChange={(e) => {setQuantity(e.target.value)}}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-red-400"
            />
            </div>

            <div>
            <label className="text-sm text-slate-300">Price</label>
            <input
                type="number"
                min="0"
                defaultValue="0"
                value={price}
                onChange={(e) => {setPrice(e.target.value)}}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-red-400"
            />
            </div>
        </div>

        <button
            className="mt-8 px-8 py-3 rounded-full font-bold text-black
            bg-gradient-to-r from-rose-400 to-red-500
            hover:opacity-90 transition shadow-lg"
        >
            Remove from Stock →
        </button>
        </div>
    )
}