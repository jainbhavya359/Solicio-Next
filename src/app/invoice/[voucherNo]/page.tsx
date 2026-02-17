import PrintableDocument from "@/src/features/documents/PrintableDocument";
import connect from "@/src/dbConfig/dbConnection";
import { Document } from "@/src/models/DocumentModel";
import { auth } from "@clerk/nextjs/server";
import DocumentHeader from "@/src/components/ui/DocumentHeader";

export default async function InvoicePage(props: {
  params: Promise<{ voucherNo: string }>;
}) {
  const { voucherNo } = await props.params;
  const { userId } = await auth();

  if (!userId) return <div>Unauthorized</div>;

  await connect();

  const doc = await Document.findOne({
    voucherNo,
    type: "Invoice",
  }).lean();

  if (!doc) return <div>Invoice not found</div>;

  return (
    <>
      <DocumentHeader />

      {/* ✅ Pure server-rendered JSX */}
      <PrintableDocument type="Invoice" doc={doc} />
    </>
  );
}