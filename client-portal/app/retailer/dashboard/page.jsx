"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react";

export default function RetailerDashboard() {
  const router = useRouter();

  const metrics = [
    {
      name: "Total Orders",
      value: "45",
      change: "+8%",
      trend: "up",
      icon: ShoppingCart,
      color: "blue",
    },
    {
      name: "Available Items",
      value: "1,234",
      change: "+24",
      trend: "up",
      icon: Package,
      color: "purple",
    },
  ];

  const recentOrders = [
    {
      id: "ORD001",
      supplier: "Tech Supplies Inc",
      amount: 1299.99,
      status: "Processing",
      date: "2024-03-20",
    },
    {
      id: "ORD002",
      supplier: "Global Electronics",
      amount: 849.99,
      status: "Shipped",
      date: "2024-03-19",
    },
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-600";
      case "purple":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Welcome back to your retailer portal
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div
                className={`p-3 rounded-xl ${getColorClasses(metric.color)}`}
              >
                <metric.icon className="w-7 h-7" />
              </div>
              <span
                className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${
                  metric.trend === "up"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {metric.change}
                {metric.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 ml-1" />
                )}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              {metric.value}
            </h3>
            <p className="text-gray-600 text-base font-medium">{metric.name}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <button
          onClick={() => router.push("/retailer/browse")}
          className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
        >
          <h3 className="font-semibold text-gray-800 mb-3 text-lg">
            Browse Items
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Explore available products from suppliers
          </p>
          <div className="flex items-center text-blue-600 text-sm font-medium">
            View catalog
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
        <button
          onClick={() => router.push("/retailer/orders")}
          className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
        >
          <h3 className="font-semibold text-gray-800 mb-3 text-lg">
            Track Orders
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            View and manage your orders
          </p>
          <div className="flex items-center text-blue-600 text-sm font-medium">
            View orders
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
        <button
          onClick={() => router.push("/retailer/sales-report")}
          className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
        >
          <h3 className="font-semibold text-gray-800 mb-3 text-lg">Reports</h3>
          <p className="text-gray-600 text-sm mb-4">
            View sales analytics and insights
          </p>
          <div className="flex items-center text-blue-600 text-sm font-medium">
            View reports
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          <button
            onClick={() => router.push("/retailer/orders")}
            className="text-blue-600 text-sm font-medium hover:text-blue-700"
          >
            View all orders
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => router.push(`/retailer/orders/${order.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-600">
                    {order.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.supplier}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ₹{order.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "Shipped"
                        ? "bg-green-50 text-green-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.date}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
