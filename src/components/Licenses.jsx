import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Licenses() {
  const [licName, setLicName] = useState("");
  const [authority, setAuthority] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");

  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email);
    }
    window.scrollTo(0, 0);
  }, [isAuthenticated, user]);

  const onHandleClick = async (event) => {
    event.preventDefault();
    if (!licName || !authority) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/licenses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ licName, authority, date, email }),
        }
      );

      if (response.ok) {
        setLicName("");
        setAuthority("");
        setDate("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28">

      {/* Ambient blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-emerald-600/30 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-24">

        {/* HEADER */}
        <div className="max-w-3xl">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            Licenses & Compliance
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Keep track of all your business licenses, certifications, and
            compliance requirements in one place.
          </p>
        </div>

        {/* MANAGE LICENSES */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Manage Your Licenses
          </h2>

          <p className="text-slate-300 mb-8">
            Add and manage your existing business licenses to stay compliant
            and organized.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="text-sm text-slate-300">License Name</label>
              <input
                type="text"
                value={licName}
                onChange={(e) => setLicName(e.target.value)}
                placeholder="e.g., GST Registration"
                className="mt-2 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Issuing Authority</label>
              <input
                type="text"
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                placeholder="e.g., Ministry of MSME"
                className="mt-2 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Expiry Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <button
            onClick={onHandleClick}
            className="px-8 py-3 rounded-full font-bold text-black
            bg-gradient-to-r from-indigo-500 to-pink-500
            hover:opacity-90 transition shadow-lg"
          >
            + Add License
          </button>
        </div>

        {/* REQUIRED LICENSES */}
        <div className="space-y-10">
          <h2 className="text-4xl font-extrabold">
            Licenses You May Need
          </h2>

          <p className="text-slate-300 max-w-3xl">
            Based on your business type and location, these are some commonly
            required licenses and certifications for MSMEs in India.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Udyam Registration",
                desc:
                  "Official MSME registration that makes your business eligible for government schemes, subsidies, and bank benefits.",
                link: "https://udyamregistration.gov.in/",
              },
              {
                title: "GST Registration",
                desc:
                  "Mandatory for businesses above ₹40 lakh turnover or for inter-state trade and tax compliance.",
                link: "https://www.gst.gov.in/",
              },
              {
                title: "Trade License",
                desc:
                  "Issued by the municipal corporation to legally carry out business activities at a specific location.",
                link: null,
              },
              {
                title: "Shop & Establishment Act License",
                desc:
                  "Regulates working conditions, hours, and wages for commercial establishments.",
                link: null,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
              >
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-300 mb-4">{item.desc}</p>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline"
                  >
                    Official Website →
                  </a>
                ) : (
                  <span className="text-slate-400">
                    Varies by location
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}




// import React, { useState, useEffect } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

// export default function Licenses() {

//     const [ licName, setLicName ] = useState("");
//     const [ authority, setAuthority ] = useState("");
//     const [ date, setDate ] = useState(new Date());
//     const [ email, setEmail ] = useState("");

//     const { isAuthenticated, user } = useAuth0();

//     useEffect(()=>{
//         if(isAuthenticated){
//             setEmail(user.email);
//         }
//     },[]);

//     const onHandleClick = async (event) => {
//         event.preventDefault();

//         if(licName == "" || authority == ""){
//             return;
//         }

//         try{
//             const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/licenses`,{
//                 headers: { 'Content-Type': 'application/json' },
//                 method: "POST",
//                 body: JSON.stringify({licName, authority, date, email})
//             });

//             if(response.ok){
//                 setAuthority("");
//                 setLicName("");
//             }else{
//                 console.log("Data not Sent");
//             }
//         }catch(err){
//             console.log(err);
//         }
//     }

//   return (
//     <div className="container mx-auto px-6 py-10 space-y-10 mt-10">
//       {/* Manage Licenses Section */}
//       <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
//         <h2 className="text-2xl font-bold text-indigo-600 mb-3">
//           Manage Your Licenses
//         </h2>
//         <p className="text-gray-600 mb-6">
//           Keep all your business licenses and certifications organized in one
//           place. Add a new license and keep track of its details.
//         </p>

//         {/* Input Form */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <div className="flex flex-col">
//             <label
//               htmlFor="licenseName"
//               className="text-sm font-medium text-gray-700 mb-1"
//             >
//               License Name
//             </label>
//             <input
//               type="text"
//               id="licenseName"
//               onChange={(e)=>{setLicName(e.target.value)}}
//               placeholder="e.g., GST Registration"
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label
//               htmlFor="issuingAuthority"
//               className="text-sm font-medium text-gray-700 mb-1"
//             >
//               Issuing Authority
//             </label>
//             <input
//               type="text"
//               id="issuingAuthority"
//               onChange={(e)=>{setAuthority(e.target.value)}}
//               placeholder="e.g., Ministry of MSME"
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label
//               htmlFor="expiryDate"
//               className="text-sm font-medium text-gray-700 mb-1"
//             >
//               Expiry Date
//             </label>
//             <input
//               type="date"
//               id="expiryDate"
//               onChange={(e)=>{setDate(e.target.value)}}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//             />
//           </div>
//         </div>

//         <button className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition" onClick={onHandleClick}>
//           Add License
//         </button>

//         <div id="licenseList" className="mt-6 space-y-3"></div>
//         <div
//           id="errorMessage"
//           className="hidden text-red-500 font-medium mt-4"
//         ></div>
//       </div>

//       {/* Required Licenses Section */}
//       <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
//         <h2 className="text-2xl font-bold text-emerald-600 mb-3">
//           Licenses &amp; Certifications You May Need
//         </h2>
//         <p className="text-gray-600 mb-6">
//           Based on your business profile, here are some common licenses and
//           certifications you may need. <br />
//           <em className="text-sm text-gray-500">
//             A complete, personalized list would be available after you provide
//             your business details during signup.
//           </em>
//         </p>

//         <div className="grid gap-6 md:grid-cols-2">
//           <div className="p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Udyam Registration
//             </h3>
//             <p className="text-gray-600 mt-2 mb-3">
//               This is a key registration for MSMEs with the Government of India.
//               It makes your business eligible for various government schemes,
//               subsidies, and bank benefits.
//             </p>
//             <a
//               href="https://udyamregistration.gov.in/"
//               target="_blank"
//               rel="noreferrer"
//               className="text-indigo-600 font-medium hover:underline"
//             >
//               Official Website →
//             </a>
//           </div>

//           <div className="p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
//             <h3 className="text-lg font-semibold text-gray-800">
//               GST Registration
//             </h3>
//             <p className="text-gray-600 mt-2 mb-3">
//               Required for any business with a turnover above a certain
//               threshold (currently ₹40 lakh) or for inter-state sales. This is
//               essential for tax compliance and trade.
//             </p>
//             <a
//               href="https://www.gst.gov.in/"
//               target="_blank"
//               rel="noreferrer"
//               className="text-indigo-600 font-medium hover:underline"
//             >
//               Official Website →
//             </a>
//           </div>

//           <div className="p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Trade License
//             </h3>
//             <p className="text-gray-600 mt-2 mb-3">
//               Issued by the Municipal Corporation, this license allows you to
//               carry out a specific trade or business at a particular location.
//               It is mandatory for most businesses.
//             </p>
//             <span className="text-gray-500">Varies by municipality</span>
//           </div>

//           <div className="p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Shop &amp; Establishment Act License
//             </h3>
//             <p className="text-gray-600 mt-2 mb-3">
//               This license regulates working conditions, such as hours of work,
//               weekly holidays, and wages, for shops and commercial
//               establishments. It is issued by the state government.
//             </p>
//             <span className="text-gray-500">Varies by state</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
