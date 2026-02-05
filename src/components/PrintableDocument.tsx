export default function PrintableDocument({
  type,
  doc,
}: {
  type: "Invoice" | "Bill";
  doc: any;
}) {
  const { company, party, item, taxBreakup } = doc;

  return (
    <div className="bg-white p-10 max-w-4xl mx-auto text-sm print:p-0">
      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <div>
          {company?.logoUrl && (
            <img src={company.logoUrl} className="h-12 mb-2" />
          )}
          <h1 className="text-xl font-bold">{company?.name}</h1>
          <p>{company?.address}</p>
          {company?.gstin && <p>GSTIN: {company.gstin}</p>}
        </div>

        <div className="text-right">
          <h2 className="text-lg font-semibold">{type}</h2>
          <p>#{doc.voucherNo}</p>
          <p>Date: {new Date(doc.date).toLocaleDateString()}</p>
        </div>
      </div>

      {/* PARTY */}
      <div className="mb-6">
        <p className="font-semibold">
          {type === "Invoice" ? "Billed To" : "Purchased From"}
        </p>
        <p>{party.name}</p>
        {party.taxId && <p>GSTIN: {party.taxId}</p>}
        {party.state && <p>State: {party.state}</p>}
      </div>

      {/* ITEM TABLE */}
      <table className="w-full border border-gray-300 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Item</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Rate</th>
            <th className="p-2 border">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border">{item.name}</td>
            <td className="p-2 border text-center">{item.quantity}</td>
            <td className="p-2 border text-right">₹{item.rate}</td>
            <td className="p-2 border text-right">₹{item.amount}</td>
          </tr>
        </tbody>
      </table>

      {/* GST BREAKUP */}
      {taxBreakup && taxBreakup.type !== "NONE" && (
        <div className="mb-4">
            <h4 className="font-semibold mb-2">GST Breakup</h4>

            <table className="w-full border">
            <tbody>
                {taxBreakup.cgst && (
                <tr>
                    <td className="p-2 border">
                    CGST @ {taxBreakup.cgst.rate}%
                    </td>
                    <td className="p-2 border text-right">
                    ₹{taxBreakup.cgst.amount}
                    </td>
                </tr>
                )}

                {taxBreakup.sgst && (
                <tr>
                    <td className="p-2 border">
                    SGST @ {taxBreakup.sgst.rate}%
                    </td>
                    <td className="p-2 border text-right">
                    ₹{taxBreakup.sgst.amount}
                    </td>
                </tr>
                )}

                {taxBreakup.igst && (
                <tr>
                    <td className="p-2 border">
                    IGST @ {taxBreakup.igst.rate}%
                    </td>
                    <td className="p-2 border text-right">
                    ₹{taxBreakup.igst.amount}
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        )}


      {/* TOTALS */}
      <div className="flex justify-end">
        <table className="w-64">
          <tbody>
            <tr>
              <td className="p-2">Subtotal</td>
              <td className="p-2 text-right">₹{doc.subtotal}</td>
            </tr>
            <tr>
              <td className="p-2 font-semibold">Total</td>
              <td className="p-2 text-right font-semibold">
                ₹{doc.total}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs mt-8 text-gray-500">
        This is a computer-generated document.
      </p>
    </div>
  );
}
