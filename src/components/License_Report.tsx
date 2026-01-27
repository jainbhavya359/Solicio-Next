"use client"

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { LicenseCard } from "./LicenseCard";

export default function LicenseReport() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLicenses = async () => {
    try {
      const res = await axios.get(`/api/licenses?email=${email}`);
      setLicenses(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) fetchLicenses();
  }, [email]);

  const deleteLicense = async (id: string) => {
    await axios.delete(`/api/licenses?id=${id}`);
    fetchLicenses();
  };

  if (loading) {
    return (
      <p className="text-sm text-stone-400">
        Loading licenses…
      </p>
    );
  }

  if (licenses.length === 0) {
    return (
      <p className="text-sm text-stone-400">
        No licenses added yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 my-6">
      {licenses.map((lic) => (
        <LicenseCard
          key={lic._id}
          license={lic}
          onDelete={deleteLicense}
        />
      ))}
    </div>
  );
}



// "use client"

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useUser } from "@clerk/nextjs";
// import axios from "axios";

// export default function License_Report() {
//   const { user } = useUser();

//   const [data, setData] = useState([]);
//   const [error, setError] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [reload, setReload] = useState(false);

//   const email = user?.primaryEmailAddress.emailAddress;

//   useEffect(() => {
//     if(!email) return;

//     const fetchData = async () => {
//       try {
//         const response = await axios.get("/api/licenses");
//         if (!response) throw new Error("Network issue");
//         const json = await response.json();
//         setData(json);
//       } catch {
//         setError(true);
//       } finally {
//         setLoading(false);
//         setReload(false);
//       }
//     };

//     fetchData();
//   }, [reload, email]);

//   const onHandleClick = async (id) => {
//     try {
//       await fetch(
//         `${process.env.REACT_APP_BACKEND_URL}/api/deletelicense/${id}`,
//         { method: "DELETE" }
//       );
//       setReload(true);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const userLicenses = data.filter(
//     (lic) => lic.email === user?.email
//   );

//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 40 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       viewport={{ once: true }}
//       className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
//     >
//       <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
//         Your Licenses
//       </h2>

//       {loading ? (
//         <div className="flex justify-center py-10">
//           <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
//         </div>
//       ) : error ? (
//         <p className="text-red-400">Error loading licenses.</p>
//       ) : userLicenses.length === 0 ? (
//         <p className="text-slate-400">
//           No licenses found. Add licenses to track compliance.
//         </p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="border-b border-white/10 text-slate-300">
//               <tr>
//                 <th className="py-3 text-left">License</th>
//                 <th className="py-3 text-left">Authority</th>
//                 <th className="py-3 text-left">Date</th>
//                 <th className="py-3 text-left">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {userLicenses.map((lic, index) => (
//                 <tr
//                   key={lic.id}
//                   className="border-b border-white/5 hover:bg-white/5 transition"
//                 >
//                   <td className="py-4">{lic.license_name}</td>
//                   <td className="py-4">{lic.authority}</td>
//                   <td className="py-4 text-slate-400">
//                     {new Date(lic.date).toISOString().split("T")[0]}
//                   </td>
//                   <td className="py-4">
//                     <button
//                       onClick={() => onHandleClick(lic.id)}
//                       className="px-4 py-1 rounded-full border border-red-500 text-red-400 hover:bg-red-500/10 transition"
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </motion.section>
//   );
// }



// import React, { useState, useEffect, use} from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// export default function License_Report(){

//     const [ data, setData ] = useState([]);
//     const [ error, setError ] = useState("");
//     const [ loading, setLoading ] = useState(true);
//     const [ reload, setReloading ] = useState(false);
//     const { user, isAuthenticated } = useAuth0();

//     const fetchData = async ()=> {
//         try{
//             const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getlicenses`);
//             if(!response.ok){
//                 throw new Error("Network Issue");
//             }else{
//                 const d = await response.json();
//                 setData(d);
//             }
//         }catch(err){
//             console.log(err);
//             setError(err);
//         }finally{
//             setLoading(false);
//         }
//     }

//     useEffect(()=>{
//         fetchData();

//         window.scrollTo(0, 0);
//     },[]);

//     useEffect(()=>{
//         fetchData();
//     },[reload]);

//     const onHandleClick = (id) => {
//         const DeleteItem = async () => {
//             try{
//                 await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deletelicense/${id}`, {
//                     method: "DELETE",
//                 });
//                 setReloading(true);
//             }catch (err){
//                 console.log("Error Occured", err);
//             }
//         }

//         DeleteItem();
//     }

//     console.log(data);

//     return(
//         <>
//             <div className="flex flex-col justify-start gap-4 rounded-xl shadow-lg p-6 m-5 mt-10 pt-10 bg-white border border-gray-100">
//             <h2 className="text-2xl font-bold border-b pb-3 pt-3 text-indigo-600">
//                 Your Licenses
//             </h2>

//             {loading ? (
//                 <div className="flex justify-center items-center py-10">
//                 <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//                 </div>
//             ) : error ? (
//                 <p className="text-red-500 font-medium">Error: {error}</p>
//             ) : data && data.length > 0 ? (
//                 <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
//                     <thead className="bg-indigo-500 text-white">
//                     <tr>
//                         <th className="py-3 px-6 text-left">License Name</th>
//                         <th className="py-3 px-6 text-left">Issuing Authority</th>
//                         <th className="py-3 px-6 text-left">Date</th>
//                         <th className="py-3 px-6 text-left">Action</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {data.map((lic, index) => (
//                         (lic.email == user.email ? <tr
//                         key={lic.id}
//                         className={`${
//                             index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                         } hover:bg-indigo-50 transition`}
//                         >
//                         <td className="py-3 px-6">{lic.license_name}</td>
//                         <td className="py-3 px-6">{lic.authority}</td>
//                         <td className="py-3 px-6 text-gray-600">{new Date(lic.date).toISOString().split('T')[0]}</td>
//                         <td className="py-2 px-4 border">
//                             <button
//                             onClick={() => onHandleClick(lic.id)}
//                             className="bg-white text-red-500 px-3 py-1 rounded-2xl border border-red-500 hover:bg-gray-50"
//                             >
//                             Remove
//                             </button>
//                         </td>
//                         </tr> : null)
//                     ))}
//                     </tbody>
//                 </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No licenses found.</p>
//             )}
//             </div>
//         </>
//     );
// }