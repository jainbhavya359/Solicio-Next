import connect from "@/src/dbConfig/dbConnection";
import { Products } from "@/src/models/ProductModel";
import { calculateCompositeStock } from "@/src/utils/compositeStock";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "No email Found" }, { status: 400 });
    }

    const products = await Products.find({ email }).lean();

    for (const p of products) {
      if (p.productType === "composite") {
        p.availableQty = await calculateCompositeStock(p, null);
      } else {
        p.availableQty = p.quantity;
      }
    }

    return NextResponse.json(products);


    // const productList = await Products.find({email});

    // return NextResponse.json({products: productList});
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ error: error }, { status: 500 });
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
        includeResultMetadata: true,
      }
    );

    // If product already existed
    if (!result.lastErrorObject?.upserted) {
      const existingProduct = result.value;
      if (existingProduct && existingProduct.unit !== unit) {
        return NextResponse.json(
          {
            error: `Unit locked. Product '${normalizedName}' already exists with unit '${existingProduct.unit}'`,
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

export async function DELETE(request: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const unit = searchParams.get("unit");

    if (!email || !name || !unit) {
      return NextResponse.json(
        { error: "Email, name, and unit are required" },
        { status: 400 }
      );
    }

    const normalizedName = name.trim().toLowerCase();

    // 1. Check if product exists and check quantity
    const product = await Products.findOne({ email, name: normalizedName, unit });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.quantity > 0) {
      return NextResponse.json(
        { error: "Only products with zero quantity can be removed" },
        { status: 400 }
      );
    }

    // 2. Check if product is used in any composite product's recipe
    const dependency = await Products.findOne({
      email,
      "recipe.productId": product._id
    });

    if (dependency) {
      return NextResponse.json(
        { error: `Cannot delete. Product is an ingredient in composite product: ${dependency.name}` },
        { status: 400 }
      );
    }

    // 3. Perform deletion
    await Products.deleteOne({ _id: product._id });

    return NextResponse.json({
      success: true,
      message: "Strategic asset decommissioned successfully",
    });

  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json(
      { error: "Failed to decommission product" },
      { status: 500 }
    );
  }
}

