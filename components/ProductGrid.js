"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";
import ProductFilters from "./ProductFilter";

export default function ProductGrid({ categoryFilter = null }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: categoryFilter || "all",
    sortBy: "default",
    priceRange: [0, 1000],
  });

  useEffect(() => {
    fetchProducts();
  }, [filters.category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url =
        filters.category === "all"
          ? "https://fakestoreapi.com/products"
          : `https://fakestoreapi.com/products/category/${filters.category}`;

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = () => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Sort
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      default:
        break;
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const displayProducts = filteredAndSortedProducts();

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8 ">
      <ProductFilters filters={filters} setFilters={setFilters} />

      <div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {displayProducts.length} products
          </p>
        </div>

        {displayProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
