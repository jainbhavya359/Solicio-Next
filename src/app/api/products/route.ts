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

    const normalizedName = name.trim().toLowerCase();

    /* instead of first finding and then creating */
    const result = await Products.findOneAndUpdate(
      { email, name: normalizedName },
      {
        $setOnInsert: {
          email,
          name: normalizedName,
          unit,
          quantity: 0,
          sellingPrice,
          purchasePrice: 0,
        },
      },
      {
        new: true,
        upsert: true,
        rawResult: true,
      }
    );

    // If product already existed
    if (!result.lastErrorObject?.upserted) {
      if (result.value.unit !== unit) {
        return NextResponse.json(
          {
            error: `Unit locked. Product '${normalizedName}' already exists with unit '${result.value.unit}'`,
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Product already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product added",
      product: result.value,
    });

  } catch (error: any) {
    // Duplicate key error (extra safety)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Product already exists" },
        { status: 409 }
      );
    }

    console.error("Product create error:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}

