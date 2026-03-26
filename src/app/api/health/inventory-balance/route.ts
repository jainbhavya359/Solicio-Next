import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { computeInventoryBalance } from "@/src/health/engines/inventoryBalanace";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const result = await computeInventoryBalance(email);

    return NextResponse.json(result);

  } catch (err) {
    console.error("Inventory balance score error:", err);
    return NextResponse.json(
      { error: "Failed to calculate inventory balance score" },
      { status: 500 }
    );
  }
}
