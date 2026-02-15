export function LicenseStatusBadge({ daysLeft }: { daysLeft: number }) {
  if (daysLeft <= 0) {
    return (
      <span className="px-3 py-1 text-xs rounded-full bg-rose-500/15 text-rose-400">
        EXPIRED
      </span>
    );
  }

  if (daysLeft <= 30) {
    return (
      <span className="px-3 py-1 text-xs rounded-full bg-amber-500/15 text-amber-400">
        EXPIRING SOON
      </span>
    );
  }

  return (
    <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/15 text-emerald-400">
      ACTIVE
    </span>
  );
}
