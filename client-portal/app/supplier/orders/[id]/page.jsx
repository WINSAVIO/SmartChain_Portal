"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle,
  Truck,
  Building,
  MapPin,
  Phone,
  Mail,
  Package,
  ArrowLeft,
  AlertCircle,
  Calendar,
  DollarSign,
  ChevronRight,
} from "lucide-react";

export default function OrderDetailsPage({ params }) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  // Placeholder data - in a real app this would come from an API
  const order = {
    id: params.id,
    retailer: {
      name: "ABC Store",
      location: "123 Main St, New York, NY 10001",
      contact: "John Smith",
      phone: "+1 (555) 123-4567",
      email: "orders@abcstore.com",
    },
    items: [
      { name: "Premium Laptop", quantity: 2, price: 1299.99 },
      { name: "Wireless Mouse", quantity: 5, price: 29.99 },
    ],
    total: 2749.93,
    status: "Pending",
    date: "2024-03-20",
    priority: "High",
    notes: "Please handle with care. Express shipping requested.",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shipped":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "Processing":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "Shipped":
        return <Truck className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const handleProcessOrder = () => {
    setProcessing(true);
    // In a real app, this would make an API call
    setTimeout(() => {
      setProcessing(false);
      router.push("/supplier/orders");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/supplier/orders")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-gray-800">
                  Order {order.id}
                </h1>
                <span
                  className={`px-3 py-1 text-sm font-medium border rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleProcessOrder}
                disabled={processing || order.status !== "Pending"}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  processing || order.status !== "Pending"
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } shadow-sm transition-all`}
              >
                <CheckCircle className="w-4 h-4" />
                {processing ? "Processing..." : "Process Order"}
              </button>
              <button
                disabled={order.status !== "Processing"}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  order.status !== "Processing"
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                } shadow-sm transition-all`}
              >
                <Truck className="w-4 h-4" />
                Mark as Shipped
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-medium text-gray-800">
                    Order Summary
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Order Date</div>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {order.date}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Priority</div>
                    <div className="mt-1 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {order.priority}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="mt-1 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Order Notes</span>
                    </div>
                    <p className="text-sm text-blue-700">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-medium text-gray-800">
                      Order Items
                    </h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    {order.items.length} items
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="py-4 flex items-center hover:bg-gray-50 transition-colors rounded-lg cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            ${(item.quantity * item.price).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ${item.price.toFixed(2)} each
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Order Total
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div>
            {/* Retailer Information */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Building className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-medium text-gray-800">
                    Retailer Information
                  </h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Company</div>
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {order.retailer.name}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Shipping Address
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-sm font-medium text-gray-900">
                        {order.retailer.location}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Contact</div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <a
                          href={`mailto:${order.retailer.email}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          {order.retailer.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <a
                          href={`tel:${order.retailer.phone}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          {order.retailer.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
