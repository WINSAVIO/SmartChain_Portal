"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Clock,
} from "lucide-react";

export default function SupplierDashboard() {
  const router = useRouter();

  const metrics = [
    {
      name: "Total Items",
      value: "124",
      change: "+12%",
      trend: "up",
      icon: Package,
    },
    {
      name: "Pending Orders",
      value: "8",
      change: "-2%",
      trend: "down",
      icon: ShoppingCart,
    },
  ];

  const recentOrders = [
    {
      id: "ORD001",
      retailer: "ABC Store",
      amount: 299.99,
      status: "Pending",
      date: "2024-03-20",
    },
    {
      id: "ORD002",
      retailer: "XYZ Mart",
      amount: 549.99,
      status: "Processing",
      date: "2024-03-19",
    },
    {
      id: "ORD003",
      retailer: "Tech Hub",
      amount: 899.99,
      status: "Delivered",
      date: "2024-03-18",
    },
  ];

  const recentTransactions = [
    {
      transactionId: "TRX001",
      receiverId: "RET456",
      item: "Premium Laptop",
      quantity: 5,
      amount: 6499.95,
      status: "Completed",
      date: "2024-03-25",
    },
    {
      transactionId: "TRX002",
      receiverId: "RET789",
      item: "Wireless Mouse",
      quantity: 20,
      amount: 599.8,
      status: "Completed",
      date: "2024-03-24",
    },
    {
      transactionId: "TRX003",
      receiverId: "RET123",
      item: "USB-C Hub",
      quantity: 15,
      amount: 449.85,
      status: "Pending",
      date: "2024-03-23",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Welcome back to your supplier portal
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <metric.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span
                className={`flex items-center text-sm font-medium ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
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
            <h3 className="text-2xl font-semibold text-gray-800 mb-1">
              {metric.value}
            </h3>
            <p className="text-gray-600 text-sm">{metric.name}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => router.push("/supplier/items")}
          className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-800">Manage Items</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Add or update your inventory items
          </p>
        </button>
        <button
          onClick={() => router.push("/supplier/orders")}
          className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-800">Process Orders</h3>
          </div>
          <p className="text-gray-600 text-sm">
            View and fulfill retailer orders
          </p>
        </button>
        <button
          onClick={() => router.push("/supplier/transactions")}
          className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-800">Transactions</h3>
          </div>
          <p className="text-gray-600 text-sm">View transaction history</p>
        </button>
      </div>

      {/* Recent Orders and Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h2>
            <button
              onClick={() => router.push("/supplier/orders")}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retailer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/supplier/orders/${order.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.retailer}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{order.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Transactions
            </h2>
            <button
              onClick={() => router.push("/supplier/transactions")}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr
                    key={transaction.transactionId}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push("/supplier/transactions")}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {transaction.transactionId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.item}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{transaction.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
