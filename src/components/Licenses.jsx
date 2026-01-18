"use client"

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { LicenseCard } from "./LicenseCard";
import { AddLicenseCard } from "./AddLicenseCard";

export default function Licenses() {
  const [licName, setLicName] = useState("");
  const [authority, setAuthority] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");

  const { user } = useUser();

  useEffect(()=>{
    if(!email){
      setEmail(user?.primaryEmailAddress.emailAddress);
      return;
    }
  },[email]);

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

          <AddLicenseCard email={email}/>
          
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

