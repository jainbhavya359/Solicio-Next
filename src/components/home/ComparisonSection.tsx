"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const rows = [
  ["Easy to use interface", true, "Complex"],
  ["Setup time", "5 minutes", "Days / Weeks"],
  ["Real-time stock tracking", true, "Manual updates"],
  ["Smart business insights", true, false],
  ["Profit/Loss at a glance", true, "Reports only"],
  ["Low stock alerts", true, "Basic"],
  ["Trend analysis", true, false],
  ["Mobile friendly", true, "Limited"],
  ["Learning curve", "None", "Steep"],
  ["Pricing", "Affordable", "Expensive"],
];

export function ComparisonSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl lg:text-5xl font-semibold text-slate-900 mb-4">
            Solicio vs <span className="text-slate-400">Others</span>
          </h2>
          <p className="text-lg text-slate-600">
            See why thousands of small businesses are switching to Solicio
          </p>
        </motion.div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-3 px-8 py-5 border-b border-slate-200 text-sm font-medium text-slate-600">
            <div>Feature</div>
            <div className="flex justify-center">
              <span className="px-4 py-1 rounded-full bg-emerald-600 text-white text-sm font-semibold">
                Solicio
              </span>
            </div>
            <div className="flex justify-center">
              <span className="px-4 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold">
                Tally / Khatabook
              </span>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <motion.div
              key={row[0] as string}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-3 px-8 py-5 border-b last:border-0 border-slate-100 text-slate-700"
            >
              {/* Feature */}
              <div className="font-medium">{row[0]}</div>

              {/* Solicio */}
              <div className="flex justify-center">
                {row[1] === true ? (
                  <span className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </span>
                ) : (
                  <span className="text-emerald-600 font-medium">
                    {row[1]}
                  </span>
                )}
              </div>

              {/* Others */}
              <div className="flex justify-center">
                {row[2] === false ? (
                  <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-slate-400" />
                  </span>
                ) : (
                  <span className="text-slate-600">{row[2]}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
