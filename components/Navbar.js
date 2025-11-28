"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Home, Package, Router } from "lucide-react";
import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo2.png"
                  alt="SocioCart logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  SocioCart
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                All Products
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-purple-50"
                onClick={() => router.push("/cartitems")}
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {cartItemsCount}
                  </span>
                )}
              </Button>

              {/* User Authentication */}
              {isLoaded && (
                <>
                  {user ? (
                    <div className="flex items-center">
                      <UserButton afterSignOutUrl="/">
                        <UserButton.MenuItems>
                          <UserButton.Action
                            label="View Cart"
                            labelIcon={<ShoppingCart className="h-4 w-4" />}
                            onClick={() => router.push("/cartitems")}
                          />
                        </UserButton.MenuItems>
                        <UserButton.MenuItems>
                          <UserButton.Action
                            label="My Orders"
                            labelIcon={<Package className="h-4 w-4" />}
                            onClick={() => router.push("/orders")}
                          />
                        </UserButton.MenuItems>
                        {isMobileMenuOpen && (
                          <>
                            <UserButton.MenuItems>
                              <UserButton.Action
                                label="Home"
                                labelIcon={<Home className="h-4 w-4" />}
                                onClick={() => router.push("/")}
                              />
                            </UserButton.MenuItems>
                            <UserButton.MenuItems>
                              <UserButton.Action
                                label="Products"
                                labelIcon={<Package className="h-4 w-4" />}
                                onClick={() => router.push("/products")}
                              />
                            </UserButton.MenuItems>
                          </>
                        )}
                      </UserButton>
                    </div>
                  ) : (
                    <Button
                      onClick={() => openSignIn()}
                      className="hidden md:flex bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-sm hover:shadow-md transition-all px-6"
                    >
                      Sign In
                    </Button>
                  )}
                </>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-purple-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-purple-600 transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-gray-700 hover:text-purple-600 transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>

                {/* Mobile Sign In Button */}
                {isLoaded && !user && (
                  <Button
                    onClick={() => {
                      openSignIn();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-sm w-full"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
