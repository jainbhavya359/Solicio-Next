import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import Purchase from "./Purchase";
import StockReport from "./StockReport";

export default function Inventory() {
  const [newPurchase, setNewPurchase] = useState(false);
  const [newSale, setNewSale] = useState(false);

  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect({ appState: { returnTo: location.pathname } });
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28">

      {/* Ambient blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-24">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            Business Optimization
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Track inventory, manage purchases and sales, and gain clarity into
            your business operations.
          </p>
        </div>

        {/* INVENTORY ACTIONS */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">Inventory Management</h2>

          <div className="flex flex-col sm:flex-row gap-6">
            <button
              onClick={() => {
                setNewPurchase(true);
                setNewSale(false);
              }}
              className="flex-1 py-4 rounded-2xl font-bold text-black
              bg-gradient-to-r from-emerald-400 to-teal-400
              hover:opacity-90 transition shadow-lg"
            >
              + Bought Stock
            </button>

            <button
              onClick={() => {
                setNewSale(true);
                setNewPurchase(false);
              }}
              className="flex-1 py-4 rounded-2xl font-bold text-black
              bg-gradient-to-r from-rose-400 to-red-500
              hover:opacity-90 transition shadow-lg"
            >
              − Sold Stock
            </button>
          </div>
        </div>

        {/* PURCHASE */}
        {newPurchase && (
          <div className="space-y-6">
            <Purchase newPurchase={newPurchase} />
          </div>
        )}

        {/* SOLD FORM */}
        {newSale && (
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
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Quantity</label>
                <input
                  type="number"
                  min="1"
                  defaultValue="1"
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
        )}

        {/* STOCK REPORT */}
        <StockReport />

        {/* SALES REPORT */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Sales Report
          </h2>

          <p className="text-slate-300 mb-4">
            Insights into your recent sales activity.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-white/10 text-slate-300">
                <tr>
                  <th className="py-3 text-left">Product</th>
                  <th className="py-3 text-left">Quantity</th>
                  <th className="py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan="3"
                    className="py-6 text-center text-slate-400"
                  >
                    No sales history yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}



// import React, { use, useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import Purchase from "./Purchase";
// import StockReport from "./StockReport";
// import { useLocation } from "react-router-dom";

// export default function Inventory (){

//     const [ newPurchase, setNewPurchase ] = useState(false);
//     const [ newSale, setNewSale ] = useState(false);
//     const location = useLocation();

//     const { isAuthenticated, loginWithRedirect} = useAuth0();

//     function handleBought(){
//         setNewSale(false);
//         setNewPurchase(true);
//     }

//     function handleSold(){
//         setNewPurchase(false);
//         setNewSale(true);
//     }

//     useEffect(()=>{
//         if(!isAuthenticated){
//             loginWithRedirect({
//                 appState: { returnTo: location.pathname }
//             });
//         }

//         window.scrollTo(0,0);
//     },[]);

//     return (
//         <main className="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 mt-9">
//             <div className="w-full max-w-5xl space-y-8 mt-9">
                
//                 {/* Header Section */}
//                 <header className="text-center">
//                 <h1 className="text-5xl font-extrabold text-indigo-700 mb-4 tracking-tight">
//                     Business Optimization
//                 </h1>
//                 <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                     Manage your inventory, track sales, and optimize your business operations.
//                 </p>
//                 </header>

//                 {/* Inventory Management */}
//                 <section className="bg-white rounded-2xl shadow-lg p-8 transition hover:shadow-xl">
//                 <h2 className="text-3xl font-bold text-indigo-600 border-b pb-4 mb-6">
//                     Inventory Management
//                 </h2>
//                 <div className="flex gap-6">
//                     <button
//                     className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:scale-105 transition"
//                     onClick={handleBought}
//                     >
//                     Bought
//                     </button>
//                     <button
//                     className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:scale-105 transition"
//                     onClick={handleSold}
//                     >
//                     Sold
//                     </button>
//                 </div>
//                 </section>

//                 {/* New Purchase Form */}
//                 <Purchase newPurchase={newPurchase}/>

//                 {/* Sold Form */}
//                 <section id="sold-form-container" className={`bg-white rounded-2xl shadow-lg p-8 ${ newSale ? "opacity-100" : "hidden"}`}>
//                 <h3 className="text-2xl font-bold text-red-600 border-b pb-4 mb-6">
//                     Record a New Sale
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                     <label htmlFor="sold-product-name" className="block text-gray-700 mb-2">
//                         Product Name
//                     </label>
//                     <input
//                         type="text"
//                         id="sold-product-name"
//                         placeholder="e.g., Steel Pipes"
//                         className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500"
//                     />
//                     </div>
//                     <div>
//                     <label htmlFor="sold-quantity" className="block text-gray-700 mb-2">
//                         Quantity
//                     </label>
//                     <input
//                         type="number"
//                         id="sold-quantity"
//                         min="1"
//                         defaultValue="1"
//                         className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500"
//                     />
//                     </div>
//                 </div>
//                 <button
//                     className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:scale-105 transition"
                    
//                 >
//                     Remove from Stock
//                 </button>
//                 </section>

//                 {/* Current Stock Report */}
//                 <StockReport />

//                 {/* Sales Report */}
//                 <section className="bg-white rounded-2xl shadow-lg p-8">
//                 <h2 className="text-2xl font-bold text-teal-600 border-b pb-4 mb-6">
//                     Sales Report
//                 </h2>
//                 <div id="sold-report">
//                     <h3 className="text-xl font-semibold text-gray-800">Most Selling Product (This Week)</h3>
//                     <h3 className="text-xl font-semibold text-gray-800 mt-6">Sales History</h3>
//                     <table className="w-full border-collapse mt-4">
//                     <thead>
//                         <tr className="bg-gray-100 text-gray-700">
//                         <th className="p-3 text-left">Product Name</th>
//                         <th className="p-3 text-left">Quantity</th>
//                         <th className="p-3 text-left">Date</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                         <td colSpan="3" className="text-gray-500 text-center py-4">
//                             No sales history yet.
//                         </td>
//                         </tr>
//                     </tbody>
//                     </table>
//                 </div>
//                 </section>
//             </div>
//             </main>
//     );
// }