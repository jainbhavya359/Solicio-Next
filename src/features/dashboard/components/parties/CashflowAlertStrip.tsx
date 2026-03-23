"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingDown } from "lucide-react";

interface Props {
  parties: any[];
}

const getCreditStatus = (lastTxDate: string | Date | undefined, terms: string | undefined, totalAmount: number) => {
    if (!terms || terms === "Immediate" || terms === "Standard Terms" || totalAmount === 0 || !lastTxDate) {
        return null;
    }

    const match = terms.match(/Net (\d+)/);
    if (!match) return null;

    const creditDays = parseInt(match[1]);
    const txDate = new Date(lastTxDate);
    const dueDate = new Date(txDate.getTime() + creditDays * 24 * 60 * 60 * 1000);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { overdue: true, days: Math.abs(diffDays) };
    }
    return null;
};

export default function CashflowAlertStrip({ parties = [] }: Props) {
  const alerts: { id: string; type: "critical" | "warning"; message: string }[] = [];

  let overdueReceivablesCount = 0;
  let overdueReceivablesAmount = 0;
  let overduePayablesCount = 0;

  let maxPayable = { name: "", amount: 0 };

  parties.forEach(party => {
      const takeAmt = (party.totalSales || 0) - (party.totalReceived || 0);
      const giveAmt = (party.totalPurchases || 0) - (party.totalPaid || 0);

      // Evaluate Receivables
      if (takeAmt > 0 && party.type === "Customer") {
          const status = getCreditStatus(party.lastTransactionDate, party.paymentTerms, party.totalSales);
          if (status?.overdue) {
              overdueReceivablesCount++;
              overdueReceivablesAmount += takeAmt;
          }
      }

      // Evaluate Payables
      if (giveAmt > 0 && party.type === "Supplier") {
          const status = getCreditStatus(party.lastTransactionDate, party.paymentTerms, party.totalPurchases);
          if (status?.overdue) {
              overduePayablesCount++;
          }
          if (giveAmt > maxPayable.amount) {
              maxPayable = { name: party.name, amount: giveAmt };
          }
      }
  });

  if (overdueReceivablesCount > 0) {
    alerts.push({
      id: "overdue_receivables",
      type: "critical",
      message: `${overdueReceivablesCount} Customers are severely OVERDUE. ₹${overdueReceivablesAmount.toLocaleString('en-IN')} locked in unsettled credit.`
    });
  }

  if (overduePayablesCount > 0) {
      alerts.push({
          id: "overdue_payables",
          type: "critical",
          message: `${overduePayablesCount} Supplier invoice(s) have passed standard terms and are now OVERDUE.`
      });
  }

  if (maxPayable.amount > 50000) {
    alerts.push({
      id: "high_supplier_debt",
      type: "warning",
      message: `High supplier dependency detected: ₹${maxPayable.amount.toLocaleString('en-IN')} pending to ${maxPayable.name}.`
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {alerts.map((alert) => {
          const styles = {
            critical: "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
            warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          };

          const Icon = alert.type === "critical" ? AlertTriangle : TrendingDown;
          const bgCirc = alert.type === "critical" ? "bg-rose-500/20" : "bg-amber-500/20";

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
