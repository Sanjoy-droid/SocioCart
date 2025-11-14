// app/products/page.jsx
import React, { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid"; // client component, normal import

export default function ProductsPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">All Products</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our complete collection of premium products. Use filters to
            find exactly what you're looking for.
          </p>
        </div>

        <Suspense
          fallback={<div className="py-12 text-center">Loading products…</div>}
        >
          <ProductGrid />
        </Suspense>
      </div>
    </div>
  );
}
