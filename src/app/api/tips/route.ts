import connect from "@/src/dbConfig/dbConnection";
import Tips from "@/src/models/TipsModel";
import { NextResponse } from "next/server";

connect();

export async function GET() {
    try{
        const randomTip = await Tips.aggregate([{ $sample: { size: 1 } }]);

        if(randomTip.length == 0){
            return NextResponse.json({error: "Invalid Tip"}, {status: 400});
        }

        return NextResponse.json({message: "Tip send", success: true, data: randomTip});
    }catch(error){
        return NextResponse.json({error: "Tips api failed"}, {status: 500});
    }
}