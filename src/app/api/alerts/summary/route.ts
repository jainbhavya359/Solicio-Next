import { NextRequest, NextResponse } from "next/server";

async function fetchAlert(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  return res.json();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const base = req.nextUrl.origin;

  const results = await Promise.all([
    fetchAlert(`${base}/api/alerts/stock-stagnation?email=${email}`),
    fetchAlert(`${base}/api/alerts/sales-drop?email=${email}`),
    fetchAlert(`${base}/api/alerts/receivables?email=${email}`),
    fetchAlert(`${base}/api/alerts/high-margin?email=${email}`),
  ]);

  const alerts = results
    .filter(r => r.triggered && r.alert)
    .map(r => r.alert)
    .sort((a, b) => b.priority - a.priority);

  return NextResponse.json({
    count: alerts.length,
    alerts,
    todayLabel: "Today's Decisions",
  });
}
