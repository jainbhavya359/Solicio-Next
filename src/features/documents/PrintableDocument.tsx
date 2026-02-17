import { ShieldCheck, Calendar, Hash, User, Building2, MapPin, Receipt, CheckCircle, FileText } from "lucide-react";

export default function PrintableDocument({
  type,
  doc,
}: {
  type: "Invoice" | "Bill";
  doc: any;
}) {
  const { company, party, item, taxBreakup } = doc;

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto font-outfit text-slate-900 print:p-0 print:m-0 selection:bg-emerald-100 selection:text-emerald-900">
      {/* 🚀 TACTICAL HEADER */}
      <div className="flex justify-between items-start mb-12 border-b-4 border-slate-900 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {company?.logoUrl ? (
              <img src={company.logoUrl} className="h-14 w-auto object-contain" alt="Company Logo" />
            ) : (
              <div className="w-14 h-14 bg-slate-900 flex items-center justify-center rounded-xl">
                <Building2 className="text-white w-8 h-8" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight leading-none">{company?.name || "Solicio Entity"}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Authorized Operational Hub</p>
            </div>
          </div>
          <div className="space-y-1 text-xs font-medium text-slate-500 max-w-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              <span>{company?.address || "Global HQ Coordinates"}</span>
            </div>
            {company?.gstin && (
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span className="font-bold text-slate-700">GSTIN: {company.gstin}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest mb-4">
            <Receipt className="w-3 h-3" />
            {type}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-end gap-2 text-slate-400">
              <Hash className="w-3 h-3" />
              <p className="text-sm font-black text-slate-900">Voucher: <span className="text-emerald-600">{doc.voucherNo}</span></p>
            </div>
            <div className="flex items-center justify-end gap-2 text-slate-400">
              <Calendar className="w-3 h-3" />
              <p className="text-xs font-bold uppercase tracking-wider">{new Date(doc.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🛡️ COUNTERPARTY INTERFACE */}
      <div className="grid grid-cols-2 gap-12 mb-10">
        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
            <User className="w-3 h-3" />
            {type === "Invoice" ? "Beneficiary (Billed To)" : "Origin (Purchased From)"}
          </p>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 leading-tight">{party.name}</h3>
            {party.taxId && (
              <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                GSTIN: {party.taxId}
              </p>
            )}
            {party.state && (
              <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {party.state}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center items-end text-right">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 inline-block">
            <div className="flex items-center gap-2 mb-1 text-emerald-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Status: Verified</span>
            </div>
            <p className="text-[9px] font-bold text-emerald-600/70 uppercase tracking-tighter">Blockchain Verified Transaction Hub</p>
          </div>
        </div>
      </div>

      {/* 📊 ASSET DEPLOYMENT TABLE */}
      <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-900">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Asset Identification</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Qty</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Deployment Rate (₹)</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Aggregate (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="bg-white hover:bg-slate-50 transition-colors">
              <td className="px-6 py-5">
                <p className="text-base font-black text-slate-900">{item.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Transaction Item #01</p>
              </td>
              <td className="px-6 py-5 text-center font-black text-slate-700 tabular-nums text-lg">
                {item.quantity}
              </td>
              <td className="px-6 py-5 text-right font-black text-slate-700 tabular-nums">
                {Number(item.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-5 text-right font-black text-slate-900 tabular-nums text-lg">
                {Number(item.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 💰 FISCAL SUMMARY */}
      <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
        <div className="flex-1 w-full max-w-sm">
          {taxBreakup && taxBreakup.type !== "NONE" && (
            <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" />
                Fiscal Breakdown
              </h4>
              <div className="space-y-2">
                {taxBreakup.cgst && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">CGST Deployment @ {taxBreakup.cgst.rate}%</span>
                    <span className="text-xs font-black text-slate-900 tabular-nums">₹{Number(taxBreakup.cgst.amount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {taxBreakup.sgst && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">SGST Deployment @ {taxBreakup.sgst.rate}%</span>
                    <span className="text-xs font-black text-slate-900 tabular-nums">₹{Number(taxBreakup.sgst.amount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {taxBreakup.igst && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">IGST Deployment @ {taxBreakup.igst.rate}%</span>
                    <span className="text-xs font-black text-slate-900 tabular-nums">₹{Number(taxBreakup.igst.amount).toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-xs space-y-4">
          <div className="flex justify-between items-center px-4">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Base Assessment</span>
            <span className="text-sm font-black text-slate-600 tabular-nums">₹{Number(doc.subtotal).toLocaleString("en-IN")}</span>
          </div>
          <div className="h-px bg-slate-100 mx-4" />
          <div className="relative group overflow-hidden bg-slate-900 text-white rounded-2xl p-6 shadow-2xl shadow-slate-900/20">
            <div className="flex justify-between items-end relative z-10">
              <div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-1">Grand Total</p>
                <p className="text-xs font-bold text-slate-400">Authenticated Value</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black tabular-nums tracking-tighter">₹{Number(doc.total).toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <FileText className="w-20 h-20 rotate-12" />
            </div>
          </div>
        </div>
      </div>

      {/* 🖋️ AUTHORIZATION */}
      <div className="mt-20 flex justify-between items-end border-t border-slate-100 pt-12">
        <div className="max-w-xs">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
            This deployment record is computer-generated and verified through Solicio's institutional ledger. No physical signature required for standard compliance.
          </p>
        </div>
        <div className="text-center min-w-[200px]">
          <div className="h-px w-full bg-slate-200 mb-4" />
          <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Authorized Signatory</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1">Operational Control Command</p>
        </div>
      </div>
    </div>
  );
}
