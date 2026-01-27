import { motion } from "framer-motion";

export default function ConfirmReversalModal({
  open,
  onClose,
  onConfirm,
  voucherNo,
  itemName,
  loading = false,
  error,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  voucherNo: string;
  itemName: string;
  loading?: boolean;
  error?: string | null;
}) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-white/10
        rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <h3 className="text-lg font-bold text-white mb-2">
          Reverse Ledger Entry?
        </h3>

        <p className="text-sm text-slate-300 mb-4">
          This will create a <b>reversal entry</b> for:
        </p>

        <div className="bg-black/40 rounded-lg p-3 text-sm text-slate-300 mb-4">
          <div><b>Voucher:</b> {voucherNo}</div>
          <div><b>Item:</b> {itemName}</div>
        </div>

        <p className="text-xs text-amber-400 mb-6">
          ⚠ This action cannot be undone.  
          Original entry will remain for audit.
        </p>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30
            text-rose-300 text-sm rounded-lg p-3 mb-4">
            ⚠ {error}
          </div>
        )}


        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg
            bg-white/10 text-white"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading || !!error}
            className="px-4 py-2 rounded-lg
              bg-rose-500 text-black font-semibold
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Reversing..." : "Reverse Entry"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
