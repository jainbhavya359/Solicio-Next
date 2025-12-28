export default function Business() {

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28">

      {/* Ambient blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-24">

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            Business Knowledge Hub
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Learn core business concepts, ask questions, and upskill with
            government-backed and trusted learning resources.
          </p>
        </div>

        {/* ERP & CRM */}
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "What is ERP?",
              text:
                "ERP (Enterprise Resource Planning) software helps MSMEs integrate inventory, HR, sales, and finance into one unified system. Popular tools include SAP, Tally, Zoho Books, and Microsoft Dynamics.",
            },
            {
              title: "What is CRM?",
              text:
                "CRM (Customer Relationship Management) systems help manage customer interactions, sales pipelines, and marketing. Common CRMs include Zoho CRM, HubSpot, and Salesforce.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
              <p className="text-slate-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        {/* ASK A QUESTION */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ask a Business Question
          </h2>
          <p className="text-slate-300 mb-6">
            Have a specific doubt about business, finance, operations, or
            growth? Ask and get clarity instantly.
          </p>

          <div className="flex gap-3 max-w-xl">
            <input
              type="text"
              placeholder="e.g., Where can I find business partners?"
              className="flex-1 px-5 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-indigo-400 transition"
            />
            <button className="px-6 py-3 rounded-xl font-bold text-black bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 transition shadow-lg">
              Ask →
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-3">
            (AI-powered answers coming soon)
          </p>
        </div>

        {/* GOVERNMENT UPSKILLING */}
        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold">
            Government Upskilling Courses
          </h2>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold">🔗 Skill India Digital</h3>
              <p className="text-slate-300 mt-2">
                Government-backed courses to build digital, business, and
                technical skills.
              </p>
            </div>

            <iframe
              src="https://www.skillindiadigital.gov.in/"
              loading="lazy"
              className="w-full h-[32rem]"
              title="Skill India Digital"
            />

            <p className="p-4 text-sm text-slate-400">
              If the page does not load, right-click and open in a new tab due to
              embedding restrictions.
            </p>
          </div>
        </div>

        {/* OTHER COURSES */}
        <div className="space-y-8">
          <h2 className="text-4xl font-extrabold">
            Business-Focused Courses
          </h2>
          <p className="text-slate-300">
            Curated courses to strengthen leadership, analytics, and decision-making.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Business Management & Leadership",
                desc:
                  "Learn how to become a confident manager and an effective business leader.",
                link:
                  "https://www.udemy.com/course/management-business-management-leadership/?couponCode=KEEPLEARNING",
              },
              {
                title: "Business Analytics Complete Course",
                desc:
                  "Master Excel, SQL, Tableau, and Power BI for smarter business decisions.",
                link:
                  "https://www.udemy.com/course/business-analytics-complete-course-w/?couponCode=KEEPLEARNING",
              },
            ].map((course, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
              >
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-slate-300 mb-4">{course.desc}</p>
                <a
                  href={course.link}
                  target="_blank"
                  className="text-indigo-400 hover:underline"
                >
                  Official Website →
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
