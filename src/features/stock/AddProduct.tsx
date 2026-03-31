"use client";

// Currently wrapping the same unified Form we built in AddProductForm.tsx 
// To ensure consistency across the application, we reuse the exact structure.
// In the future, these duplicate files should be merged if their usages align perfectly.
// Solicio requires one unified clean standard across AddProduct and AddProductForm.

import UnifiedAddProductModal from "./AddProductForm";

export default function AddProductModal(props: any) {
  // Pass all props cleanly to the unified form
  return <UnifiedAddProductModal {...props} />;
}
