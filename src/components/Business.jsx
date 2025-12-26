import React, { useEffect } from "react";

export function Business() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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



// import React from "react";
// import { Services } from "./Services";
// import { useEffect } from "react";

// export function Business(){
//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, []);

//     return (
//         <>
//             <section className="flex flex-col justify-start gap-3 m-3 shadow-md p-5 rounded-xl mt-9">
//                 <h2 className="text-xl font-bold mt-9"> What is ERP?</h2>
//                 <p>ERP (Enterprise Resource Planning) software helps MSMEs integrate functions like inventory, HR, sales, and finance into a unified system. Popular tools include SAP, Tally, Zoho Books, and Microsoft Dynamics.</p>

//                 <h2 className="text-xl font-bold"> What is CRM?</h2>
//                 <p>CRM (Customer Relationship Management) systems help manage customer interactions, sales pipelines, and marketing. Common CRMs include Zoho CRM, HubSpot, and Salesforce.</p>
//             </section>

//             <div className="m-3 shadow-md p-5 rounded-xl">
//                 <h2 className="text-purple-700 text-xl font-bold">Ask a Question</h2>
//                 <p>
//                     Have a specific question about business? Ask me anything and get an instant answer.
//                 </p>
//                 <div className="flex justify-start">
//                     <input
//                         type="text"
//                         placeholder="e.g., Where to find business partners?"
//                         className="border border-gray-300 rounded w-2/3 pl-3 pr-10 py-2 focus:outline-none"
//                     />
//                     <button className="pl-3 text-gray-500 hover:text-gray-700">
//                         🔍
//                     </button>
//                 </div>

//                 <div>
//                     <div></div>
//                 </div>
//                 <div></div>
//             </div>

//             <section className="m-2 p-7 rounded-xl shadow-md flex flex-col justify-start gap-8">
//                 <h2 className="text-3xl font-bold"> Government Upskilling Courses</h2>

//                 <h3 className="text-xl font-bold">🔗 Skill India Digital</h3>
//                 <iframe src="https://www.skillindiadigital.gov.in/" loading="lazy" className="w-full h-[40rem]"></iframe>

//                 <p class="note">If the page does not load, right-click and open it in a new tab due to embedding restrictions.</p>
//             </section>

//             <div className="flex flex-col justify-start rounded-xl shadow-[inset_0_4px_6px_rgba(0,0,0,0.09)] p-7 m-2 mt-8 gap-4">
//                 <h2 className="font-bold text-2xl text-teal-600">Some Business Related Courses</h2>
//                 <p>Explore these courses which help you in taking your business to great heights</p>

//                 <div >
//                     <div className="flex flex-col justify-start rounded-xl shadow-md p-7 m-2 gap-4">
//                         <h3 className="font-semibold text-lg">Business Management and Leadership</h3>
//                         <p>
//                             How To Become A Star Manager, And A Successful Leader.    
//                         </p>
//                         <a href="https://www.udemy.com/course/management-business-management-leadership/?couponCode=KEEPLEARNING" target="_blank" className="text-purple-800">
//                             Official Website →
//                         </a>
//                     </div>

//                     <div className="flex flex-col justify-start rounded-xl shadow-md p-7 m-2 gap-4">
//                         <h3 className="font-semibold text-lg">Business Analytics Complete Course</h3>
//                         <p>
//                             Learn Business Analytics with Excel, SQL, Tableau, and Power BI.
//                         </p>
//                         <a href="https://www.udemy.com/course/business-analytics-complete-course-w/?couponCode=KEEPLEARNING" target="_blank" className="text-purple-800">
//                             Official Website →
//                         </a>
//                     </div>
//                 </div>

//             </div>
//         </>
//     );
// }