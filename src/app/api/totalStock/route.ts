import connect from "@/src/dbConfig/dbConnection";
import { TotalStock } from "@/src/models/totalStockModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest){
    try{
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if(!email){
            return NextResponse.json({error: "No email Found"},{status: 400});
        }

        const stocks = await TotalStock.find({email});

        console.log(stocks);

        return NextResponse.json(stocks);
    }catch(error){
        console.log("error: ", error);
        return NextResponse.json({error: error}, {status: 500});
    }
}