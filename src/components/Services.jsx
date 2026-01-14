"use client";

import { motion } from "framer-motion";
import ServiceCard from "./ServiceCard";
import MotionWrapper from "./MotionWrapper";

export default function Services({ service_data }) {
  return (
    <>
      {/* Subtle animated blobs (lighter, friendlier) */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/25 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-1/2 -right-32 w-80 h-80 bg-pink-500/25 rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-6 py-28">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Everything you need to run your business
          </h2>

          <p className="mt-6 text-lg text-slate-300 max-w-3xl mx-auto">
            Solicio is built for daily use — track stock, record sales,
            understand money flow, and make better decisions without stress.
          </p>

          <p className="mt-3 text-slate-400 italic">
            Simple enough for today. Powerful enough for growth.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid gap-14">
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
