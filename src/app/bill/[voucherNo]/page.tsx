import PrintableDocument from "@/src/components/PrintableDocument";
import connect from "@/src/dbConfig/dbConnection";
import { Document } from "@/src/models/DocumentModel";
import { auth } from "@clerk/nextjs/server";
import PrintButton from "@/src/components/PrintButton";

export default async function BillPage(props: {
  params: Promise<{ voucherNo: string }>;
}) {
  const { voucherNo } = await props.params;
  const { userId } = await auth();

  if (!userId) return <div>Unauthorized</div>;

  await connect();

  const doc = await Document.findOne({
    voucherNo,
    type: "Bill",
  }).lean();

  if (!doc) return <div>Bill not found</div>;

  return (
    <>
      {/* ✅ Client component — safe */}
      <div className="max-w-3xl mx-auto my-4 flex justify-end print:hidden">
        <PrintButton />
      </div>

      {/* ✅ Pure server-rendered JSX */}
      <PrintableDocument type="Bill" doc={doc} />
    </>
  );
}
