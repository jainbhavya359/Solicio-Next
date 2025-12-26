import React, { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";

export default function StockReport() {
  const { user } = useAuth0();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/getstock`
        );
        if (!response.ok) throw new Error("Network error");
        const json = await response.json();
        setData(json);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  /* Aggregate stock safely */
  const aggregatedStock = useMemo(() => {
    if (!data || !user) return [];

    return data
      .filter((item) => item.email === user.email)
      .reduce((acc, curr) => {
        const existing = acc.find(
          (item) =>
            item.product_name === curr.product_name &&
            item.price === curr.price &&
            item.date === curr.date
        );

        if (existing) {
          existing.quantity += curr.quantity;
        } else {
          acc.push({ ...curr });
        }
        return acc;
      }, []);
  }, [data, user]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
    >
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        Current Stock Report
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-400">Error loading stock data.</p>
      ) : aggregatedStock.length === 0 ? (
        <p className="text-slate-400">
          No stock data found. Add inventory to view your report.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-white/10 text-slate-300">
              <tr>
                <th className="py-3 text-left">Product</th>
                <th className="py-3 text-left">Quantity</th>
                <th className="py-3 text-left">Price (₹)</th>
                <th className="py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {aggregatedStock.map((stock, index) => (
                <tr
                  key={index}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-4">{stock.product_name}</td>
                  <td className="py-4 font-semibold">{stock.quantity}</td>
                  <td className="py-4">
                    ₹{stock.price.toLocaleString()}
                  </td>
                  <td className="py-4 text-slate-400">
                    {new Date(stock.date).toISOString().split("T")[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.section>
  );
}



// import React, { use, useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// export default function StockReport (){
//     const { user} = useAuth0();
    
//     const [ error, setError ] = useState(false);
//     const [ loading, setLoading ] = useState(true);
//     const [ data, setData ] = useState([]); 

//     const fetchStock = async () => {
//         try{
//             const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getstock`);
//             if(!response.ok){
//                 throw new error("Network Error");
//             }else{
//                 const json = await response.json();
//                 setData(json);
//             }
//         }catch(err){
//             setError(true);
//         }finally{
//             setLoading(false);
//         }
//     }

//     useEffect(()=>{
//         fetchStock();
//     },[]);

//     console.log(data);
//     let new_data = [];

//     const fetchNewData = () => {
//         new_data = data.reduce((acc, curr) => {
//             const existing = acc.find(
//             item =>
//                 item.product_name === curr.product_name &&
//                 item.price === curr.price &&
//                 item.date === curr.date &&
//                 item.email === curr.email
//             );

//             if (existing) {
//             existing.quantity += curr.quantity;
//             } else {
//             acc.push({ ...curr });
//             }
//             return acc;
//         }, []);
//     };


//     fetchNewData();


//     return (
//         <section className="bg-white rounded-2xl shadow-lg p-8">
//             <h2 className="text-2xl font-bold text-emerald-600 border-b pb-4 mb-6">
//                 Current Stock Report
//             </h2>
//             <div id="stock-report" className="text-gray-500">
//                 {loading ? <p>Loading..</p> :
//                     error ? <p>Error Occured</p> :
//                     !data ? <p>Add Stock to see it in your Inventory</p> :
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
//                             <thead className="bg-indigo-500 text-white">
//                             <tr>
//                                 <th className="py-3 px-6 text-left">Product Name</th>
//                                 <th className="py-3 px-6 text-left">Quantity</th>
//                                 <th className="py-3 px-6 text-left">Price (₹)</th>
//                                 <th className="py-3 px-6 text-left">Date</th>
//                             </tr>
//                             </thead>
//                             <tbody>
//                             {new_data.map((stock, index) => (
//                                 (stock.email == user.email ? <tr
//                                 key={stock.id}
//                                 className={`${
//                                     index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                                 } hover:bg-indigo-50 transition`}
//                                 >
//                                 <td className="py-3 px-6">{stock.product_name}</td>
//                                 <td className="py-3 px-6">{stock.quantity}</td>
//                                 <td className="py-3 px-6 font-medium text-gray-800">
//                                     ₹{stock.price.toLocaleString()}
//                                 </td>
//                                 <td className="py-3 px-6 text-gray-600">{new Date(stock.date).toISOString().split('T')[0]}</td>
//                                 </tr> : null)
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 }
//             </div>
//         </section>
//     );
// }