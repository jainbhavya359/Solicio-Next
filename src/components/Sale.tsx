"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Minus, Package } from "lucide-react";

export default function Sale({
  visible,
  preSelectedProduct,
  reloadSetter,
  reload,
}: any) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showProducts, setShowProducts] = useState(false);

  const [partyName, setPartyName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  /* ---------------- Close dropdown on outside click ---------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowProducts(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- Fetch Products ---------------- */
  useEffect(() => {
    if (!email) return;

    if (preSelectedProduct && Object.keys(preSelectedProduct).length) {
      setSelectedProduct(preSelectedProduct);
    }

    axios
      .get("/api/products", { params: { email } })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.products)
          ? res.data.products
          : [];

        setProducts(list.filter((p:any) => p?.name && p?.unit));
      })
      .catch(() => toast.error("Failed to load products"));
  }, [email, reload, preSelectedProduct]);

  /* ---------------- Quantity Controls ---------------- */
  const increment = () => {
    if (!selectedProduct) return;

    const maxQty =
      selectedProduct.availableQty ?? selectedProduct.quantity ?? 0;

    setQuantity(q => {
      if (q >= maxQty) {
        toast.error("Not enough stock");
        return q;
      }
      return q + 1;
    });
  };

  const decrement = () =>
    setQuantity(q => (q > 1 ? q - 1 : 1));

  /* ---------------- Submit Sale ---------------- */
  const removeStock = async () => {
    if (!selectedProduct || Number(price) <= 0) {
      toast.error("Select product and enter price");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/sellStock", {
        email,
        name: selectedProduct.name,
        quantity,
        sellingPrice: Number(price),
        unit: selectedProduct.unit,
        partyName,
        date,
        voucher: "Sale",
      });

      if (res.data?.success) {
        toast.success("Sale recorded");
        setQuantity(1);
        setPrice("");
        setSelectedProduct(null);
      } else {
        toast.error(res.data?.message || "Sale failed");
      }
    } catch {
      toast.error("Failed to record sale");
    } finally {
      setLoading(false);
      reloadSetter(!reload);
    }
  };

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
      {/* Header */}
      <h3 className="text-xl font-bold text-stone-900">
        Quick Sale
      </h3>
      <p className="text-sm text-stone-500 mb-6">
        Click to sell items from stock
      </p>

      {/* Product Selector */}
      <div className="mb-6 relative" ref={dropdownRef}>
        <label className="text-xs text-stone-500 mb-1 block">
          Product
        </label>

        <button
          onClick={() => setShowProducts(v => !v)}
          className="
            w-full h-12 px-4 rounded-lg border border-stone-300
            bg-white text-left text-stone-900
            hover:border-rose-400 transition
          "
        >
          {selectedProduct
            ? `${selectedProduct.name} (${selectedProduct.unit})`
            : "Select product"}
        </button>

        {showProducts && (
          <div
            className="
              absolute left-0 right-0 z-50 mt-2
              max-h-64 overflow-y-auto overflow-x-hidden
              rounded-lg border border-stone-200 bg-white shadow-lg
            "
          >
            {products.map(p => {
              const stock =
                p.availableQty ?? p.quantity ?? 0;

              const outOfStock = stock <= 0;

              return (
                <button
                  key={p._id}
                  disabled={outOfStock}
                  onClick={() => {
                    setSelectedProduct(p);
                    setPrice(p.sellingPrice ?? "");
                    setQuantity(1);
                    setShowProducts(false);
                  }}
                  className={`
                    w-full px-4 py-3 text-left flex justify-between items-center
                    hover:bg-stone-50 transition
                    ${outOfStock ? "opacity-40 cursor-not-allowed" : ""}
                  `}
                >
                  <div>
                    <p className="font-medium text-stone-900">
                      {p.name}
                    </p>
                    <p className="text-xs text-stone-500">
                      Unit: {p.unit}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      outOfStock
                        ? "text-rose-500"
                        : stock <= 5
                        ? "text-amber-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {outOfStock ? "Out of stock" : `${stock} left`}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Product Card */}
      {selectedProduct && (
        <div className="flex justify-between items-center
          border border-stone-200 rounded-xl p-4 mb-6 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center">
              <Package className="text-rose-600" size={18} />
            </div>
            <div>
              <p className="font-semibold text-stone-900">
                {selectedProduct.name}
              </p>
              <p className="text-xs text-stone-500">
                Unit: {selectedProduct.unit}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={decrement}
              className="h-9 w-9 rounded-lg border border-stone-300"
            >
              <Minus size={16} />
            </button>

            <span className="w-8 text-center font-semibold">
              {quantity}
            </span>

            <button
              onClick={increment}
              className="h-9 w-9 rounded-lg border border-stone-300"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <input
          placeholder="Customer name (optional)"
          value={partyName}
          onChange={e => setPartyName(e.target.value)}
          className="h-11 px-4 rounded-lg border border-stone-300"
        />

        <input
          type="number"
          placeholder="Selling price per unit (₹)"
          value={price}
          min={0}
          onChange={e => setPrice(e.target.value)}
          className="h-11 px-4 rounded-lg border border-stone-300"
        />

        <div className="md:col-span-2">
          <label className="text-xs text-stone-500 block mb-1">
            Sale Date
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="h-11 w-full px-4 rounded-lg border border-stone-300"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-stone-500">
          Stock & revenue updated instantly
        </p>

        <button
          onClick={removeStock}
          disabled={loading}
          className="
            px-6 py-3 rounded-xl font-semibold text-white
            bg-rose-600 hover:bg-rose-700
            disabled:opacity-50
          "
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