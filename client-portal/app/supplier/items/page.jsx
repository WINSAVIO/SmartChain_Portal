"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Plus,
  Search,
  Filter,
  ChevronDown,
  AlertCircle,
  Edit,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

export default function ItemsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Placeholder data - in a real app this would come from an API
  const items = [
    {
      id: 1,
      name: "Premium Laptop",
      sku: "LAP-001",
      category: "Electronics",
      price: 1299.99,
      stock: 50,
      minStock: 10,
      status: "In Stock",
    },
    {
      id: 2,
      name: "Wireless Mouse",
      sku: "MOU-001",
      category: "Accessories",
      price: 29.99,
      stock: 5,
      minStock: 20,
      status: "Low Stock",
    },
    // Add more items as needed
  ];

  const categories = [
    "Electronics",
    "Furniture",
    "Office Supplies",
    "Accessories",
  ];

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field)
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortOrder === "asc" ? (
      <ArrowUpDown className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowUpDown className="w-4 h-4 text-blue-600" />
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-50 text-green-700 border-green-200";
      case "Low Stock":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Out of Stock":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Items</h1>
              <p className="text-sm text-gray-600">
                Manage your inventory items
              </p>
            </div>
            <button
              onClick={() => router.push("/supplier/items/add")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add New Item
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-shadow min-w-[160px]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 bg-gray-50 text-left">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      Item Name
                      {getSortIcon("name")}
                    </button>
                  </th>
                  <th className="px-6 py-4 bg-gray-50 text-left">
                    <button
                      onClick={() => handleSort("sku")}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      SKU
                      {getSortIcon("sku")}
                    </button>
                  </th>
                  <th className="px-6 py-4 bg-gray-50 text-left">
                    <button
                      onClick={() => handleSort("category")}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      Category
                      {getSortIcon("category")}
                    </button>
                  </th>
                  <th className="px-6 py-4 bg-gray-50 text-right w-32">
                    <button
                      onClick={() => handleSort("price")}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 w-full justify-end"
                    >
                      Price
                      {getSortIcon("price")}
                    </button>
                  </th>
                  <th className="px-6 py-4 bg-gray-50 text-right w-32">
                    <button
                      onClick={() => handleSort("stock")}
                      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 w-full justify-end"
                    >
                      Stock
                      {getSortIcon("stock")}
                    </button>
                  </th>
                  <th className="px-6 py-4 bg-gray-50 text-left">
                    <span className="text-sm font-medium text-gray-600">
                      Status
                    </span>
                  </th>
                  <th className="px-6 py-4 bg-gray-50 text-right">
                    <span className="text-sm font-medium text-gray-600">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{item.sku}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right w-32">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{item.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right w-32">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.stock}
                        </div>
                        {item.stock <= item.minStock && (
                          <div className="text-xs text-yellow-600 flex items-center justify-end gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Low Stock
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium border rounded-full ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            router.push(`/supplier/items/${item.id}/edit`)
                          }
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {items.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by adding your first item to the inventory.
              </p>
              <button
                onClick={() => router.push("/supplier/items/add")}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
