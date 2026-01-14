export default function MarketingPage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white py-28">

      {/* Brighter blobs for liveliness */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-fuchsia-500/30 blur-3xl rounded-full" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-500/30 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-28">

        {/* HERO */}
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Simple Marketing for Small Businesses
          </h1>
          <p className="mt-6 text-xl text-slate-300">
            No jargon. No big budgets. Just clear steps to help customers find
            you and trust your business.
          </p>
        </div>

        {/* STEP-BASED MARKETING */}
        <div className="space-y-12">
          <h2 className="text-4xl font-extrabold">
            Start Marketing in 3 Simple Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "STEP 1",
                title: "Be Discoverable",
                text:
                  "List your business on Google, WhatsApp Business, and online marketplaces so customers can find you easily.",
              },
              {
                step: "STEP 2",
                title: "Build Trust",
                text:
                  "Use real photos, customer reviews, and consistent pricing to make buyers feel confident choosing you.",
              },
              {
                step: "STEP 3",
                title: "Grow Slowly",
                text:
                  "Start with small promotions, local ads, or offers. Scale only what works.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
              >
                <span className="text-sm text-pink-400 font-bold">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold mt-2 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PRACTICAL ADVICE */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              How much should I spend?
            </h3>
            <p className="text-slate-300">
              Start with ₹3,000–₹5,000 per month. Test one channel. If it brings
              customers, increase slowly. Marketing is not an expense—it’s an
              experiment.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              What works best for MSMEs?
            </h3>
            <p className="text-slate-300">
              Local visibility, WhatsApp follow-ups, repeat customers, and
              word-of-mouth beat expensive ads for most small businesses.
            </p>
          </div>
        </div>

        {/* GOVERNMENT SUPPORT (KEEP, BUT SIMPLIFY) */}
        <div className="space-y-8">
          <h2 className="text-4xl font-extrabold">
            Government Support for Marketing
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "MSME Marketing Assistance",
                text:
                  "Support for trade fairs, exhibitions, branding, and packaging to help small businesses reach new markets.",
              },
              {
                title: "Digital MSME Scheme",
                text:
                  "Helps businesses adopt digital tools to improve visibility and competitiveness.",
              },
            ].map((scheme, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
              >
                <h3 className="text-xl font-bold mb-2">{scheme.title}</h3>
                <p className="text-slate-300">{scheme.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FUTURE AI CTA */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl max-w-3xl">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Marketing Help, Simplified
          </h2>
          <p className="text-slate-300 mb-6">
            Soon, Solicio will analyze your business and suggest exactly what
            marketing step you should take next.
          </p>

          <button
            className="px-8 py-4 rounded-full font-bold text-black
            bg-gradient-to-r from-pink-400 to-indigo-500
            hover:opacity-90 transition shadow-lg"
          >
            Get Notified →
          </button>
        </div>

      </div>
    </section>
  );
}



// export default function MarketingPage() {
//   return (
//     <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28">

//       {/* Ambient blobs */}
//       <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 blur-3xl rounded-full" />
//       <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 blur-3xl rounded-full" />

//       <div className="relative max-w-7xl mx-auto px-6 space-y-24">

//         {/* HERO */}
//         <div className="max-w-3xl">
//           <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
//             Marketing & Brand Growth
//           </h1>
//           <p className="mt-6 text-lg text-slate-300">
//             Learn how to promote your business, connect with customers, and
//             scale your brand using proven strategies and government-backed
//             support.
//           </p>
//         </div>

//         {/* MARKETING STRATEGIES */}
//         <div className="space-y-10">
//           <h2 className="text-4xl font-extrabold">
//             Marketing Strategies
//           </h2>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 title: "E-commerce Expansion",
//                 text:
//                   "List your products on platforms like Amazon, Flipkart, or Meesho to access millions of customers beyond your local market.",
//               },
//               {
//                 title: "Influencer Partnerships",
//                 text:
//                   "Work with micro-influencers in your niche to build trust and brand awareness. Influencers like Ankur Warikoo or Raj Shamani inspire millions of business owners.",
//               },
//               {
//                 title: "Product Marketing",
//                 text:
//                   "Invest in high-quality product photos, compelling descriptions, and content that tells your brand story clearly.",
//               },
//             ].map((item, i) => (
//               <div
//                 key={i}
//                 className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
//               >
//                 <h3 className="text-xl font-bold mb-3">{item.title}</h3>
//                 <p className="text-slate-300 leading-relaxed">{item.text}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* GOVERNMENT SCHEMES */}
//         <div className="space-y-10">
//           <h2 className="text-4xl font-extrabold">
//             Government Schemes & Support
//           </h2>

//           <div className="grid md:grid-cols-2 gap-8">
//             {[
//               {
//                 title: "Procurement & Marketing Support (PMS)",
//                 text:
//                   "Helps MSMEs participate in national and international trade fairs, exhibitions, and adopt modern marketing and packaging techniques.",
//               },
//               {
//                 title: "Digital MSME Scheme",
//                 text:
//                   "Encourages adoption of digital tools and ICT solutions to improve competitiveness in domestic and global markets.",
//               },
//             ].map((scheme, i) => (
//               <div
//                 key={i}
//                 className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
//               >
//                 <h3 className="text-xl font-bold mb-2">{scheme.title}</h3>
//                 <p className="text-slate-300">{scheme.text}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* FAQs */}
//         <div className="space-y-10 max-w-4xl">
//           <h2 className="text-4xl font-extrabold">
//             Marketing FAQs
//           </h2>

//           <div className="space-y-6">
//             {[
//               {
//                 q: "What is a good starting budget for digital marketing?",
//                 a:
//                   "Start small. ₹5,000–₹10,000 per month on targeted social media ads is enough to test what works before scaling.",
//               },
//               {
//                 q: "How do I find the right influencer?",
//                 a:
//                   "Focus on audience relevance and engagement rate, not follower count. Authentic creators convert better.",
//               },
//             ].map((faq, i) => (
//               <div
//                 key={i}
//                 className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
//               >
//                 <h3 className="font-semibold mb-2">{faq.q}</h3>
//                 <p className="text-slate-300">{faq.a}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ASK AI */}
//         <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl max-w-3xl">
//           <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//             Ask a Marketing Question
//           </h2>
//           <p className="text-slate-300 mb-6">
//             Have a specific marketing challenge? Ask and get instant,
//             AI-powered guidance.
//           </p>

//           <div className="flex gap-3">
//             <input
//               type="text"
//               placeholder="e.g., How do I market my fashion brand online?"
//               className="flex-1 px-5 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-purple-400"
//             />
//             <button
              
//               className="px-6 py-3 rounded-xl font-bold text-black
//               bg-gradient-to-r from-purple-400 to-pink-500
//               hover:opacity-90 transition shadow-lg"
//             >
//               Ask →
//             </button>
//           </div>

//           <p className="mt-3 text-xs text-slate-400">
//             (AI responses coming soon)
//           </p>
//         </div>

//       </div>
//     </section>
//   );
// }