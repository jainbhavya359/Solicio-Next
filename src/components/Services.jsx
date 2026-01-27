"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const MotionLink = motion(Link);

const features = [
  {
    title: "Business Insights",
    description:
      "Daily insights that highlight what’s working, what’s not, and where you should focus next — without digging through reports.",
    icon: "/insight_.png",
    link: "/businessInsights",
  },
  {
    title: "Inventory & Sales",
    description:
      "Track purchases, sales, stock levels, and profit movement in real time — no accounting knowledge required.",
    icon: "/inventory_.png",
    link: "/inventory",
  },
  {
    title: "Loans & Credit Health",
    description:
      "Monitor active loans, understand credit score impact, and discover affordable funding options for your business.",
    icon: "/credit-score_.png",
    link: "/loan",
  },
  {
    title: "Business Knowledge",
    description:
      "Clear explanations of business terms, decisions, and financial concepts — built for non-experts.",
    icon: "/business_.png",
    link: "/business",
  },
  {
    title: "Local Business Network",
    description:
      "Connect with nearby wholesalers, suppliers, and partners you can trust and grow with.",
    icon: "/business-network_.png",
    link: "/marketing",
  },
];

export default function Services() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50/40 via-white to-white" />

      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
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

          <p className="mt-3 text-slate-500 italic">
            Simple enough for today. Powerful enough for growth.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <MotionLink
              key={item.title}
              href={item.link}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="
                group relative rounded-2xl border border-slate-200
                bg-white p-8 shadow-sm
                hover:shadow-xl hover:border-emerald-300
                transition-all
              "
            >
              {/* Icon */}
              <div
                className="
                  mb-6 inline-flex h-14 w-14 items-center justify-center
                  rounded-xl bg-emerald-100
                  group-hover:scale-110 transition
                "
              >
                <Image
                  src={item.icon}
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

              {/* Hover accent */}
              <span
                className="
                  absolute bottom-0 left-0 h-1 w-0
                  bg-emerald-500 rounded-b-2xl
                  group-hover:w-full transition-all
                "
              />
            </MotionLink>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/dashboard"
            className="
              inline-flex items-center gap-2
              px-8 py-4 rounded-xl
              bg-emerald-600 text-white
              font-semibold text-lg
              hover:bg-emerald-700
              transition
            "
          >
            Get started free →
          </Link>

          <p className="mt-4 text-sm text-slate-500">
            No credit card required · Setup takes minutes
          </p>
        </div>
      </div>
    </section>
  );
}





// "use client";

// import { motion } from "framer-motion";
// import ServiceCard from "./ServiceCard";
// import MotionWrapper from "./MotionWrapper";

// export default function Services({service_data}) {
//   return (
//     <>

//       {/* Decorative Gradient Blobs */}
//       <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
//       <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl" />

//       <div className="relative max-w-7xl mx-auto px-6 py-20">

//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//           className="text-center mb-20"
//         >
//           <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
//             Your Partner in Business Growth
//           </h2>
//           <p className="mt-6 text-lg text-slate-300 max-w-3xl mx-auto">
//             Built for ambitious entrepreneurs. We simplify finances, operations, compliance,
//             and growth—so you can focus on building something legendary.
//           </p>
//         </motion.div>

//         {/* Services Grid */}
//         <div className="grid gap-12">
//           {service_data.map((service, index) => (
//             <MotionWrapper key={service.title} index={index}>
//               <ServiceCard
//                 {...service}
//                 reverse={index % 2 !== 0}
//               />
//             </MotionWrapper>
//           ))}
//         </div>

//       </div>
//     </>
//   );
// }
