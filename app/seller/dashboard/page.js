"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Plus,
  List,
  ClipboardList,
  ArrowRight,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SellerDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    if (isLoaded && user) {
      // Check if user is a seller
      const isSeller =
        user.publicMetadata?.role === "seller" ||
        user.unsafeMetadata?.isSeller === true;

      if (!isSeller) {
        router.push("/");
        return;
      }

      // Fetch seller stats here
      fetchSellerStats();
    }
  }, [isLoaded, user, router]);

  const fetchSellerStats = async () => {
    // TODO: Implement API call to fetch seller statistics
    // For now, using mock data
    setStats({
      totalProducts: 24,
      totalOrders: 156,
      totalRevenue: 12450.5,
      pendingOrders: 8,
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Store className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Seller Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Welcome back, {user?.firstName}! Manage your store and track your
            sales.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Products
              </CardTitle>
              <Package className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalProducts}
              </div>
              <p className="text-xs text-gray-500 mt-1">Active listings</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalOrders}
              </div>
              <p className="text-xs text-gray-500 mt-1">All time orders</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Orders
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.pendingOrders}
              </div>
              <p className="text-xs text-gray-500 mt-1">Awaiting fulfillment</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="border-2 border-purple-100 hover:border-purple-300 cursor-pointer transition-all hover:shadow-lg group"
              onClick={() => router.push("/seller/dashboard/upload-product")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Plus className="h-10 w-10 text-purple-600 group-hover:scale-110 transition-transform" />
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <CardTitle className="text-xl mt-4">
                  Upload New Product
                </CardTitle>
                <CardDescription>
                  Add a new product to your store with images, pricing, and
                  details
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="border-2 border-blue-100 hover:border-blue-300 cursor-pointer transition-all hover:shadow-lg group"
              onClick={() => router.push("/seller/dashboard/my-products")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <List className="h-10 w-10 text-blue-600 group-hover:scale-110 transition-transform" />
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <CardTitle className="text-xl mt-4">My Products</CardTitle>
                <CardDescription>
                  View, edit, and manage all your product listings
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="border-2 border-green-100 hover:border-green-300 cursor-pointer transition-all hover:shadow-lg group"
              onClick={() => router.push("/seller/dashboard/orders")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <ClipboardList className="h-10 w-10 text-green-600 group-hover:scale-110 transition-transform" />
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
                <CardTitle className="text-xl mt-4">Orders Received</CardTitle>
                <CardDescription>
                  Manage and fulfill customer orders
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Recent Activity Section */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>
              Your latest store updates and orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    New order received
                  </p>
                  <p className="text-sm text-gray-500">Order #1234 - $89.99</p>
                </div>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Product updated</p>
                  <p className="text-sm text-gray-500">
                    Updated pricing for "Wireless Headphones"
                  </p>
                </div>
                <span className="text-xs text-gray-400">5 hours ago</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Sales milestone reached
                  </p>
                  <p className="text-sm text-gray-500">
                    You've reached 150+ orders!
                  </p>
                </div>
                <span className="text-xs text-gray-400">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
