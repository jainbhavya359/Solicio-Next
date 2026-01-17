import DecisionAlertCard from "./DecisionAlertCard";

export default function TodaysDecisions({ alerts }: { alerts: any[] }) {
  return (
    <section className="rounded-3xl p-6 bg-white/10 border border-white/10">
      <h2 className="text-xl font-semibold text-white">
        Today’s Decisions
      </h2>

      <p className="text-sm text-slate-400 mt-1">
        You have {alerts.length} important decisions today.
      </p>

      <div className="mt-6 space-y-4">
        {alerts.map(alert => (
          <DecisionAlertCard key={alert.title} alert={alert} />
        ))}
      </div>
    </section>
  );
}
