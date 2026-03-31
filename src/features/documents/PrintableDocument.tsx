import { ShieldCheck, Calendar, Hash, Building2, MapPin, Receipt, CheckCircle, FileText, QrCode } from "lucide-react";
import { numberToWordsIndian } from "@/src/utils/numberToWords";

export default function PrintableDocument({
  type,
  doc,
}: {
  type: "Invoice" | "Bill";
  doc: any;
}) {
  const { company, party, item, items, taxBreakup, taxDetails, documentType, einvoice, paymentStatus, journalEntryId, placeOfSupply } = doc;

  // 🚀 ADAPTIVE RENDERING: Support both legacy single-item and new multi-item structures
  const activeItems = items?.length > 0 ? items : (item ? [item] : []);
  const activeTax = taxDetails || taxBreakup;
  const activeTaxBreakup = activeTax?.breakup || activeTax; // Handle nested vs flat structures

  const docTitle = type === "Invoice" ? "TAX INVOICE" : "BILLS OF SUPPLY / PURCHASE";

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto font-outfit text-slate-900 print:p-0 print:m-0 print:text-[9pt]">
      {/* 🚀 HEADER SECTION */}
      <div className="flex justify-between items-start mb-6 border-b-2 border-slate-900 pb-6">
        <div className="flex gap-4 items-start max-w-[60%]">
          {company?.logoUrl ? (
            <img src={company.logoUrl} className="h-16 w-16 object-contain rounded-xl border border-slate-200" alt="Company Logo" />
          ) : (
            <div className="w-16 h-16 bg-slate-900 flex items-center justify-center rounded-xl shrink-0">
              <Building2 className="text-white w-8 h-8" />
            </div>
          )}
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tight leading-none text-slate-900">{company?.name || "Global Entity"}</h1>
            <p className="text-xs font-medium text-slate-600 flex items-center gap-1">
               <MapPin className="w-3 h-3" /> {company?.address || "Registered Address HQ"}
            </p>
            {company?.gstin && (
              <p className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-1">
                 <ShieldCheck className="w-4 h-4 text-emerald-600" /> GSTIN: {company.gstin}
              </p>
            )}
             {company?.state && (
              <p className="text-[10px] font-bold text-slate-500 uppercase">State: {company.state}</p>
            )}
          </div>
        </div>

        <div className="text-right max-w-[40%]">
          <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 mb-2">{docTitle}</h2>
          <div className="space-y-1 text-xs">
            <div className="flex justify-end gap-2 text-slate-700">
              <span className="font-semibold text-slate-500">Voucher No:</span>
              <span className="font-bold text-slate-900">{doc.voucherNo}</span>
            </div>
            <div className="flex justify-end gap-2 text-slate-700">
               <span className="font-semibold text-slate-500">Document Date:</span>
               <span className="font-bold text-slate-900">{new Date(doc.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            {journalEntryId && (
              <div className="flex justify-end gap-2 text-slate-700 mt-2">
                 <span className="font-semibold text-slate-500 text-[10px]">Journal ID:</span>
                 <span className="font-mono text-[10px] text-slate-400">{journalEntryId.toString().slice(-8)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🛡️ E-INVOICE & IRN SECTION (If available) */}
      {(einvoice?.irn || documentType === "B2B") && (
         <div className="border border-slate-200 rounded-lg p-4 mb-6 bg-slate-50 flex items-center justify-between text-xs">
             <div className="space-y-1">
                <p><span className="font-semibold text-slate-500">IRN:</span> <span className="font-mono font-bold text-slate-700">{einvoice?.irn || "Not Generated / Sync Pending"}</span></p>
                <div className="flex gap-6">
                    <p><span className="font-semibold text-slate-500">Ack No:</span> <span className="font-bold">{einvoice?.ackNo || "N/A"}</span></p>
                    <p><span className="font-semibold text-slate-500">Ack Date:</span> <span className="font-bold">{einvoice?.ackDate ? new Date(einvoice.ackDate).toLocaleString() : "N/A"}</span></p>
                </div>
             </div>
             <div className="shrink-0 flex items-center justify-center p-2 bg-white rounded-md border border-slate-200 shadow-sm">
                {einvoice?.qrCode ? (
                    <img src={einvoice?.qrCode} alt="E-Invoice QR" className="w-16 h-16" />
                ) : (
                    <QrCode className="w-12 h-12 text-slate-300" />
                )}
             </div>
         </div>
      )}

      {/* 👥 PARTIES: BILLING & SHIPPING */}
      <div className="grid grid-cols-2 gap-6 mb-8 text-xs">
        {/* Buyer View */}
        <div className="space-y-2">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">Billed To (Buyer)</h3>
           <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
               <p className="font-bold text-sm text-slate-900">{party?.name || "Cash Vendor / Buyer"}</p>
               <p className="text-slate-600 mt-1">{party?.address || "Address Not Available"}</p>
               {party?.state && <p className="text-slate-600">State: <span className="font-semibold">{party.state}</span></p>}
               {party?.taxId && (
                  <p className="mt-2 text-emerald-700 font-bold bg-emerald-50 inline-block px-2 py-0.5 rounded border border-emerald-100">
                    GSTIN: {party.taxId}
                  </p>
               )}
           </div>
        </div>

        {/* Shipping View & Extra Metadata */}
        <div className="space-y-2">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">Shipped To & Supply Info</h3>
           <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 h-full flex flex-col justify-between">
               <div>
                 {/* For now duplicating billing address for shipping, until DB schema is split */}
                  <p className="font-bold text-slate-900">{party?.name || "Cash Vendor"}</p>
                  <p className="text-slate-600 mt-1 truncate">{party?.address || "Same as Billing Address"}</p>
               </div>
               
               <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                      <p className="text-slate-500 uppercase font-semibold tracking-wider">Place of Supply</p>
                      <p className="font-bold text-slate-900">{placeOfSupply || party?.state || "Inter-State"}</p>
                  </div>
                  <div>
                      <p className="text-slate-500 uppercase font-semibold tracking-wider">Supply Type</p>
                      <p className="font-bold text-slate-900">{documentType || "Retail"}</p>
                  </div>
               </div>
           </div>
        </div>
      </div>

      {/* 📊 ASSET DEPLOYMENT TABLE */}
      <div className="mb-6 rounded-xl border border-slate-900 overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold w-12 text-center">#</th>
              <th className="px-4 py-3 font-semibold w-2/5">Description of Goods/Services</th>
              <th className="px-4 py-3 font-semibold text-center">HSN/SAC</th>
              <th className="px-4 py-3 font-semibold text-right">Quantity</th>
              <th className="px-4 py-3 font-semibold text-right">Rate (₹)</th>
              <th className="px-4 py-3 font-semibold text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {activeItems.map((itm: any, idx: number) => (
              <tr key={idx} className="bg-white">
                 <td className="px-4 py-3 text-center text-slate-500">{idx + 1}</td>
                 <td className="px-4 py-3">
                   <p className="font-bold text-slate-900">{itm?.name || "Asset Unidentified"}</p>
                   {itm?.isService && <p className="text-[9px] text-emerald-600 font-bold tracking-widest uppercase">Service Segment</p>}
                 </td>
                 <td className="px-4 py-3 text-center text-slate-700 font-mono text-[11px]">{itm?.hsnSac || "NA"}</td>
                 <td className="px-4 py-3 text-right font-semibold text-slate-700">{itm?.quantity || 1} {itm?.unit || "NOS"}</td>
                 <td className="px-4 py-3 text-right font-semibold text-slate-700">{Number(itm?.rate || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                 <td className="px-4 py-3 text-right font-black text-slate-900">
                   {Number(itm?.amount || (itm?.rate * itm?.quantity) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 💰 FISCAL SUMMARY & AMOUNT IN WORDS */}
      <div className="flex gap-8 items-start justify-between mb-8 text-xs">
        {/* Left Side: Fiscal Breakdown */}
        <div className="flex-1 w-full max-w-[50%]">
          {activeTax && activeTax.type !== "NONE" && (
            <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-200">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-1">
                Taxes & Duties Breakdown
              </h4>
              <div className="space-y-2">
                {activeTaxBreakup?.cgst && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-100/50">
                    <span className="font-semibold text-slate-600">CGST @ {activeTaxBreakup.cgst.rate}%</span>
                    <span className="font-bold text-slate-900">₹{Number(activeTaxBreakup.cgst.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {activeTaxBreakup?.sgst && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-100/50">
                    <span className="font-semibold text-slate-600">SGST @ {activeTaxBreakup.sgst.rate}%</span>
                    <span className="font-bold text-slate-900">₹{Number(activeTaxBreakup.sgst.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {activeTaxBreakup?.igst && (
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold text-slate-600">IGST @ {activeTaxBreakup.igst.rate}%</span>
                    <span className="font-bold text-slate-900">₹{Number(activeTaxBreakup.igst.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-4 p-4 border-l-4 border-slate-900 bg-slate-50 rounded-r-xl">
             <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Invoice Amount In Words</p>
             <p className="text-sm font-black text-slate-800 italic uppercase">
                {numberToWordsIndian(Number(doc.total))}
             </p>
          </div>
        </div>

        {/* Right Side: Totals */}
        <div className="w-full max-w-[40%] space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center px-1">
            <span className="font-semibold text-slate-500 uppercase">Subtotal</span>
            <span className="font-bold text-slate-700">₹{Number(doc.subtotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
           {activeTax?.totalTax > 0 && (
             <div className="flex justify-between items-center px-1">
                <span className="font-semibold text-slate-500 uppercase">Tax Amount</span>
                <span className="font-bold text-slate-700">₹{Number(activeTax.totalTax).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
           )}
           {doc.charges?.discount > 0 && (
              <div className="flex justify-between items-center px-1 text-rose-600">
                 <span className="font-semibold uppercase">Discount (-)</span>
                 <span className="font-bold">-₹{Number(doc.charges.discount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
             </div>
           )}
           {doc.charges?.freight > 0 && (
              <div className="flex justify-between items-center px-1">
                 <span className="font-semibold text-slate-500 uppercase">Freight / Other</span>
                 <span className="font-bold text-slate-700">+₹{Number(doc.charges.freight).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
             </div>
           )}
          <div className="h-px bg-slate-200 my-2" />
          <div className="flex justify-between items-end bg-slate-900 text-white rounded-lg p-3 shadow-lg">
             <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Total</span>
             <span className="text-xl font-black tabular-nums tracking-tighter">₹{Number(doc.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* 🖋️ AUTHORIZATION & FOOTER */}
      <div className="mt-12 flex justify-between items-end border-t-2 border-slate-900 pt-6 text-xs">
        <div className="max-w-[50%] space-y-3">
          <div className="flex items-center gap-2">
             <span className="font-bold uppercase text-slate-500 border border-slate-200 px-2 py-1 rounded text-[10px] tracking-wider bg-slate-50">
                Payment Status: <span className={paymentStatus === "paid" ? "text-emerald-600" : paymentStatus === "partial" ? "text-amber-500" : "text-rose-500"}>{paymentStatus?.toUpperCase() || "UNPAID"}</span>
             </span>
          </div>
          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest leading-relaxed">
            This deployment record is computer-generated and verified. No physical signature required for standard compliance.
            <br />
            Subject to local jurisdiction. Check GSTR-2B for ITC eligibility.
          </p>
        </div>
        
        <div className="text-center min-w-[200px]">
          <div className="h-px w-full bg-slate-300 mb-2" />
          <p className="text-xs font-black text-slate-900 uppercase tracking-widest">For {company?.name || "Entity"}</p>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em] mt-1">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
}
