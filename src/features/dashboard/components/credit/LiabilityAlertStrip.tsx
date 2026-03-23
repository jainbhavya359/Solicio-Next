"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, ShieldAlert } from "lucide-react";

interface Props {
  loans: any[];
  licenses: any[];
}

export default function LiabilityAlertStrip({ loans = [], licenses = [] }: Props) {
  const alerts: { id: string; type: "critical" | "warning" | "info"; message: string }[] = [];

  // Loan Alerts
  const overdueLoans = loans.filter(l => l.status === "overdue");
  if (overdueLoans.length > 0) {
    const totalOverdueEmi = overdueLoans.reduce((acc, l) => acc + (l.emiAmount || 0), 0);
    alerts.push({
      id: "overdue_loans",
      type: "critical",
      message: `${overdueLoans.length} active loan facility in default. ₹${totalOverdueEmi.toLocaleString('en-IN')} due immediately.`
    });
  }

  // License Alerts
  const today = new Date();
  const expiringLicenses = licenses.filter(lic => {
    if (!lic.expiryDate && !lic.date) return false;
    const expiry = new Date(lic.expiryDate || lic.date);
    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
    return daysLeft <= 30 && daysLeft > 0;
  });

  const expiredLicenses = licenses.filter(lic => {
    if (!lic.expiryDate && !lic.date) return false;
    const expiry = new Date(lic.expiryDate || lic.date);
    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
    return daysLeft <= 0;
  });

  if (expiredLicenses.length > 0) {
    alerts.push({
      id: "expired_licenses",
      type: "critical",
      message: `${expiredLicenses.length} operational credential(s) have EXPIRED. Regulatory risk elevated.`
    });
  }

  if (expiringLicenses.length > 0) {
    alerts.push({
      id: "expiring_licenses",
      type: "warning",
      message: `${expiringLicenses.length} operational credential(s) expiring within 30 days.`
    });
  }

  // If no alerts
  if (alerts.length === 0) {
    alerts.push({
      id: "nominal",
      type: "info",
      message: "Credit & Regulatory monitors nominal. No active defaults detected."
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {alerts.map((alert) => {
          const styles = {
            critical: "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
            warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
            info: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          };

          const Icon = alert.type === "critical" ? AlertTriangle : alert.type === "warning" ? Clock : ShieldAlert;
          const bgCirc = alert.type === "critical" ? "bg-rose-500/20" : alert.type === "warning" ? "bg-amber-500/20" : "bg-emerald-500/20";

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${styles[alert.type]}`}
            >
              <div className={`p-1.5 rounded-full ${bgCirc}`}>
                <Icon size={16} />
              </div>
              <p className="text-sm font-bold tracking-wide">
                <span className="opacity-70 font-medium mr-2">System Alert:</span>
                {alert.message}
              </p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
