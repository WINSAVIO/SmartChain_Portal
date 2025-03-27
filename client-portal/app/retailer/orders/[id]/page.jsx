"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building,
  MapPin,
  Phone,
  Mail,
  Package,
  Truck,
  Calendar,
  Clock,
  CheckCircle,
  DollarSign,
} from "lucide-react";

export default function RetailerOrderDetailsPage() {
  const router = useRouter();

  // Placeholder data - in a real app this would come from an API
  const order = {
    id: "ORD-001",
    supplier: {
      name: "Tech Solutions Inc.",
      location: "123 Tech Street, San Francisco, CA 94105",
      email: "orders@techsolutions.com",
      phone: "+1 (555) 123-4567",
    },
    items: [
      { name: "Premium Laptop", quantity: 2, price: 1299.99 },
      { name: "Wireless Mouse", quantity: 5, price: 29.99 },
    ],
    total: 2749.93,
    status: "Shipped",
    date: "2024-03-20",
    deliveryDate: "2024-03-23",
    trackingNumber: "TRK123456789",
    shippingMethod: "Express Delivery",
    notes: "Please handle with care. Contains fragile electronics.",
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

  const getShipmentStatus = () => {
    if (order.status === "Shipped") {
      return [
        { title: "Order Placed", date: order.date, completed: true },
        { title: "Processing", date: "2024-03-21", completed: true },
        { title: "Shipped", date: "2024-03-22", completed: true },
        {
          title: "Out for Delivery",
          date: order.deliveryDate,
          completed: false,
        },
        { title: "Delivered", date: "", completed: false },
      ];
    }
    return [];
  };

  const shipmentStatus = getShipmentStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Order {order.id}
              </h1>
              <p className="text-sm text-gray-600">View order details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium border rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    {order.status === "Shipped" && (
                      <span className="text-sm text-gray-600">
                        Tracking: {order.trackingNumber}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Expected delivery: {order.deliveryDate}
                  </div>
                </div>
              </div>

              {order.status === "Shipped" && (
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />
                  <div className="space-y-6">
                    {shipmentStatus.map((status, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div
                          className={`w-3 h-3 rounded-full mt-1.5 ${
                            status.completed ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                        <div>
                          <div
                            className={`font-medium ${
                              status.completed
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            {status.title}
                          </div>
                          {status.date && (
                            <div className="text-sm text-gray-600">
                              {status.date}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Items
                </h2>
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                    <span>Total Amount</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Order Notes
                </h2>
                <p className="text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Supplier Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Supplier Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {order.supplier.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="text-gray-600">{order.supplier.location}</div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="text-gray-600">{order.supplier.email}</div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="text-gray-600">{order.supplier.phone}</div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {order.shippingMethod}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600">Order Date</div>
                    <div className="text-gray-900">{order.date}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600">
                      Expected Delivery
                    </div>
                    <div className="text-gray-900">{order.deliveryDate}</div>
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
