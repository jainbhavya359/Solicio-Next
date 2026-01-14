"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  SignedIn,
  SignedOut,
  SignUpButton,
  SignOutButton,
} from "@clerk/nextjs";
import {
  ArchiveBoxIcon,
  ChartBarIcon,
  BanknotesIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Tips from "./Tips";

export default function Homepage() {
const MotionLink = motion(Link);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0b0f1a]">
        {/* Animated gradient blobs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-pink-500/30 blur-3xl rounded-full"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/3 -right-40 w-[420px] h-[420px] bg-indigo-500/30 blur-3xl rounded-full"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl text-center px-6"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Run Your Business
            <br />
            <span className="text-white">Smarter. Faster. Stress-Free.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Solicio helps small businesses manage stock, sales, money & decisions
            — all in one powerful, easy-to-use platform.
          </p>

          <p className="mt-3 text-slate-400 italic">
            No confusion. No missed entries. Bas clear business.
          </p>

          <div className="my-10 py-10 flex flex-wrap gap-5 justify-center">
            <SignedOut>
              <SignUpButton>
                <button className="px-8 py-4 rounded-xl font-bold text-black bg-gradient-to-r from-indigo-400 to-pink-400 shadow-lg shadow-pink-500/30 hover:scale-105 transition">
                  Get Started Free →
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <SignOutButton>
                <button className="px-8 py-4 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 transition">
                  Logout
                </button>
              </SignOutButton>
            </SignedIn>

            <Link
              href="/services"
              className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/10 transition"
            >
              See Features
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <span>✅ No credit card required</span>
            <span>🔒 Your data never shared</span>
            <span>🇮🇳 Built for Indian businesses</span>
          </div>

          <p className="mt-3 text-slate-400 italic text-sm">
            Inspired by Tally & Khatabook — without the complexity.
          </p>

        </motion.div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="py-20 bg-gradient-to-b from-[#0b0f1a] to-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">

          {[
            {
              icon: ArchiveBoxIcon,
              label: "Inventory Tracking",
              to: "/inventory",
              color: "text-indigo-400",
            },
            {
              icon: ChartBarIcon,
              label: "Live Business Reports",
              to: "/businessInsights",
              color: "text-emerald-400",
            },
            {
              icon: BanknotesIcon,
              label: "Cashflow Control",
              to: "/loan",
              color: "text-amber-400",
            },
            {
              icon: ShieldCheckIcon,
              label: "Secure & Private",
              to: "/privacy",
              color: "text-pink-400",
            },
          ].map(({ icon: Icon, label, to, color }, i) => (
            <MotionLink
              key={i}
              href={to}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 220, damping: 15 }}
              className="group relative backdrop-blur-xl bg-white/5 
                        border border-white/10 rounded-2xl p-6 shadow-lg
                        hover:border-white/20"
            >
              {/* Glow layer */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 
                            group-hover:opacity-100 transition
                            bg-gradient-to-br from-indigo-500/20 to-pink-500/20`}
              />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`${color} mb-4`}
                >
                  <Icon className="w-10 h-10" />
                </motion.div>

                <p className="font-semibold text-slate-200 group-hover:text-white">
                  {label}
                </p>
              </div>
            </MotionLink>
          ))}

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-28 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-16">
            Everything your business needs — and more
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Smart Inventory",
                desc: "Track stock in real-time with purchase & sale history.",
                color: "from-emerald-400 to-teal-400",
              },
              {
                title: "Sales & Ledger",
                desc: "Clear records just like Tally — but simpler.",
                color: "from-indigo-400 to-purple-400",
              },
              {
                title: "Business Insights",
                desc: "Know profit, loss & trends at a glance.",
                color: "from-pink-400 to-orange-400",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{
                  y: -8,
                  scale: 1.04,
                  boxShadow: "0 0 40px rgba(99,102,241,0.35)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="group relative backdrop-blur-xl bg-white/5 
                          border border-white/10 rounded-3xl p-8 shadow-xl"
              >
                {/* Glow */}
                <div
                  className={`absolute inset-0 rounded-3xl 
                              bg-gradient-to-br ${f.color} opacity-0 
                              group-hover:opacity-15 transition`}
                />

                <div className="relative z-10">
                  <h3 className="text-xl font-bold">{f.title}</h3>
                  <p className="mt-3 text-slate-300">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= METRICS ================= */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-3 gap-8 text-center">
          {[
            ["⏱️", "Save 5+ hrs/week"],
            ["📉", "Reduce losses"],
            ["📈", "Grow confidently"],
          ].map(([icon, text], i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-xl"
            >
              <div className="text-4xl mb-3">{icon}</div>
              <p className="text-xl font-semibold text-slate-200">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 bg-gradient-to-r from-indigo-600 to-pink-600 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white">
          Ready to run your business the smart way?
        </h2>
        <p className="mt-4 text-lg text-white/90">
          Join Solicio and take control today.
        </p>

        <div className="mt-8">
          <SignUpButton>
            <motion.button
              animate={{
                boxShadow: [
                  "0 0 0px rgba(255,255,255,0.4)",
                  "0 0 30px rgba(255,255,255,0.6)",
                  "0 0 0px rgba(255,255,255,0.4)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="px-10 py-4 rounded-xl font-bold text-black bg-white 
                        hover:scale-105 transition shadow-xl"
            >
              Start Free Now →
            </motion.button>

          </SignUpButton>
        </div>
        <Tips />
      </section>
    </>
  );
}


// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import Services from "@/src/components/Services";
// import Tips from "@/src/components/Tips";
// import { SignedIn, SignedOut, SignOutButton, SignUp, SignUpButton, useUser } from "@clerk/nextjs";

// export default function Homepage({service_data}) {

//   const { isSignedIn } = useUser();

//   return (
//     <>

//       {/* HERO */}
//       <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

//         {/* Background */}
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: "url('/hero_image2.jpg')" }}
//         />
//         <div className="absolute inset-0 bg-black/70" />

//         {/* Gradient Blobs */}
//         <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full" />
//         <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 blur-3xl rounded-full" />

//         {/* Content */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="relative z-10 max-w-4xl text-center px-6"
//         >
//           <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
//             Manage Your Business Online
//           </h1>

//           <p className="mt-6 text-lg md:text-xl text-slate-300">
//             Tools, insights, and connections designed for MSMEs to grow faster,
//             smarter, and stronger.
//           </p>

//           <div className="mt-10 flex flex-wrap gap-4 justify-center">
//             <SignedIn>
//               <SignOutButton>  
//                 <button
//                   className="px-8 py-4 rounded-full font-bold text-black
//                   bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400
//                   hover:opacity-90 transition shadow-lg"
//                   >
//                   Logout →
//                 </button>
//               </SignOutButton>
//             </SignedIn>
//             <SignedOut>
//               <SignUpButton>
//                 <button
//                   className="px-8 py-4 rounded-full font-bold text-black
//                   bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400
//                   hover:opacity-90 transition shadow-lg"
//                   >
//                   Sign Up →
//                 </button>
//               </SignUpButton>
//             </SignedOut>
            

//             <Link
//               href="/contact"
//               className="px-8 py-4 rounded-full font-semibold
//               border border-white/20 hover:bg-white/10 transition"
//             >
//               Learn More
//             </Link>
//           </div>
//         </motion.div>
//       </section>

//       {/* TAGLINE */}
//       <section className="py-28 bg-gradient-to-b from-black to-slate-900">
//         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

//           <motion.img
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             src="https://gorgeous-gumption-a148f7.netlify.app/pakshi.jpeg"
//             alt="Tagline"
//             className="rounded-3xl shadow-2xl"
//           />

//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//           >
//             <h2 className="text-5xl font-extrabold mb-6">
//               छोटे कदम, <span className="text-indigo-400">बड़ी उड़ान</span>
//             </h2>
//             <p className="text-xl text-slate-300 italic">
//               (Chhote Kadam, Badi Udaan) — Small Steps, Big Flight
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* SUCCESS STORIES */}
//       <section className="py-28 bg-black">
//         <h3 className="text-4xl font-extrabold text-center mb-16">
//           Success Stories
//         </h3>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 max-w-7xl mx-auto">
//           {[
//             {
//               name: "Maria Lopez",
//               text: "My business grew faster than I ever imagined.",
//               image: "/story1.jpg",
//             },
//             {
//               name: "Gurpreet Singh",
//               text: "Our reach expanded beyond local markets.",
//               image: "/story2.jpg",
//             },
//             {
//               name: "Ahmed Khan",
//               text: "Digital transformation made simple.",
//               image: "/story3.jpg",
//             },
//           ].map((story, i) => (
//             <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl" key={i}>
//               <Image
//                 src={story.image}
//                 alt={story.name}
//                 width={112}
//                 height={112}
//                 className="h-56 w-full object-cover"
//               />
//               <div className="p-6">
//                 <p className="italic text-slate-300 mb-4">
//                   “{story.text}”
//                 </p>
//                 <p className="font-bold">{story.name}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section id="process" className="py-28 bg-slate-900">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-4xl font-extrabold mb-14">How it works</h2>

//           <div className="grid sm:grid-cols-3 gap-8">
//             {[
//               ["Create profile", "Tell us about your business & goals"],
//               ["Pick tools", "Enable loan, GST, vendor & ops modules"],
//               ["Act & grow", "Insights, reminders & connections"],
//             ].map(([title, desc], i) => (
//               <div
//                 key={i}
//                 className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
//               >
//                 <span className="text-sm text-indigo-400 font-bold">
//                   STEP {i + 1}
//                 </span>
//                 <h3 className="mt-3 text-xl font-bold">{title}</h3>
//                 <p className="mt-2 text-slate-300">{desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* METRICS */}
//       <section className="py-24 bg-black">
//         <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-3 gap-8 text-center">
//           {[
//             ["10k+", "MSMEs reached"],
//             ["7%", "Cost savings"],
//             ["₹12L", "Late fees avoided"],
//           ].map(([value, label], i) => (
//             <div
//               key={i}
//               className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-xl"
//             >
//               <div className="text-4xl font-extrabold text-indigo-400">
//                 {value}
//               </div>
//               <p className="mt-2 text-slate-300">{label}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* SERVICES + TIPS */}
//       <Services service_data={service_data} isSignedIn={isSignedIn}/>
//       <Tips/>
//     </>
//   );
// }
