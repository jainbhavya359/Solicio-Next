import { LicenseStatusBadge } from "./LicenseStatusBadge";

export function LicenseCard({ license, onDelete }: any) {
  const expiry = new Date(license.expiryDate);
  const today = new Date();

  const daysLeft = Math.ceil(
    (expiry.getTime() - today.getTime()) / 86400000
  );

  return (
    <div
      className="
        rounded-2xl bg-white border border-stone-200
        p-5 shadow-sm hover:shadow-md
        transition-all duration-200
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-stone-900">
            {license.licenseName}
          </p>
          <p className="text-sm text-stone-500">
            {license.issuingAuthority}
          </p>
        </div>

        <LicenseStatusBadge daysLeft={daysLeft} />
      </div>

      {/* Expiry */}
      <div className="mt-4 text-sm text-stone-600">
        Expires on{" "}
        <span className="font-medium text-stone-900">
          {expiry.toISOString().split("T")[0]}
        </span>
      </div>

      {/* Warning */}
      {daysLeft <= 30 && (
        <div
          className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium
            ${
              daysLeft <= 0
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
        >
          {daysLeft <= 0
            ? "License expired"
            : `${daysLeft} days remaining`}
        </div>
      )}

      {/* Divider */}
      <div className="mt-4 border-t border-stone-100 pt-4 flex justify-end">
        <button
          onClick={() => onDelete(license._id)}
          className="
            text-xs font-medium text-rose-600
            hover:text-rose-700 hover:underline
          "
        >
          Remove license
        </button>
      </div>
    </div>
  );
}
