import React, { useEffect } from "react";

export default function MarketingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28">

      {/* Ambient blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 blur-3xl rounded-full" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-24">

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            Marketing & Brand Growth
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Learn how to promote your business, connect with customers, and
            scale your brand using proven strategies and government-backed
            support.
          </p>
        </div>

        {/* MARKETING STRATEGIES */}
        <div className="space-y-10">
          <h2 className="text-4xl font-extrabold">
            Marketing Strategies
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "E-commerce Expansion",
                text:
                  "List your products on platforms like Amazon, Flipkart, or Meesho to access millions of customers beyond your local market.",
              },
              {
                title: "Influencer Partnerships",
                text:
                  "Work with micro-influencers in your niche to build trust and brand awareness. Influencers like Ankur Warikoo or Raj Shamani inspire millions of business owners.",
              },
              {
                title: "Product Marketing",
                text:
                  "Invest in high-quality product photos, compelling descriptions, and content that tells your brand story clearly.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
              >
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-300 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* GOVERNMENT SCHEMES */}
        <div className="space-y-10">
          <h2 className="text-4xl font-extrabold">
            Government Schemes & Support
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Procurement & Marketing Support (PMS)",
                text:
                  "Helps MSMEs participate in national and international trade fairs, exhibitions, and adopt modern marketing and packaging techniques.",
              },
              {
                title: "Digital MSME Scheme",
                text:
                  "Encourages adoption of digital tools and ICT solutions to improve competitiveness in domestic and global markets.",
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

        {/* FAQs */}
        <div className="space-y-10 max-w-4xl">
          <h2 className="text-4xl font-extrabold">
            Marketing FAQs
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "What is a good starting budget for digital marketing?",
                a:
                  "Start small. ₹5,000–₹10,000 per month on targeted social media ads is enough to test what works before scaling.",
              },
              {
                q: "How do I find the right influencer?",
                a:
                  "Focus on audience relevance and engagement rate, not follower count. Authentic creators convert better.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-slate-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ASK AI */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl max-w-3xl">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ask a Marketing Question
          </h2>
          <p className="text-slate-300 mb-6">
            Have a specific marketing challenge? Ask and get instant,
            AI-powered guidance.
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g., How do I market my fashion brand online?"
              className="flex-1 px-5 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-purple-400"
            />
            <button
              onClick={() => console.log("Ask button clicked")}
              className="px-6 py-3 rounded-xl font-bold text-black
              bg-gradient-to-r from-purple-400 to-pink-500
              hover:opacity-90 transition shadow-lg"
            >
              Ask →
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            (AI responses coming soon)
          </p>
        </div>

      </div>
    </section>
  );
}


// import React from "react";

// export default function MarketingPage() {
//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
//       {/* Header */}
//       <header className="text-center">
//         <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
//           Marketing &amp; Brand Growth
//         </h1>
//         <p className="mt-2 text-lg text-gray-600">
//           Learn how to promote your business, connect with customers, and expand
//           your reach.
//         </p>
//       </header>

//       {/* Marketing Strategies Section */}
//       <section className="bg-white rounded-2xl shadow p-6 space-y-4">
//         <h2 className="text-2xl font-semibold text-indigo-600">
//           Marketing Strategies
//         </h2>
//         <p className="text-gray-600">
//           Here are some effective ways to get your product or service in front
//           of your target audience.
//         </p>

//         <div className="grid gap-6 md:grid-cols-3">
//           <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Connect with E-commerce Sites
//             </h3>
//             <p className="mt-2 text-gray-600">
//               Listing your products on major e-commerce platforms like Amazon,
//               Flipkart, or Meesho can give you access to millions of potential
//               customers. It's an essential step for expanding beyond your local
//               market.
//             </p>
//           </div>

//           <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Connect with Influencers
//             </h3>
//             <p className="mt-2 text-gray-600">
//               Partnering with influencers can build trust and brand awareness.
//               Consider working with "micro-influencers" in your niche who have a
//               smaller but highly engaged audience.
//               <br />
//               <br />
//               For example, you could partner with business coaches like{" "}
//               <span className="font-semibold">Ankur Warikoo</span> or
//               entrepreneurs like{" "}
//               <span className="font-semibold">Raj Shamani</span> who have a large
//               following of young professionals and business owners.
//             </p>
//           </div>

//           <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Product Marketing
//             </h3>
//             <p className="mt-2 text-gray-600">
//               Effective product marketing involves more than just a good product.
//               Focus on creating high-quality product photos, compelling
//               descriptions, and engaging content that tells your brand's story.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Government Schemes Section */}
//       <section className="bg-white rounded-2xl shadow p-6 space-y-4">
//         <h2 className="text-2xl font-semibold text-emerald-600">
//           Government Schemes &amp; Support
//         </h2>
//         <p className="text-gray-600">
//           The government offers support to help MSMEs with their marketing
//           efforts.
//         </p>
//         <ul className="space-y-4">
//           <li>
//             <h4 className="font-semibold text-gray-800">
//               Procurement and Marketing Support (PMS) Scheme
//             </h4>
//             <p className="text-gray-600">
//               This scheme aims to promote new market access initiatives by
//               helping MSMEs participate in national and international trade fairs
//               and exhibitions. It also provides financial assistance for modern
//               marketing techniques and packaging.
//             </p>
//           </li>
//           <li>
//             <h4 className="font-semibold text-gray-800">
//               Digital MSME Scheme
//             </h4>
//             <p className="text-gray-600">
//               This scheme encourages MSMEs to adopt digital tools and ICT
//               (Information and Communication Technology) to improve their
//               competitiveness in the national and international markets.
//             </p>
//           </li>
//         </ul>
//       </section>

//       {/* FAQs Section */}
//       <section className="bg-white rounded-2xl shadow p-6 space-y-4">
//         <h2 className="text-2xl font-semibold text-teal-600">Marketing FAQs</h2>
//         <div className="space-y-6">
//           <div>
//             <h3 className="font-semibold text-gray-800">
//               What is a good starting budget for digital marketing?
//             </h3>
//             <p className="text-gray-600">
//               For MSMEs, starting with a small, focused budget is a good
//               approach. You can begin with a budget of ₹5,000-₹10,000 per month
//               on targeted social media ads and adjust as you see results.
//             </p>
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-800">
//               How do I find the right influencer for my business?
//             </h3>
//             <p className="text-gray-600">
//               Look for influencers whose audience aligns with your target
//               customers. Focus on their engagement rate and the authenticity of
//               their content, not just their follower count.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Ask AI Section */}
//       <section className="bg-white rounded-2xl shadow p-6 space-y-4">
//         <h2 className="text-2xl font-semibold text-purple-600">
//           Ask a Question
//         </h2>
//         <p className="text-gray-600">
//           Have a specific question about marketing? Ask me anything and get an
//           instant, AI-powered answer.
//         </p>
//         <div className="flex items-center gap-2">
//           <input
//             type="text"
//             id="marketing-question"
//             placeholder="e.g., How to create a marketing plan for my fashion business?"
//             className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
//           />
//           <button
//             id="ask-button"
//             onClick={() => console.log("Ask button clicked")}
//             className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
//           >
//             Ask
//           </button>
//         </div>

//         {/* Loading */}
//         <div id="loading-indicator" className="hidden">
//           <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
//         </div>

//         {/* AI Response */}
//         <div
//           id="gemini-response"
//           className="hidden p-4 bg-gray-50 border rounded-xl text-gray-700"
//         ></div>
//       </section>
//     </div>
//   );
// }
