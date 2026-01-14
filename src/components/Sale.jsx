"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Minus, Package } from "lucide-react";

export default function Sale({ visible }) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress.emailAddress;

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProducts, setShowProducts] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  /* ---------------- Fetch Products ---------------- */
  useEffect(() => {
    if (!email) return;

    axios
      .get("/api/products", { params: { email } })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.products)
          ? res.data.products
          : [];

        setProducts(
  list.filter(p =>
    p?.name &&
    p?.unit &&
    typeof p.quantity === "number"
  )
);

      })
      .catch(() => toast.error("Failed to load products"));
  }, [email]);

  /* ---------------- Quantity Controls ---------------- */
  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  /* ---------------- Submit Sale ---------------- */
  const removeStock = async () => {
    if (!selectedProduct || price <= 0) {
      toast.error("Select product and enter price");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/sellStock", {
        email,
        name: selectedProduct.name,
        quantity,
        price,
        unit: selectedProduct.unit,
        date,
        voucher: "Sale",
      });

      if (res.data.success) {
        toast.success("Sale recorded");
        setQuantity(1);
        setPrice("");
        setSelectedProduct(null);
      } else {
        toast.error(res.data.message || "Sale failed");
      }
    } catch {
      toast.error("Failed to record sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <h3 className="text-2xl font-bold text-white mb-1">
        Quick Sale
      </h3>
      <p className="text-sm text-slate-400 mb-6">
        Click to sell items from stock
      </p>

      {/* Product Selector */}
<div className="mb-6">
  <label className="text-xs text-slate-400 mb-1 block">
    Product
  </label>

  <div className="relative">
    <button
      onClick={() => setShowProducts(v => !v)}
      className="w-full px-5 py-4 rounded-2xl
      bg-black/50 border border-white/10
      text-left text-white
      hover:border-rose-400 transition"
    >
      {selectedProduct
        ? `${selectedProduct.name} (${selectedProduct.unit})`
        : "Select product"}
    </button>

    {showProducts && (
  <div className="absolute z-50 mt-2 w-full
    rounded-2xl border border-white/10
    bg-slate-900/95 backdrop-blur-xl
    shadow-2xl max-h-64 overflow-auto">

    {products.map((p) => {
      const outOfStock = p.quantity <= 0;
      const lowStock = p.quantity > 0 && p.quantity <= 5;

      return (
        <button
          key={p._id ?? `${p.name}-${p.unit}`}
          disabled={outOfStock}
          onClick={() => {
            setSelectedProduct(p);
            setShowProducts(false);
          }}
          className={`w-full px-5 py-3 text-left flex items-center justify-between
            transition
            ${outOfStock
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-white/10"}
          `}
        >
          {/* Product Name */}
          <div>
            <p className="text-white font-medium">
              {p.name}
            </p>
            <p className="text-xs text-slate-400">
              Unit: {p.unit}
            </p>
          </div>

          {/* Stock Indicator */}
          <div className="text-right">
            {outOfStock ? (
              <span className="text-xs text-red-400 font-semibold">
                Out of stock
              </span>
            ) : lowStock ? (
              <span className="text-xs text-amber-400 font-semibold">
                {p.quantity} left
              </span>
            ) : (
              <span className="text-xs text-emerald-400 font-semibold">
                {p.quantity} in stock
              </span>
            )}
          </div>
        </button>
      );
    })}
  </div>
)}

  </div>
</div>


      {/* Product Card */}
      {selectedProduct && (
        <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-400/20 flex items-center justify-center">
              <Package className="text-rose-400" />
            </div>
            <div>
              <p className="text-white font-semibold">
                {selectedProduct.name}
              </p>
              <p className="text-xs text-slate-400">
                Unit: {selectedProduct.unit}
              </p>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={decrement}
              className="h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20"
            >
              <Minus />
            </button>

            <span className="w-8 text-center text-white font-bold">
              {quantity}
            </span>

            <button
              onClick={increment}
              className="h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20"
            >
              <Plus />
            </button>
          </div>
        </div>
      )}

      {/* Price & Date */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <input
          type="number"
          placeholder="Selling price per unit (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white"
        />

        <div className="rounded-2xl bg-black/40 border border-white/10 p-4
  hover:border-rose-400 transition">
  <label className="text-xs text-slate-400">
    Sale Date
  </label>

  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="mt-2 w-full bg-transparent
    text-white text-sm outline-none
    [color-scheme:dark]"
  />
</div>

      </div>

      {/* CTA */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-slate-400">
          Stock & revenue updated instantly
        </p>

        <button
          onClick={removeStock}
          disabled={loading}
          className="px-6 py-3 rounded-xl font-bold text-black
          bg-gradient-to-r from-rose-400 to-red-500
          disabled:opacity-50"
        >
          {loading ? "Processing…" : "Add Sale"}
        </button>
      </div>
    </section>
  );
}


// import { useUser } from "@clerk/nextjs";
// import { useEffect, useState } from "react"
// import { UNITS } from "../utils/store";
// import axios from "axios";
// import toast from "react-hot-toast";

// export default function Sale(){

//     const [name, setName] = useState("");
//     const [ quantity, setQuantity] = useState(0);
//     const [ price, setPrice ] = useState(0);
//     const [ unit, setUnit ] = useState("");
//     const [ firmName, setFirmName ] = useState("");
//     const [ date, setDate ] = useState( new Date().toISOString().split("T")[0] );
//     const [loading, setLoading] = useState(false);

//     const [units, setUnits] = useState(UNITS);
//     const [customUnit, setCustomUnit] = useState("");

//     const {user} = useUser();
    
//     const email = user?.primaryEmailAddress.emailAddress;

//     useEffect(()=>{
//         if(!email) return;
//     },[email]);

//     const handleCustomUnit = () => {
//         const formatted = customUnit.trim();

//         if (!formatted) return;

//         // Normalize (important)
//         const normalized =
//         formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();

//         // Prevent duplicates
//         if (!units.includes(normalized)) {
//         setUnits((prev) => [...prev.filter(u => u !== "Custom"), normalized, "Custom"]);
//         }

//         // Auto-select new unit
//         setUnit(normalized);
//         setCustomUnit("");
//     };

//     const removeStock = async () => {
//         if (!name || quantity <= 0 || price <= 0 || unit.length == 0) {
//             toast("Invalid Sale");
//             return;
//         }

//         setLoading(true);
//         try {
//         const response = await axios.post("/api/sellStock",
//             JSON.stringify({
//                 email,
//                 name: name.toLowerCase(),
//                 quantity,
//                 price,
//                 unit,
//                 date,
//                 voucher: "Sale",
//             })
//         );

//         if (response.data.success) {
//             setName("");
//             setQuantity(1);
//             setPrice(1000);
//             toast("Stock sold successfully");
//         } else {
//             console.error("Failed to sell stock");
//             toast("Failed to sell stock");
//         }
//         } catch (err) {
//         console.error("Error:", err);
//         toast("Failed to remove stock onto server");
//         } finally {
//         setLoading(false);
//         }
//     };

//     return (
//         <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
//         <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent">
//             Record a Sale
//         </h3>

//         <div className="grid md:grid-cols-2 gap-6">
//             <div>
//             <label className="text-sm text-slate-300">Product Name</label>
//             <input
//                 type="text"
//                 placeholder="e.g., Steel Pipes"
//                 value={name}
//                 onChange={(e) => {setName(e.target.value)}}
//                 className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-red-400"
//             />
//             </div>

//             <div>
//             <label className="text-sm text-slate-300">Quantity</label>
//             <input
//                 type="number"
//                 min="0"
//                 value={quantity}
//                 onChange={(e) => {setQuantity(e.target.value)}}
//                 className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-red-400"
//             />
//             </div>

//             <div>
//                 <label className="text-sm text-slate-300">Unit (Recomended to keep same)</label>

//                 <select
//                 value={unit}
//                 onChange={(e) => setUnit(e.target.value)}
//                 className="mt-2 w-full px-4 py-3 rounded-xl 
//                             bg-black/40 border border-white/10 
//                             outline-none focus:border-emerald-400
//                             text-slate-200"
//                 >
//                 <option value="" className="bg-slate-900">Select Unit</option>

//                 {UNITS.map((u) => (
//                     <option key={u} value={u} className="bg-slate-900">
//                     {u}
//                     </option>
//                 ))}
//                 </select>

//                 {unit === "Custom" && (
//                     <input
//                     type="text"
//                     value={customUnit}
//                     onChange={(e) => setCustomUnit(e.target.value)}
//                     onBlur={handleCustomUnit}
//                     placeholder="Enter custom unit"
//                     className="mt-2 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
//                     />
//                 )}

//             </div>

//             <div>
//             <label className="text-sm text-slate-300">Price</label>
//             <input
//                 type="number"
//                 min="0"
//                 value={price}
//                 onChange={(e) => {setPrice(e.target.value)}}
//                 className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-red-400"
//             />
//             </div>

//             <div>
//             <label className="text-sm text-slate-300">To</label>
//             <input
//                 type="text"
//                 placeholder="e.g., ABC Traders"
//                 value={firmName}
//                 onChange={(e) => {setFirmName(e.target.value)}}
//                 className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-red-400"
//             />
//             </div>

//             <div>
//                 <label className="text-sm text-slate-300">Sale Date</label>
//                 <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
//                 />
//             </div>
//         </div>

//         <button
//             onClick={removeStock}
//             className="mt-8 px-8 py-3 rounded-full font-bold text-black
//             bg-gradient-to-r from-rose-400 to-red-500
//             hover:opacity-90 transition shadow-lg"
//         >
//             Remove from Stock →
//         </button>
//         </div>
//     )
// }