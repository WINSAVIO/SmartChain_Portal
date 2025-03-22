"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Mock transaction data
const transactions = [
  {
    id: "TR-1234",
    product: "Office Chairs",
    quantity: 50,
    status: "Pending",
    requestedBy: "John Doe",
    date: "2023-03-15",
    severity: "Urgent",
  },
  {
    id: "TR-1235",
    product: "Desk Lamps",
    quantity: 100,
    status: "Approved",
    requestedBy: "Jane Smith",
    date: "2023-03-14",
    severity: "Normal",
  },
  {
    id: "TR-1236",
    product: "Monitors",
    quantity: 25,
    status: "Shipped",
    requestedBy: "Mike Johnson",
    date: "2023-03-12",
    severity: "Low",
  },
  {
    id: "TR-1237",
    product: "Keyboards",
    quantity: 75,
    status: "Delivered",
    requestedBy: "Sarah Williams",
    date: "2023-03-10",
    severity: "Normal",
  },
  {
    id: "TR-1238",
    product: "Desk Organizers",
    quantity: 200,
    status: "Rejected",
    requestedBy: "David Brown",
    date: "2023-03-08",
    severity: "Low",
  },
  {
    id: "TR-1239",
    product: "Whiteboards",
    quantity: 10,
    status: "Pending",
    requestedBy: "Emily Davis",
    date: "2023-03-07",
    severity: "Urgent",
  },
  {
    id: "TR-1240",
    product: "Filing Cabinets",
    quantity: 15,
    status: "Approved",
    requestedBy: "Robert Wilson",
    date: "2023-03-05",
    severity: "Normal",
  },
]

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "shipped":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "delivered":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
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

// Severity badge component
function SeverityBadge({ severity }: { severity: string }) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "urgent":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "high":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "normal":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Badge variant="outline" className={cn("font-medium", getSeverityColor(severity))}>
      {severity}
    </Badge>
  )
}

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRequest, setNewRequest] = useState({
    product: "",
    quantity: "",
    severity: "Normal",
    notes: "",
  })
  const { toast } = useToast()

  // Filter transactions based on search query and status filter
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.requestedBy.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleSubmitRequest = () => {
    // Validate form
    if (!newRequest.product || !newRequest.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call
    toast({
      title: "Request Submitted",
      description: `Your request for ${newRequest.product} has been submitted successfully.`,
    })

    // Reset form and close dialog
    setNewRequest({
      product: "",
      quantity: "",
      severity: "Normal",
      notes: "",
    })
    setIsDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Restock Requests</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Restock Request</DialogTitle>
                <DialogDescription>Fill in the details to submit a new restock request.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product" className="text-right">
                    Product*
                  </Label>
                  <Input
                    id="product"
                    value={newRequest.product}
                    onChange={(e) => setNewRequest({ ...newRequest, product: e.target.value })}
                    className="col-span-3"
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity*
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newRequest.quantity}
                    onChange={(e) => setNewRequest({ ...newRequest, quantity: e.target.value })}
                    className="col-span-3"
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="severity" className="text-right">
                    Severity
                  </Label>
                  <Select
                    value={newRequest.severity}
                    onValueChange={(value) => setNewRequest({ ...newRequest, severity: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={newRequest.notes}
                    onChange={(e) => setNewRequest({ ...newRequest, notes: e.target.value })}
                    className="col-span-3"
                    placeholder="Add any additional notes"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitRequest}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search requests..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transactions table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      <Link href={`/transactions/${transaction.id}`} className="text-primary hover:underline">
                        {transaction.id}
                      </Link>
                    </TableCell>
                    <TableCell>{transaction.product}</TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={transaction.severity} />
                    </TableCell>
                    <TableCell>{transaction.requestedBy}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
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

