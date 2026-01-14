import connect from "@/src/dbConfig/dbConnection";
import { Products } from "@/src/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function GET(request: NextRequest){
    try{
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if(!email){
            return NextResponse.json({error: "No email Found"},{status: 400});
        }

        const productList = await Products.find({email});

        //console.log(productList);

        return NextResponse.json({products: productList});
    }catch(error){
        console.log("Error: ",error);
        return NextResponse.json({error: error}, {status: 500});
    }
}


export async function POST(request: NextRequest){
    try{
        const { email, name, unit } = await request.json();

        if(!email){
            return NextResponse.json({error: "No email Found"},{status: 400});
        }

        const newProduct = new Products({
            email, 
            name,
            unit
        });

        await newProduct.save();

        //console.log(newProduct);

        return NextResponse.json({message: "Product Added", success: true, product: newProduct});
    }catch(error){
        console.log("Error: ",error);
        return NextResponse.json({error: error}, {status: 500});
    }
}