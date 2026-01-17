"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DailySnapshotCard({ email }: { email: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!email) return;

    axios
      .get(`/api/daily-snapshot?email=${email}`)
      .then((res) => setData(res.data));
  }, [email]);

  if (!data) return null;

  return (
    <section className="rounded-3xl p-6 bg-white/10 border border-white/15 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-white mb-2">
        Today’s Decisions
      </h3>

      <p className="text-sm text-slate-400 mb-4">
        {data.summary}
      </p>

      <ul className="space-y-2">
        {data.decisions.map((d: any, i: number) => (
          <li
            key={i}
            className="text-sm text-white flex items-start gap-2"
          >
            <span>•</span>
            <span>{d.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
