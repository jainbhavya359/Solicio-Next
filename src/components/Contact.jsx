"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact({ faqs }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, subject, message }),
        }
      );

      if (res.ok) {
        alert("Message sent!");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        alert("Failed to send message");
      }
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <>
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            Let’s Talk
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
            Have a question, feedback, or business idea? We’re listening.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-14">

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl space-y-6"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-400 outline-none"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              type="email"
              className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-400 outline-none"
            />

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-400 outline-none"
            />

            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
              className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-pink-400 outline-none"
            />

            <button className="w-full py-4 rounded-full font-bold text-black bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400 hover:opacity-90 transition">
              Send Message →
            </button>
          </motion.form>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold mb-4">FAQs</h2>

            {faqs.map((q) =>
              q.answer ? (
                <details
                  key={q._id ?? q.message}
                  className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                  <summary className="cursor-pointer flex justify-between font-semibold">
                    {q.message}
                    <span className="text-indigo-400 group-open:rotate-45 transition">+</span>
                  </summary>
                  <p className="mt-4 text-sm text-slate-300">{q.answer}</p>
                </details>
              ) : null
            )}
          </motion.div>

        </div>
      </div>
    </>
  );
}
