"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CreditCard, Lock, CheckCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function Checkout() {
  const {
    products,
    cartItems,
    setCartItems,
    getCartCount,
    router,
    getToken,
    user,
    currency,
    getCartAmount,
    totalItems,
  } = useAppContext();

  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);

  // Fetch addresses
  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle address select
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  // Create order
  const handlePlaceOrder = async () => {
    try {
      if (!email.trim()) {
        return toast.error("Please enter your email");
      }
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }
      let cartItemsArray = Object.keys(cartItems).map((key) => ({
        product: key,
        quantity: cartItems[key],
      }));

      cartItemsArray = cartItemsArray.filter((item) => item.quantity > 0);

      if (cartItemsArray.length === 0) {
        return toast.error("Please add items to cart");
      }

      setIsProcessing(true);

      const token = await getToken();
      const { data } = await axios.post(
        "/api/order/create",
        { address: selectedAddress._id, items: cartItemsArray },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        toast.success(data.message);
        setCartItems({});
        router.push("/order-placed");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

  // Cart calculations
  const cartItemsArray = Object.keys(cartItems)
    .map((id) => {
      const product = products.find((p) => p._id === id);
      const qty = cartItems[id];
      if (!product || qty <= 0) return null;
      return { ...product, quantity: qty };
    })
    .filter(Boolean);

  const subtotal = cartItemsArray.reduce(
    (sum, item) => sum + item.offerPrice * item.quantity,
    0,
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (getCartCount() === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => router.push("/all-products")} size="lg">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Compact Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-gray-600 mt-2">Complete your order in seconds</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left: Form Steps */}
          <div className="space-y-6">
            {/* 1. Email */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                  1
                </span>
                Contact Email
              </h2>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 text-lg bg-gray-50 rounded-xl focus:ring-4 focus:ring-purple-200 focus:bg-white transition"
              />
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                Delivery Address
              </h2>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full text-left bg-gray-50 rounded-xl px-5 py-4 flex items-center justify-between hover:bg-gray-100 transition"
                >
                  <div className="truncate pr-4">
                    {selectedAddress ? (
                      <div>
                        <p className="font-medium">
                          {selectedAddress.fullName}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {selectedAddress.area}, {selectedAddress.city} -{" "}
                          {selectedAddress.pincode}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-500">Select address</span>
                    )}
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border z-30 overflow-hidden">
                    {userAddresses.length > 0 ? (
                      userAddresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => handleAddressSelect(addr)}
                          className="px-5 py-4 hover:bg-purple-50 cursor-pointer border-b last:border-b-0"
                        >
                          <p className="font-medium">{addr.fullName}</p>
                          <p className="text-sm text-gray-600">
                            {addr.area}, {addr.city}, {addr.state} -{" "}
                            {addr.pincode} • {addr.phoneNumber}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-8 text-center text-gray-500">
                        No addresses saved
                      </div>
                    )}
                    <div
                      onClick={() => router.push("/add-address")}
                      className="px-5 py-4 bg-purple-600 text-white font-medium text-center hover:bg-purple-700 cursor-pointer"
                    >
                      + Add New Address
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Payment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                  3
                </span>
                Payment
              </h2>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 text-center">
                <CreditCard className="h-10 w-10 text-purple-700 mx-auto mb-2" />
                <p className="font-semibold text-purple-800">
                  Cash on Delivery (COD)
                </p>
                <p className="text-sm text-gray-600">
                  Pay when you receive your order
                </p>
              </div>
            </div>
          </div>

          {/* Right: Compact Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-5">
                <h3 className="text-xl font-bold">Order Summary</h3>
              </div>

              <div className="p-6 space-y-4">
                {cartItemsArray.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image[0]}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-purple-600">
                      ${(item.offerPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-3 border-t">
                    <span>Total</span>
                    <span className="text-purple-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !email || !selectedAddress}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer"
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Place Order • ${total.toFixed(2)}
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Lock className="h-3 w-3" />
                  Secure • Fast • Trusted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
