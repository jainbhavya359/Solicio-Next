"use client";

import { motion, Variants } from "framer-motion";
import { UserProfile } from "@clerk/nextjs";
import CompanyProfileForm from "../CompanyProfileForm";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function SettingsSection({ email }: { email: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-6"
    >
      <CompanyProfileForm email={email} />
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
        <UserProfile routing="hash" />
      </div>
    </motion.div>
  );
}
