"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AlertCard from "./AlertCard";
import TodaysDecisions from "./TodaysDecision";

export default function AlertsFeed({ email }: { email: string }) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    axios
      .get(`/api/alerts?email=${email}`)
      .then((res) => setAlerts(res.data.alerts || []))
      .finally(() => setLoading(false));
  }, [email]);

  if (loading) {
    return (
      <div className="text-sm text-slate-400">
        Analyzing today’s decisions…
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="rounded-xl p-4 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400">
        ✅ No critical actions today. Business looks healthy.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* {alerts.map((alert, i) => (
        <AlertCard key={i} alert={alert} />
      ))} */}

      <TodaysDecisions alerts={alerts} />
    </div>
  );
}
