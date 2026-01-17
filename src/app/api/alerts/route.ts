import { NextRequest, NextResponse } from "next/server";

/**
 * Safely fetch an alert engine
 */
async function fetchAlert(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

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

    /* --------------------------------------------------
       1️⃣ Call all alert engines in parallel
    -------------------------------------------------- */
    const results = await Promise.all([
      fetchAlert(`${baseUrl}/api/alerts/stock-stagnation?email=${email}`),
      fetchAlert(`${baseUrl}/api/alerts/sales-drop?email=${email}`),
      fetchAlert(`${baseUrl}/api/alerts/receivables?email=${email}`),
      fetchAlert(`${baseUrl}/api/alerts/high-margin?email=${email}`),
    ]);

    //console.log(results);

    /* --------------------------------------------------
       2️⃣ Extract only triggered alerts
    -------------------------------------------------- */
    const alerts = results
      .filter((r) => r && r.triggered && r.alert)
      .map((r) => r.alert);

    if (alerts.length === 0) {
      return NextResponse.json({
        alerts: [],
        message: "No critical alerts today",
      });
    }

    /* --------------------------------------------------
       3️⃣ Sort by priority (descending)
    -------------------------------------------------- */
    alerts.sort((a, b) => b.priority - a.priority);

    /* --------------------------------------------------
       4️⃣ Limit (UI-friendly)
    -------------------------------------------------- */
    const TOP_N = 5;

    return NextResponse.json({
      count: alerts.length,
      alerts: alerts.slice(0, TOP_N),
    });

  } catch (err) {
    console.error("Unified alerts error:", err);
    return NextResponse.json(
      { error: "Failed to compute alerts" },
      { status: 500 }
    );
  }
}
