"use client";

import { motion } from "framer-motion";
import SettingsLayout from "../components/settings/SettingsLayout";

export default function SettingsSection({ email }: { email: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full relative"
    >
      <SettingsLayout email={email} />
    </motion.div>
  );
}
