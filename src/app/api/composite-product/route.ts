import connect from "@/src/dbConfig/dbConnection";
import { Products } from "@/src/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connect();

  try {
    const {
      email,
      name,
      unit,
      sellingPrice,
      recipe, // [{ productId, qtyRequired }]
    } = await req.json();

    if (!email || !name || !unit || !Array.isArray(recipe) || recipe.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Fetch ingredient products
    const ingredients = await Products.find({
      _id: { $in: recipe.map(r => r.productId) },
      email,
    });

    if (ingredients.length !== recipe.length) {
      return NextResponse.json(
        { error: "One or more ingredients not found" },
        { status: 400 }
      );
    }

    // Build safe recipe
    const finalRecipe = recipe.map(r => {
      const p = ingredients.find(i => i._id.toString() === r.productId);
      return {
        productId: p!._id,
        productName: p!.name,
        unit: p!.unit,
        qtyRequired: r.qtyRequired,
      };
    });

    const product = await Products.create({
      email,
      name: name.trim().toLowerCase(),
      unit,
      sellingPrice,
      productType: "composite",
      recipe: finalRecipe,
      quantity: 0, // derived, not used
    });

    return NextResponse.json({ success: true, product });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create composite product" }, { status: 500 });
  }
}
