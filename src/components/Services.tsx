"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const MotionLink = motion(Link);

/* ---------------- TYPES ---------------- */

export type ServiceItem = {
  title: string;
  description: string;
  img: string;
  to?: string;
  accent?: string;
};

type ServicesProps = {
  service_data?: ServiceItem[];
};

/* ---------------- DEFAULT DATA ---------------- */

const defaultServices: ServiceItem[] = [
  {
    title: "Business Insights",
    description:
      "Daily insights that highlight what’s working, what’s not, and where you should focus next — without digging through reports.",
    img: "/insight_.png",
    to: "/businessInsights",
  },
  {
    title: "Inventory & Sales",
    description:
      "Track purchases, sales, stock levels, and profit movement in real time — no accounting knowledge required.",
    img: "/inventory_.png",
    to: "/inventory",
  },
  {
    title: "Loans & Credit Health",
    description:
      "Monitor active loans, understand credit score impact, and discover affordable funding options for your business.",
    img: "/credit-score_.png",
    to: "/loan",
  },
  {
    title: "Business Knowledge",
    description:
      "Clear explanations of business terms, decisions, and financial concepts — built for non-experts.",
    img: "/business_.png",
    to: "/business",
  },
  {
    title: "Local Business Network",
    description:
      "Connect with nearby wholesalers, suppliers, and partners you can trust and grow with.",
    img: "/business-network_.png",
    to: "/marketing",
  },
];

/* ---------------- COMPONENT ---------------- */

export default function Services({
  service_data = defaultServices,
}: ServicesProps): React.ReactElement {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50/40 via-white to-white" />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Everything you need to run your business
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            Solicio helps you manage stock, sales, money, and decisions —
            all in one simple platform built for daily use.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {service_data.map((item, i) => (
            <MotionLink
              key={item.title}
              href={item.to ?? "#"}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 group-hover:scale-110 transition">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={28}
                  height={28}
                />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {item.title}
              </h3>

              <p className="text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </MotionLink>
          ))}
        </div>
      </div>
    </section>
  );
}



