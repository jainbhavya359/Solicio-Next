import { Products } from "../models/ProductModel";

export async function calculateCompositeStock(product: any, session: any) {
  if (!product.recipe?.length) return 0;

  let maxUnits = Infinity;

  for (const item of product.recipe) {
    const ingredient = await Products.findById(
      item.productId,
      null,
      { session }
    ).lean();

    if (!ingredient || ingredient.quantity <= 0) {
      return 0;
    }

    const possibleUnits = ingredient.quantity / item.qtyRequired;
    maxUnits = Math.min(maxUnits, Math.floor(possibleUnits));
  }

  return maxUnits === Infinity ? 0 : maxUnits;
}
