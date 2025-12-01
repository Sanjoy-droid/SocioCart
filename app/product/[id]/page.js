"use client";

import toast, { Toaster } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Star,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Loader2,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { products, cartItems, addToCart, updateCartQuantity } =
    useAppContext();

  const product = products.find((p) => p._id === id);
  const currentQuantity = cartItems[id] || 0; // This is the TRUTH

  // Related Products
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p._id !== id)
    .slice(0, 4)
    .map((p) => ({
      id: p._id,
      title: p.name,
      image: p.image[0] || p.image,
      category: p.category,
      price: p.price,
      offerPrice: p.offerPrice || p.price,
    }));

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product._id);
    toast.success("Added to cart!");
  };

  const increaseQty = () =>
    updateCartQuantity(product._id, currentQuantity + 1);
  const decreaseQty = () => {
    if (currentQuantity <= 1) {
      updateCartQuantity(product._id, 0); // removes from cart
      toast.success("Removed from cart");
    } else {
      updateCartQuantity(product._id, currentQuantity - 1);
    }
  };

  const handleBuyNow = () => {
    if (currentQuantity === 0) addToCart(product._id);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={product.image[0] || product.image}
              alt={product.name}
              fill
              className="object-contain p-10"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-start">
            <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-4 w-fit">
              {product.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-300 text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">4.5 (124 reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${Number(product.offerPrice || product.price).toFixed(2)}
                </span>
                {product.offerPrice && product.offerPrice < product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">
                      {Math.round(
                        ((product.price - product.offerPrice) / product.price) *
                          100,
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* CART ACTIONS — CLEAN & PRO */}
            <div className="space-y-4">
              {currentQuantity === 0 ? (
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold cursor-pointer"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    size="lg"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold cursor-pointer"
                  >
                    Buy Now
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-purple-600 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decreaseQty}
                      className="h-12 w-12"
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="w-16 text-center text-lg font-bold text-purple-700">
                      {currentQuantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={increaseQty}
                      className="h-12 w-12"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>

                  <Button
                    onClick={handleBuyNow}
                    size="lg"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold cursor-pointer"
                  >
                    Buy Now
                  </Button>
                </div>
              )}

              {currentQuantity > 0 && (
                <p className="text-green-600 font-medium text-sm">
                  {currentQuantity} item{currentQuantity > 1 ? "s" : ""} in cart
                </p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-10 p-6 bg-gray-100 rounded-xl">
              <div className="flex flex-col items-center text-center">
                <Truck className="h-8 w-8 text-purple-600 mb-2" />
                <p className="font-semibold text-sm">Free Shipping</p>
                <p className="text-xs text-gray-600">Orders over $100</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="h-8 w-8 text-purple-600 mb-2" />
                <p className="font-semibold text-sm">Secure Payment</p>
                <p className="text-xs text-gray-600">100% Protected</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="h-8 w-8 text-purple-600 mb-2" />
                <p className="font-semibold text-sm">Easy Returns</p>
                <p className="text-xs text-gray-600">30 Days Policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
