"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ServiceCard from "./ServiceCard";

export default function Services() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const Service_data = [
    {
      img: "./dictionary_.png",
      title: "Business Terminology",
      to: "/business",
      description:
        "Understand complex business jargon with crystal-clear explanations designed for real-world usage and confidence.",
      accent: "from-indigo-500 to-purple-500",
    },
    {
      img: "./credit-score_.png",
      title: "Loan & Credit Management",
      to: "/loan",
      description:
        "Track loans, improve credit scores, and access government-backed schemes and NGOs offering affordable funding.",
      accent: "from-emerald-500 to-teal-500",
    },
    {
      img: "./report_.png",
      title: "Operations Management",
      to: "/inventory",
      description:
        "Monitor inventory, sales performance, and workforce metrics—all from one powerful dashboard.",
      accent: "from-orange-500 to-pink-500",
    },
    {
      img: "./business-network_.png",
      title: "Local Wholesalers Network",
      description:
        "Find trusted wholesalers near you and build reliable supply chains without the headache.",
      accent: "from-blue-500 to-cyan-500",
    },
    {
      img: "./business_.png",
      title: "Marketing Solutions",
      to: "/marketing",
      description:
        "Launch digital campaigns, grow your brand presence, and collaborate with influencers that matter.",
      accent: "from-fuchsia-500 to-rose-500",
    },
    {
      img: "./certificate_.png",
      title: "Licenses & Certificates",
      to: "/licenses",
      description:
        "Never miss a compliance requirement—manage licenses and get personalized certification guidance.",
      accent: "from-yellow-500 to-amber-500",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">

      {/* Decorative Gradient Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            Your Partner in Business Growth
          </h2>
          <p className="mt-6 text-lg text-slate-300 max-w-3xl mx-auto">
            Built for ambitious entrepreneurs. We simplify finances, operations, compliance,
            and growth—so you can focus on building something legendary.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-12">
          {Service_data.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ServiceCard
                img={service.img}
                title={service.title}
                to={service.to}
                description={service.description}
                accent={service.accent}
                reverse={index % 2 !== 0}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
