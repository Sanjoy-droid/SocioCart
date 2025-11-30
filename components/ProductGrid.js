"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";
import ProductFilters from "./ProductFilter";
import { useAppContext } from "@/context/AppContext";

export default function ProductGrid({ categoryFilter = null }) {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams?.get("category") ?? null;
  const { products: realProducts } = useAppContext();

  // Initialize filters using url -> prop -> default
  const [filters, setFilters] = useState(() => ({
    category: categoryFromUrl || categoryFilter || "all",
    sortBy: "default",
    priceRange: [0, 1000],
  }));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Keep filters.category in sync with ?category=... changes
  useEffect(() => {
    if (categoryFromUrl) {
      setFilters((prev) => ({ ...prev, category: categoryFromUrl }));
    } else if (categoryFilter) {
      setFilters((prev) => ({ ...prev, category: categoryFilter }));
    } else {
      setFilters((prev) => ({ ...prev, category: "all" }));
    }
  }, [categoryFromUrl, categoryFilter]);

  // Fetch function that uses real products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Use real products from context
      if (realProducts && realProducts.length > 0) {
        // Transform products to match the expected format for ProductCard
        const transformedProducts = realProducts.map((product) => ({
          id: product._id,
          title: product.name,
          description: product.description,
          price: product.offerPrice,
          image: product.image?.[0] || "", // Use first image from array
          category: product.category,
          rating: { rate: 0, count: 0 }, // Add default rating if needed
        }));

        // Filter by category if needed
        const filtered =
          filters.category === "all"
            ? transformedProducts
            : transformedProducts.filter(
                (p) =>
                  p.category.toLowerCase() === filters.category.toLowerCase(),
              );

        setProducts(filtered);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error processing products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [realProducts, filters.category]);

  // Refetch when category or real products change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredAndSortedProducts = () => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter(
      (p) =>
        p.price >= (filters.priceRange?.[0] ?? 0) &&
        p.price <= (filters.priceRange?.[1] ?? Infinity),
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
    <div className="grid lg:grid-cols-[280px_1fr] gap-8">
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
