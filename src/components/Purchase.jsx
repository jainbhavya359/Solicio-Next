import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Purchase({ newPurchase }) {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  const [email, setEmail] = useState("");
  const [productName, setProductName] = useState("");
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(1000);
  const [loading, setLoading] = useState(false);

  const date = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else if (user) {
      setEmail(user.email);
    }
  }, [isAuthenticated, user, loginWithRedirect]);

  const addStock = async () => {
    if (!productName || purchaseQuantity <= 0 || purchasePrice <= 0) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/stock`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            productName,
            purchaseQuantity,
            purchasePrice,
            date,
          }),
        }
      );

      if (response.ok) {
        setProductName("");
        setPurchaseQuantity(1);
        setPurchasePrice(1000);
      } else {
        console.error("Failed to add stock");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!newPurchase) return null;

  return (
    <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
      <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        Record a New Purchase
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-slate-300">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Steel Pipes"
            className="mt-2 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Quantity</label>
          <input
            type="number"
            min="1"
            value={purchaseQuantity}
            onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
            className="mt-2 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Price (₹)</label>
          <input
            type="number"
            min="0"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="mt-2 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      <button
        onClick={addStock}
        disabled={loading}
        className="mt-8 px-8 py-3 rounded-full font-bold text-black
        bg-gradient-to-r from-emerald-400 to-teal-400
        hover:opacity-90 transition shadow-lg disabled:opacity-50"
      >
        {loading ? "Adding..." : "+ Add to Stock"}
      </button>
    </section>
  );
}


// import React, { useState, useEffect, use } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// export default function Purchase({newPurchase}) {
//     const [ purchasePrice, setPurchasePrice ] = useState(1000);
//     const [ productName, setProductName ] = useState("");
//     const [ purchaseQuantity, setPurchaseQuantity ] = useState(1);

//     const { user, isAuthenticated, loginWithRedirect} = useAuth0();

//     let email = null;
//     useEffect(()=>{
//         if(isAuthenticated){
//             email = user.email;
//         }
//     })
//     const date = new Date().toISOString().split('T')[0];

//     const addStock = async () => {
//         console.log("clicked");
//         try{
//             const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/stock`,{
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({email, productName, purchaseQuantity, purchasePrice, date})
//             });

//             if(response.ok){
//                 setProductName("");
//                 setPurchasePrice(1000);
//                 setPurchaseQuantity(1);
//             }else{
//                 console.log("Can't Add Stock");
//             }


//         }catch(err){
//             console.log("Error", err);
//         }
//     }

//     return(
//         <>
//             <section
//                 className={`bg-white rounded-2xl shadow-lg p-8 transition-all ${
//                     newPurchase ? "opacity-100" : "hidden"
//                 }`}
//                 >
//                 <h3 className="text-2xl font-bold text-green-600 border-b pb-4 mb-6">Record a New Purchase</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                     <label htmlFor="bought-product-name" className="block text-gray-700 mb-2">
//                         Product Name
//                     </label>
//                     <input
//                         type="text"
//                         id="bought-product-name"
//                         placeholder="e.g., Steel Pipes"
//                         onChange={(e)=> {setProductName(e.target.value)}}
//                         className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
//                     />
//                     </div>
//                     <div>
//                     <label htmlFor="bought-quantity" className="block text-gray-700 mb-2">
//                         Quantity
//                     </label>
//                     <input
//                         type="number"
//                         id="bought-quantity"
//                         min="1"
//                         defaultValue="1"
//                         onChange={(e)=>{setPurchaseQuantity(e.target.value)}}
//                         className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
//                     />
//                     </div>
//                     <div>
//                     <label htmlFor="bought-quantity" className="block text-gray-700 mb-2">
//                         Price (₹)
//                     </label>
//                     <input
//                         type="number"
//                         id="bought-quantity"
//                         min="0"
//                         defaultValue="1000"
//                         onChange={(e)=>{setPurchasePrice(e.target.value)}}
//                         className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
//                     />
//                     </div>
//                 </div>
//                 <button
//                     className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:scale-105 transition"
//                     onClick={addStock}
//                 >
//                     Add to Stock
//                 </button>
//             </section>
//         </>
//     );
// }