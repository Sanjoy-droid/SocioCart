"use client";

import { useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Search, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";

export default function MyProducts() {
  const { products, router } = useAppContext();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products by current user
  const myProducts = useMemo(() => {
    if (!user?.id || !products) return [];
    return products.filter((product) => product.userId === user.id);
  }, [products, user?.id]);

  const filteredProducts = useMemo(() => {
    return myProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [myProducts, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/seller/dashboard")}
            className="mb-4 hover:bg-purple-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Products
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your product listings ({myProducts.length} products)
              </p>
            </div>
            <Button
              onClick={() => router.push("/seller/dashboard/upload-product")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search products by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {!products ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="border-none shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchQuery ? "No products found" : "No products yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Start by adding your first product"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() =>
                    router.push("/seller/dashboard/upload-product")
                  }
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product._id}
                product={{
                  id: product._id,
                  title: product.name,
                  image: product.image[0] || product.image,
                  category: product.category,
                  price: product.price,
                  offerPrice: product.offerPrice,
                  rating: product.rating,
                }}
                index={idx}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
