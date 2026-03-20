"use client";

import { motion, Variants } from "framer-motion";
import PartiesDirectory from "../../parties/PartiesDirectory";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function PartiesSection() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="h-full"
    >
      <PartiesDirectory />
    </motion.div>
  );
}
