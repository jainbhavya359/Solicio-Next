"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AlertCard from "./AlertCard";
import TodaysDecisions from "./TodaysDecision";

export default function AlertsFeed({ email }: { email: string }) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [health, setHealth] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    axios
      .get(`/api/alerts?email=${email}`)
      .then((res) => {
        setAlerts(res.data.alerts || []);
        setHealth(res.data.healthSignals || []);
      })
      .finally(() => setLoading(false));
  }, [email]);

  if (loading) {
    return (
      <div className="text-sm text-slate-400">
        Analyzing today’s decisions…
      </div>
    );
  }

  /* ---------- NO ALERTS ---------- */
  if (alerts.length === 0) {
    return (
      <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-200">
        <p className="font-medium text-emerald-700">
          ✅ Business looks healthy today
        </p>

        {health.length > 0 && (
          <ul className="mt-2 text-sm text-emerald-600 space-y-1">
            {health.map((h, i) => (
              <li key={i}>
                ✔ {h.summary}
                {h.confidence && (
                  <span className="text-xs text-emerald-500 ml-1">
                    ({h.confidence})
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  /* ---------- ALERTS PRESENT ---------- */
  return (
    <div className="space-y-6">
      {/* Context */}
      <p className="text-sm text-slate-500">
        You have{" "}
        <span className="font-medium text-slate-900">
          {alerts.length}
        </span>{" "}
        important decision{alerts.length > 1 ? "s" : ""} today.
      </p>

      {/* Alerts */}
      <div className="space-y-4">
        {alerts.map((alert, i) => (
          <AlertCard key={i} alert={alert} />
        ))}
      </div>

      {/* Healthy signals (still shown) */}
      {health.length > 0 && (
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-700 mb-2">
            Other checks today
          </p>

          <ul className="text-sm text-slate-600 space-y-1">
            {health.map((h, i) => (
              <li key={i}>
                ✔ {h.summary}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      <TodaysDecisions alerts={alerts} />
    </div>
  );
}
