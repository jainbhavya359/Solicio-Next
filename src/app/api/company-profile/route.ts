import connect from "@/src/dbConfig/dbConnection";
import { CompanyProfile } from "@/src/models/CompanyProfileModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connect();

  const payload = await req.json();

  const profile = await CompanyProfile.findOneAndUpdate(
    { email: payload.email },
    payload,
    { upsert: true, returnDocument: 'after' }
  );

  return NextResponse.json({ success: true, profile });
}

export async function GET(req: NextRequest) {
  await connect();
  const { email } = Object.fromEntries(req.nextUrl.searchParams);

  const profile = await CompanyProfile.findOne({ email }).lean();
  return NextResponse.json(profile || null);
}
