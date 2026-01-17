import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { email, query } = await req.json();

    if (!email || !query) {
      return NextResponse.json(
        { error: "Email and query required" },
        { status: 400 }
      );
    }

    await connect();

    // 🔹 MongoDB = storage only
    const rows = await LedgerEntry
      .find({ email })
      .limit(5000)
      .lean();

    const docs = rows.map((r) => ({
      id: r._id.toString(),
      partyName: r.partyName || "",
      itemName: r.itemName || "",
      date: r.date ? r.date.toISOString().slice(0, 10) : "",
      voucherType: r.voucherType || "",
    }));

    const payload = JSON.stringify({ query, docs });

    const enginePath = path.join(
      process.cwd(),
      "cpp",
      "ledger_search_engine.exe"
    );

    const engine = spawn(enginePath);

    let stdout = "";
    let stderr = "";

    engine.on("error", (err) => {
      throw new Error("Failed to start C++ engine: " + err.message);
    });

    engine.stdout.on("data", (d) => {
      stdout += d.toString();
    });

    engine.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    engine.stdin.write(payload);
    engine.stdin.end();

    // Timeout safety
    const timeout = setTimeout(() => {
      engine.kill();
    }, 2000);

    await new Promise<void>((resolve, reject) => {
      engine.on("close", (code) => {
        clearTimeout(timeout);
        if (code !== 0 || stderr) {
          reject(new Error(stderr || "C++ engine failed"));
        } else {
          resolve();
        }
      });
    });

    const parsed = JSON.parse(stdout);
    const results = parsed.results || [];

    const scoreMap = new Map(
      results.map((r: any) => [r.id, r.score])
    );

    const finalResults = rows
      .filter(r => scoreMap.has(r._id.toString()))
      .map(r => ({
        ...r,
        score: scoreMap.get(r._id.toString()),
      }))
      .sort((a, b) => b.score - a.score);

    //console.log(finalResults);

    return NextResponse.json({
      query,
      results: finalResults,
    });

  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
