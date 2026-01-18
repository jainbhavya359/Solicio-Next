import { LicenseStatusBadge } from "./LicenseStatusBadge";

export function LicenseCard({ license, onDelete }: any) {
  const expiry = new Date(license.expiryDate);
  const today = new Date();

  const daysLeft = Math.ceil(
    (expiry.getTime() - today.getTime()) / 86400000
  );

  return (
    <div
      className="rounded-xl bg-black/40 border border-white/10 p-5
      hover:border-indigo-400/40 transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-white">
            {license.licenseName}
          </p>
          <p className="text-sm text-slate-400">
            {license.issuingAuthority}
          </p>
        </div>

        <LicenseStatusBadge daysLeft={daysLeft} />
      </div>

      <div className="mt-4 text-sm text-slate-300">
        Expires on{" "}
        <span className="font-semibold">
          {expiry.toISOString().split("T")[0]}
        </span>
      </div>

      {daysLeft <= 30 && (
        <div
          className={`mt-3 text-xs px-3 py-2 rounded-lg
          ${
            daysLeft <= 0
              ? "bg-rose-500/10 text-rose-400"
              : "bg-amber-500/10 text-amber-400"
          }`}
        >
          {daysLeft <= 0
            ? "License expired"
            : `${daysLeft} days remaining`}
        </div>
      )}

      <button
        onClick={() => onDelete(license._id)}
        className="mt-4 text-xs text-rose-400 hover:underline"
      >
        Remove License
      </button>
    </div>
  );
}
