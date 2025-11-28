"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SellerOrders() {
  const router = useRouter();
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to fetch orders for this seller
      // Filter by products that belong to user.id as sellerId

      // Mock data for now
      const mockOrders = [
        {
          id: "ORD-001",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          products: [
            {
              name: "Wireless Bluetooth Headphones",
              quantity: 1,
              price: 89.99,
            },
          ],
          totalAmount: 89.99,
          status: "pending",
          orderDate: "2024-01-15T10:30:00Z",
          shippingAddress: "123 Main St, New York, NY 10001",
        },
        {
          id: "ORD-002",
          customerName: "Jane Smith",
          customerEmail: "jane@example.com",
          products: [
            { name: "Leather Messenger Bag", quantity: 2, price: 129.99 },
          ],
          totalAmount: 259.98,
          status: "processing",
          orderDate: "2024-01-14T15:45:00Z",
          shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
        },
        {
          id: "ORD-003",
          customerName: "Mike Johnson",
          customerEmail: "mike@example.com",
          products: [
            { name: "Smart Fitness Watch", quantity: 1, price: 199.99 },
            { name: "Organic Cotton T-Shirt", quantity: 3, price: 24.99 },
          ],
          totalAmount: 274.96,
          status: "shipped",
          orderDate: "2024-01-13T09:15:00Z",
          shippingAddress: "789 Pine Rd, Chicago, IL 60601",
        },
        {
          id: "ORD-004",
          customerName: "Sarah Williams",
          customerEmail: "sarah@example.com",
          products: [
            { name: "Organic Cotton T-Shirt", quantity: 5, price: 24.99 },
          ],
          totalAmount: 124.95,
          status: "delivered",
          orderDate: "2024-01-10T14:20:00Z",
          shippingAddress: "321 Elm St, Houston, TX 77001",
        },
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // TODO: Implement API call to update order status
      console.log("Updating order:", orderId, "to status:", newStatus);

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );

      alert(`Order ${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", label: "Pending", icon: Clock },
      processing: { color: "bg-blue-500", label: "Processing", icon: Package },
      shipped: { color: "bg-purple-500", label: "Shipped", icon: Truck },
      delivered: {
        color: "bg-green-500",
        label: "Delivered",
        icon: CheckCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} hover:${config.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Orders Received
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and fulfill customer orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900">
                {orders.filter((o) => o.status === "pending").length}
              </div>
              <p className="text-sm text-gray-500">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900">
                {orders.filter((o) => o.status === "processing").length}
              </div>
              <p className="text-sm text-gray-500">Processing</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900">
                {orders.filter((o) => o.status === "shipped").length}
              </div>
              <p className="text-sm text-gray-500">Shipped</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900">
                {orders.filter((o) => o.status === "delivered").length}
              </div>
              <p className="text-sm text-gray-500">Delivered</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>View and update order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No orders found
                    </h3>
                    <p className="text-gray-500">
                      {activeTab === "all"
                        ? "You haven't received any orders yet"
                        : `No ${activeTab} orders at the moment`}
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <Card
                      key={order.id}
                      className="border-2 hover:border-purple-300 transition-colors"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              Order #{order.id}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {formatDate(order.orderDate)}
                            </CardDescription>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Customer Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm text-gray-500">Customer</p>
                              <p className="font-semibold">
                                {order.customerName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.customerEmail}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Shipping Address
                              </p>
                              <p className="text-sm text-gray-800">
                                {order.shippingAddress}
                              </p>
                            </div>
                          </div>

                          {/* Products */}
                          <div>
                            <p className="text-sm text-gray-500 mb-2">
                              Products
                            </p>
                            <div className="space-y-2">
                              {order.products.map((product, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center p-2 bg-white border rounded"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {product.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Qty: {product.quantity}
                                    </p>
                                  </div>
                                  <p className="font-semibold">
                                    $
                                    {(product.price * product.quantity).toFixed(
                                      2,
                                    )}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Total & Actions */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div>
                              <p className="text-sm text-gray-500">
                                Total Amount
                              </p>
                              <p className="text-2xl font-bold text-purple-600">
                                ${order.totalAmount.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {order.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateOrderStatus(order.id, "processing")
                                  }
                                  className="bg-blue-500 hover:bg-blue-600"
                                >
                                  Start Processing
                                </Button>
                              )}
                              {order.status === "processing" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateOrderStatus(order.id, "shipped")
                                  }
                                  className="bg-purple-500 hover:bg-purple-600"
                                >
                                  Mark as Shipped
                                </Button>
                              )}
                              {order.status === "shipped" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateOrderStatus(order.id, "delivered")
                                  }
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  Mark as Delivered
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
