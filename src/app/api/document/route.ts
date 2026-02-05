import connect from "@/src/dbConfig/dbConnection";
import { Document } from "@/src/models/DocumentModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connect();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const voucherNo = searchParams.get("voucherNo");

  if (!email || !voucherNo) {
    return NextResponse.json(
      { error: "Missing params" },
      { status: 400 }
    );
  }

  const doc = await Document.findOne({ email, voucherNo }).lean();

  if (!doc) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(doc);
}
