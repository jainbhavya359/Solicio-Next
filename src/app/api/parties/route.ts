
import connect from "@/src/dbConfig/dbConnection";
import { Party } from "@/src/models/PartyModel";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        await connect();
        const payload = await req.json();
        const { email, name, type } = payload;

        if (!email || !name || !type) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        /* 🔍 Check if exists */
        const existing = await Party.findOne({ email, name });
        if (existing) {
            return NextResponse.json(
                { error: "Party with this name already exists" },
                { status: 409 }
            );
        }

        const party = await Party.create(payload);
        return NextResponse.json({ success: true, party });
    } catch (error: any) {
        console.error("Create Party Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create party" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await connect();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        const search = searchParams.get("search");

        if (!email) {
            return NextResponse.json(
                { error: "Email required" },
                { status: 400 }
            );
        }

        const query: any = { email };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { gstin: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
            ];
        }

        const parties = await Party.find(query).sort({ updatedAt: -1 });

        return NextResponse.json(parties);
    } catch (error: any) {
        console.error("Fetch Parties Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch parties" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connect();
        const payload = await req.json();
        const { _id, email, ...updates } = payload;

        if (!_id || !email) {
            return NextResponse.json(
                { error: "ID and Email required" },
                { status: 400 }
            );
        }

        const party = await Party.findOneAndUpdate(
            { _id, email },
            { $set: updates },
            { returnDocument: 'after' }
        );

        if (!party) {
            return NextResponse.json(
                { error: "Party not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, party });
    } catch (error: any) {
        console.error("Update Party Error:", error);
        return NextResponse.json(
            { error: "Failed to update party" },
            { status: 500 }
        );
    }
}
