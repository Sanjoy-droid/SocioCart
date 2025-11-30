"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Edit, Trash2, Search, Plus, Package } from "lucide-react";
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

export default function MyProducts() {
  const router = useRouter();
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to fetch seller's products
      // Filter by user.id as sellerId

      // Mock data for now
      const mockProducts = [
        {
          id: "1",
          name: "Wireless Bluetooth Headphones",
          description:
            "Premium noise-cancelling headphones with 40-hour battery life",
          price: 89.99,
          stock: 45,
          category: "Electronics",
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
          status: "active",
        },
        {
          id: "2",
          name: "Leather Messenger Bag",
          description: "Handcrafted genuine leather bag for professionals",
          price: 129.99,
          stock: 12,
          category: "Fashion",
          image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
          status: "active",
        },
        {
          id: "3",
          name: "Smart Fitness Watch",
          description: "Track your health and fitness goals with precision",
          price: 199.99,
          stock: 0,
          category: "Electronics",
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
          status: "out_of_stock",
        },
        {
          id: "4",
          name: "Organic Cotton T-Shirt",
          description: "Eco-friendly comfortable t-shirt in multiple colors",
          price: 24.99,
          stock: 120,
          category: "Fashion",
          image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
          status: "active",
        },
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // TODO: Implement delete API call
      console.log("Deleting product:", productId);
      setProducts(products.filter((p) => p.id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
              <p className="text-gray-600 mt-2">Manage your product listings</p>
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="border-none shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                Start by adding your first product
              </p>
              <Button
                onClick={() => router.push("/seller/dashboard/upload-product")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="border-none shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${
                      product.status === "active"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {product.status === "active" ? "Active" : "Out of Stock"}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {product.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-600">
                        ${product.price}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Stock:{" "}
                      <span className="font-semibold">
                        {product.stock} units
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                        onClick={() =>
                          router.push(
                            `/seller/dashboard/edit-product/${product.id}`,
                          )
                        }
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
