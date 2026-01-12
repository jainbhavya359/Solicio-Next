import connect from "@/src/dbConfig/dbConnection";
import Stock from "@/src/models/stockModel";
import { TotalStock } from "@/src/models/totalStockModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest){


    try{
        const { email, name, quantity, price, unit, date, voucher } = await request.json();

        if(!email){
            return NextResponse.json({error: "No email Found"},{status: 400});
        }

        const newStock = new Stock({
            name,
            quantity,
            price,
            unit: unit,
            date: date,
            email: email,
            voucher: voucher,
        });

        const updatedStock = await TotalStock.findOneAndUpdate(
            {
                email,
                name,
            },
            {
                $setOnInsert: {
                    email,
                    name,
                },
                $inc: {
                    quantity: quantity,
                    price: quantity*price,
                },
                $set: {
                    updatedAt:  date
                }
            },
            {
                upsert: true,
                new: true
            }
        );


        await newStock.save();

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