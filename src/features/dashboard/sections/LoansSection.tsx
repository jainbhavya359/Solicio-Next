"use client";

import { motion, Variants } from "framer-motion";
import ActiveLoans, { Loan } from "../../loan_licenses/ActiveLoans";
import License_Report from "../../loan_licenses/License_Report";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

interface Props {
  loans: Loan[];
  loadingLoans: boolean;
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
}

export default function LoansSection({ loans, loadingLoans, setLoans }: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4 sm:space-y-6"
    >
      <ActiveLoans data={loans} loading={loadingLoans} setLoans={setLoans} />
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
        <License_Report />
      </motion.div>
    </motion.div>
  );
}
