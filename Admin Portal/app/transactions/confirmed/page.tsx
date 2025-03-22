"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock confirmed transactions data
const confirmedTransactions = [
  {
    id: "CT-1001",
    product: "Office Chairs",
    quantity: 50,
    status: "Confirmed",
    vendor: "Office Supplies Co.",
    date: "2023-03-18",
  },
  {
    id: "CT-1002",
    product: "Desk Lamps",
    quantity: 100,
    status: "Accepted by All",
    vendor: "Lighting Solutions Inc.",
    date: "2023-03-17",
  },
  {
    id: "CT-1003",
    product: "Monitors",
    quantity: 25,
    status: "In Transit",
    vendor: "Tech Supplies Ltd.",
    date: "2023-03-16",
  },
  {
    id: "CT-1004",
    product: "Keyboards",
    quantity: 75,
    status: "Delivered",
    vendor: "Tech Supplies Ltd.",
    date: "2023-03-15",
  },
  {
    id: "CT-1005",
    product: "Desk Organizers",
    quantity: 200,
    status: "Confirmed",
    vendor: "Office Supplies Co.",
    date: "2023-03-14",
  },
]

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "accepted by all":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
      case "in transit":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Badge variant="outline" className={cn("font-medium", getStatusColor(status))}>
      {status}
    </Badge>
  )
}

export default function ConfirmedTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter transactions based on search query and status filter
  const filteredTransactions = confirmedTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.vendor.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Confirmed Transactions</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="accepted by all">Accepted by All</SelectItem>
              <SelectItem value="in transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transactions table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      <Link href={`/transactions/confirmed/${transaction.id}`} className="text-primary hover:underline">
                        {transaction.id}
                      </Link>
                    </TableCell>
                    <TableCell>{transaction.product}</TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell>{transaction.vendor}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}

