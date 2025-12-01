"use client";

import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";

export default function ProductDetail() {
  const params = useParams();
  const { products } = useAppContext();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [added, SetAdded] = useState(false);

  useEffect(() => {
    if (params.id && products.length > 0) {
      fetchProduct();
    }
  }, [params.id, products.length]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      // Find product from your backend data
      const foundProduct = products.find((p) => p._id === params.id);

      if (foundProduct) {
        // Transform backend product to match component expectations
        const transformedProduct = {
          id: foundProduct._id,
          title: foundProduct.name,
          image: foundProduct.image[0] || foundProduct.image,
          category: foundProduct.category,
          price: foundProduct.price,
          offerPrice: foundProduct.offerPrice,
          description: foundProduct.description,
          rating: {
            rate: foundProduct.rating?.rate || 4.5,
            count: foundProduct.rating?.count || 0,
          },
        };

        setProduct(transformedProduct);

        // Fetch related products from same category
        const related = products
          .filter(
            (p) =>
              p.category === foundProduct.category &&
              p._id !== foundProduct._id,
          )
          .slice(0, 4)
          .map((p) => ({
            id: p._id,
            title: p.name,
            image: p.image[0] || p.image,
            category: p.category,
            price: p.price,
            offerPrice: p.offerPrice,
            rating: {
              rate: p.rating?.rate || 4.5,
              count: p.rating?.count || 0,
            },
          }));

        setRelatedProducts(related);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (added) {
      SetAdded(false);
      toast.success("Product removed from cart.");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    SetAdded(true);
    toast.success(`${quantity} × ${product.title} added to your cart.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-8"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4 w-fit uppercase">
              {product.category}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating?.rate || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating?.rate} ({product.rating?.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.offerPrice.toFixed(2)}
                </span>
                {product.offerPrice < product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded">
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

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  disabled={added}
                  className={`${
                    added ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>

                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>

                <Button
                  disabled={added}
                  className={`${
                    added ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <Button
                size="lg"
                className={`flex-1 transition-all cursor-pointer ${
                  added
                    ? "bg-green-600 hover:bg-green-600 "
                    : "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 "
                }`}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {added ? "Remove From Cart" : "Add to Cart"}
              </Button>

              <Toaster />
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-purple-600" />
                <div>
                  <div className="font-semibold text-sm">Free Shipping</div>
                  <div className="text-xs text-gray-600">
                    On orders over $100
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-purple-600" />
                <div>
                  <div className="font-semibold text-sm">Secure Payment</div>
                  <div className="text-xs text-gray-600">100% protected</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-6 w-6 text-purple-600" />
                <div>
                  <div className="font-semibold text-sm">Easy Returns</div>
                  <div className="text-xs text-gray-600">
                    30-day return policy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
