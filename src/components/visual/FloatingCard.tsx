"use client";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function FloatingCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.5, delay: delay / 1000 },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay / 1000 },
      }}
      className={clsx(
        "absolute bg-white rounded-2xl shadow-lg border border-slate-200 p-4",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
