"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-slate-400">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        {/* TOP GRID */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          {/* BRAND */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-xl font-bold text-white">
                Solicio
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-sm mb-6">
              Helping small businesses manage stock, sales,
              money & decisions — all in one powerful, easy-to-use platform.
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                hello@solicio.com
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                Mumbai, India
              </li>
            </ul>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/integrations" className="hover:text-white transition">Integrations</Link></li>
              <li><Link href="/api" className="hover:text-white transition">API</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/press" className="hover:text-white transition">Press</Link></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/docs" className="hover:text-white transition">Documentation</Link></li>
              <li><Link href="/tutorials" className="hover:text-white transition">Tutorials</Link></li>
              <li><Link href="/community" className="hover:text-white transition">Community</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
              <li><Link href="/gdpr" className="hover:text-white transition">GDPR</Link></li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm">
            © {year} Solicio. All rights reserved.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-4">
            {["X", "in", "ig", "yt"].map((icon) => (
              <div
                key={icon}
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-sm hover:bg-white/10 transition cursor-pointer"
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


// "use client";

// import React from "react";
// import Link from "next/link";

// export default function Footer() {
//   const year = new Date().getFullYear();

//   return (
//     <footer className="relative bg-black text-white overflow-hidden">

//       {/* Ambient Gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
//       <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
//       <div className="absolute bottom-0 -right-24 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />

//       <div className="relative max-w-7xl mx-auto px-6 py-16">

//         {/* TOP GRID */}
//         <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

//           {/* BRAND */}
//           <div>
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-pink-500 to-amber-400 flex items-center justify-center font-black text-black">
//                 S
//               </div>
//               <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
//                 Solicio
//               </span>
//             </div>
//             <p className="text-slate-400 leading-relaxed">
//               Empowering small businesses — <br />
//               <span className="text-slate-300">छोटे व्यवसायों को सशक्त बनाना</span>
//             </p>
//           </div>

//           {/* PRODUCT */}
//           <div>
//             <h4 className="font-semibold mb-4 text-white">Product</h4>
//             <ul className="space-y-2 text-slate-400">
//               <li>
//                 <Link href="/services" className="hover:text-white transition">
//                   Services
//                 </Link>
//               </li>
//               <li>
//                 <a href="#process" className="hover:text-white transition">
//                   How it works
//                 </a>
//               </li>
//               <li>
//                 <Link href="/contact" className="hover:text-white transition">
//                   FAQs
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* COMPANY */}
//           <div>
//             <h4 className="font-semibold mb-4 text-white">Company</h4>
//             <ul className="space-y-2 text-slate-400">
//               <li>
//                 <Link href="/about" className="hover:text-white transition">
//                   About
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/privacy" className="hover:text-white transition">
//                   Privacy
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/terms" className="hover:text-white transition">
//                   Terms
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* CONTACT */}
//           <div>
//             <h4 className="font-semibold mb-4 text-white">Contact</h4>
//             <ul className="space-y-2 text-slate-400">
//               <li>Email: hello@solicio.in</li>
//               <li>Support: +91-00000 00000</li>
//               <li>
//                 <Link
//                   href="/profile"
//                   className="inline-block mt-2 px-5 py-2 rounded-full text-sm font-semibold
//                   bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400
//                   text-black hover:opacity-90 transition shadow-lg"
//                 >
//                   Create Account
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* DIVIDER */}
//         <div className="my-12 h-px bg-white/10" />

//         {/* BOTTOM */}
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
//           <p>© {year} Solicio. All rights reserved.</p>
//           <p className="text-slate-500">
//             Built with ❤️ for small businesses
//           </p>
//         </div>

//       </div>
//     </footer>
//   );
// }

