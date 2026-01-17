import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const baseUrl = req.nextUrl.origin;

    const res = await fetch(
      `${baseUrl}/api/alerts?email=${email}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    const alerts = data.alerts || [];

    const top = alerts.slice(0, 3);

    let summary = "No urgent business actions today.";

    if (top.length > 0) {
      summary = `You have ${top.length} important decisions today.`;
    }

    return NextResponse.json({
      date: new Date().toISOString().slice(0, 10),
      summary,
      decisions: top,
    });

  } catch (err) {
    console.error("Daily snapshot error:", err);
    return NextResponse.json(
      { error: "Failed to build daily snapshot" },
      { status: 500 }
    );
  }
}
