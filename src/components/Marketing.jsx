export default function MarketingPage() {
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