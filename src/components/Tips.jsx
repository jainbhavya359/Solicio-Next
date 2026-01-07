"use client"

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Tips({isAuthenticated}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/tips`
        );
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const date = new Date().getDate();
  const tip = data.length ? data[(date * 7) % data.length] : null;

  if (!isAuthenticated || loading || error || !tip) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className="
              relative flex items-center gap-4
              px-6 py-3 rounded-full
              backdrop-blur-xl bg-white/10
              border border-white/20
              shadow-[0_10px_40px_rgba(0,0,0,0.6)]
            "
          >
            {/* Glow */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500/30 via-pink-500/30 to-amber-400/30 blur-lg -z-10" />

            {/* Icon */}
            <span className="text-xl">💡</span>

            {/* Text */}
            <p className="text-sm text-slate-200 leading-snug">
              <span className="font-semibold text-white">
                Did you know?
              </span>{" "}
              {tip.tip}
            </p>

            {/* Close */}
            <button
              onClick={() => setVisible(false)}
              className="ml-2 text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

