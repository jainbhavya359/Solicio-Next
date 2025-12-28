"use client";

import { motion } from "framer-motion";
import ServiceCard from "./ServiceCard";
import MotionWrapper from "./MotionWrapper";

export default function Services({service_data}) {
  return (
    <>

      {/* Decorative Gradient Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-20">

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
          {service_data.map((service, index) => (
            <MotionWrapper key={service.title} index={index}>
              <ServiceCard
                {...service}
                reverse={index % 2 !== 0}
              />
            </MotionWrapper>
          ))}
        </div>

      </div>
    </>
  );
}
