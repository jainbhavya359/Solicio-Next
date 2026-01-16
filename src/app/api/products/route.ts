import connect from "@/src/dbConfig/dbConnection";
import { Products } from "@/src/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    await connect();

    try{
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if(!email){
            return NextResponse.json({error: "No email Found"},{status: 400});
        }

        const productList = await Products.find({email});

        return NextResponse.json({products: productList});
    }catch(error){
        console.log("Error: ",error);
        return NextResponse.json({error: error}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
  await connect();

  try {
    const { email, name, unit, sellingPrice } = await request.json();

    if (!email || !name || !unit) {
      return NextResponse.json(
        { error: "Email, name and unit are required" },
        { status: 400 }
      );
    }

    // 🔒 Unit lock check
    const existing = await Products.findOne({ email, name });

    if (existing) {
      if (existing.unit !== unit) {
        return NextResponse.json(
          {
            error: `Unit locked. Product '${name}' already exists with unit '${existing.unit}'`,
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Product already exists" },
        { status: 409 }
      );
    }

    const normalizedName = name.trim().toLowerCase();

    const newProduct = await Products.create({
      email,
      name: normalizedName,
      unit,
      quantity: 0,
      sellingPrice,
      purchasePrice: 0,
    });

    return NextResponse.json({
      message: "Product Added",
      success: true,
      product: newProduct,
    });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
