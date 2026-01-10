import Stock from "@/src/models/stockModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        const { email, productName, purchaseQuantity, purchasePrice, unit, date } = await request.json();

        if(!email){
            return NextResponse.json({error: "No email Found"},{status: 400});
        }

        const newStock = new Stock({
            name: productName,
            quantity: purchaseQuantity,
            price: purchasePrice,
            unit: unit,
            date: date,
            email: email
        });

        const savedStock = await newStock.save();

        return NextResponse.json({message: "Stock added", success: true});
    }catch(error){
        console.log("Error: ",error);
        return NextResponse.json({error: error}, {status: 500});
    }
}

export async function GET(request: NextRequest){
    try{
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if(!email){
            return NextResponse.json({error: "No email Found"},{status: 400});
        }

        const Stocks = await Stock.find({email});

        return NextResponse.json(Stocks);
    }catch(error){
        console.log("Error: ",error);
        return NextResponse.json({error: error}, {status: 500});
    }
}