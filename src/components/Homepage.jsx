"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Services from "@/src/components/Services";
import Tips from "@/src/components/Tips";
import axios from "axios";
import { useState } from "react";

export default function Homepage({service_data, isAuthenticated}) {

  const [logged, setLogged] = useState(isAuthenticated);

  async function logout(){
    try{
      const response = await axios.get("/api/logout");
      console.log(response);
      setLogged(false);
    }catch(error){
      console.log("Error occured during logout", error);
    }
  }

  return (
    <>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero_image2.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/70" />

        {/* Gradient Blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 blur-3xl rounded-full" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl text-center px-6"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            Bring Your Business Online
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-300">
            Tools, insights, and connections designed for MSMEs to grow faster,
            smarter, and stronger.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            {logged ? (
              <button
                onClick={() =>
                  logout()
                }
                className="px-8 py-4 rounded-full font-bold text-black
                bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400
                hover:opacity-90 transition shadow-lg"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/signup"
                className="px-8 py-4 rounded-full font-bold text-black
                bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400
                hover:opacity-90 transition shadow-lg"
              >
                Sign Up →
              </Link>
            )}

            <Link
              href="/contact"
              className="px-8 py-4 rounded-full font-semibold
              border border-white/20 hover:bg-white/10 transition"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* TAGLINE */}
      <section className="py-28 bg-gradient-to-b from-black to-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            src="https://gorgeous-gumption-a148f7.netlify.app/pakshi.jpeg"
            alt="Tagline"
            className="rounded-3xl shadow-2xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-extrabold mb-6">
              छोटे कदम, <span className="text-indigo-400">बड़ी उड़ान</span>
            </h2>
            <p className="text-xl text-slate-300 italic">
              (Chhote Kadam, Badi Udaan) — Small Steps, Big Flight
            </p>
          </motion.div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="py-28 bg-black">
        <h3 className="text-4xl font-extrabold text-center mb-16">
          Success Stories
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 max-w-7xl mx-auto">
          {[
            {
              name: "Maria Lopez",
              text: "My business grew faster than I ever imagined.",
              image: "/story1.jpg",
            },
            {
              name: "Gurpreet Singh",
              text: "Our reach expanded beyond local markets.",
              image: "/story2.jpg",
            },
            {
              name: "Ahmed Khan",
              text: "Digital transformation made simple.",
              image: "/story3.jpg",
            },
          ].map((story, i) => (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl" key={i}>
              <Image
                src={story.image}
                alt={story.name}
                width={112}
                height={112}
                className="h-56 w-full object-cover"
              />
              <div className="p-6">
                <p className="italic text-slate-300 mb-4">
                  “{story.text}”
                </p>
                <p className="font-bold">{story.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="process" className="py-28 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold mb-14">How it works</h2>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              ["Create profile", "Tell us about your business & goals"],
              ["Pick tools", "Enable loan, GST, vendor & ops modules"],
              ["Act & grow", "Insights, reminders & connections"],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
              >
                <span className="text-sm text-indigo-400 font-bold">
                  STEP {i + 1}
                </span>
                <h3 className="mt-3 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-3 gap-8 text-center">
          {[
            ["10k+", "MSMEs reached"],
            ["7%", "Cost savings"],
            ["₹12L", "Late fees avoided"],
          ].map(([value, label], i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-xl"
            >
              <div className="text-4xl font-extrabold text-indigo-400">
                {value}
              </div>
              <p className="mt-2 text-slate-300">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES + TIPS */}
      <Services service_data={service_data}/>
      <Tips />
    </>
  );
}
