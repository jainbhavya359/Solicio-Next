import DecisionAlertCard from "./DecisionAlertCard";

export default function TodaysDecisions({ alerts }: { alerts: any[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Today’s Decisions
        </h2>

        <p className="text-sm text-slate-600 mt-0.5">
          Focus on these {alerts.length} item{alerts.length > 1 ? "s" : ""} to improve business health.
        </p>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => (
          <DecisionAlertCard key={alert.title} alert={alert} />
        ))}
      </div>
    </section>
  );
}
