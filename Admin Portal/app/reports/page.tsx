"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, BarChart } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock sales report data
const salesReports = [
  {
    id: "SR-1001",
    retailerId: "RT-001",
    retailerName: "City Electronics",
    product: "Office Chairs",
    quantity: 15,
    timestamp: "2023-03-15T09:30:00",
    amount: 1350.0,
  },
  {
    id: "SR-1002",
    retailerId: "RT-002",
    retailerName: "Office Depot",
    product: "Desk Lamps",
    quantity: 30,
    timestamp: "2023-03-14T14:45:00",
    amount: 750.0,
  },
  {
    id: "SR-1003",
    retailerId: "RT-003",
    retailerName: "Tech World",
    product: "Monitors",
    quantity: 10,
    timestamp: "2023-03-13T11:20:00",
    amount: 3000.0,
  },
  {
    id: "SR-1004",
    retailerId: "RT-001",
    retailerName: "City Electronics",
    product: "Keyboards",
    quantity: 25,
    timestamp: "2023-03-12T16:15:00",
    amount: 1250.0,
  },
  {
    id: "SR-1005",
    retailerId: "RT-004",
    retailerName: "Furniture Plus",
    product: "Desk Organizers",
    quantity: 50,
    timestamp: "2023-03-11T10:00:00",
    amount: 450.0,
  },
  {
    id: "SR-1006",
    retailerId: "RT-002",
    retailerName: "Office Depot",
    product: "Whiteboards",
    quantity: 5,
    timestamp: "2023-03-10T13:30:00",
    amount: 750.0,
  },
  {
    id: "SR-1007",
    retailerId: "RT-003",
    retailerName: "Tech World",
    product: "Filing Cabinets",
    quantity: 8,
    timestamp: "2023-03-09T15:45:00",
    amount: 1200.0,
  },
]

// Mock retailers data
const retailers = [
  { id: "RT-001", name: "City Electronics" },
  { id: "RT-002", name: "Office Depot" },
  { id: "RT-003", name: "Tech World" },
  { id: "RT-004", name: "Furniture Plus" },
  { id: "RT-005", name: "Business Supplies Inc." },
]

// Mock products data
const products = [
  { id: "P-001", name: "Office Chairs" },
  { id: "P-002", name: "Desk Lamps" },
  { id: "P-003", name: "Monitors" },
  { id: "P-004", name: "Keyboards" },
  { id: "P-005", name: "Desk Organizers" },
  { id: "P-006", name: "Whiteboards" },
  { id: "P-007", name: "Filing Cabinets" },
]

export default function SalesReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewReportDialogOpen, setIsNewReportDialogOpen] = useState(false)
  const [isCumulativeReportDialogOpen, setIsCumulativeReportDialogOpen] = useState(false)
  const [timePeriod, setTimePeriod] = useState("week")
  const { toast } = useToast()

  const [newReport, setNewReport] = useState({
    retailerId: "",
    product: "",
    quantity: "",
    amount: "",
  })

  // Filter reports based on search query
  const filteredReports = salesReports.filter((report) => {
    return (
      report.retailerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.retailerId.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Generate cumulative report based on time period
  const generateCumulativeReport = () => {
    // In a real app, this would filter by the actual date range
    // For this mock, we'll just use all the data

    // Group by product
    const productSummary = salesReports.reduce(
      (acc, report) => {
        if (!acc[report.product]) {
          acc[report.product] = {
            quantity: 0,
            amount: 0,
          }
        }
        acc[report.product].quantity += report.quantity
        acc[report.product].amount += report.amount
        return acc
      },
      {} as Record<string, { quantity: number; amount: number }>,
    )

    // Calculate total
    const totalSales = Object.values(productSummary).reduce((total, item) => total + item.amount, 0)

    return {
      totalSales,
      productSummary,
    }
  }

  const handleSubmitReport = () => {
    // Validate form
    if (!newReport.retailerId || !newReport.product || !newReport.quantity || !newReport.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call
    toast({
      title: "Report Submitted",
      description: `Sales report for ${newReport.product} has been submitted successfully.`,
    })

    // Reset form and close dialog
    setNewReport({
      retailerId: "",
      product: "",
      quantity: "",
      amount: "",
    })
    setIsNewReportDialogOpen(false)
  }

  const cumulativeReport = generateCumulativeReport()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Sales Reports</h1>
          <div className="flex gap-2">
            {/* Cumulative Report Button */}
            <div className="flex items-center gap-2">
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={isCumulativeReportDialogOpen} onOpenChange={setIsCumulativeReportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <BarChart className="mr-2 h-4 w-4" />
                    Cumulative Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Cumulative Sales Report</DialogTitle>
                    <DialogDescription>
                      Sales summary for the selected time period:{" "}
                      {timePeriod === "day"
                        ? "Today"
                        : timePeriod === "week"
                          ? "This Week"
                          : timePeriod === "month"
                            ? "This Month"
                            : timePeriod === "quarter"
                              ? "This Quarter"
                              : "This Year"}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Total Sales</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">${cumulativeReport.totalSales.toFixed(2)}</p>
                      </CardContent>
                    </Card>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity Sold</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(cumulativeReport.productSummary).map(([product, data]) => (
                            <TableRow key={product}>
                              <TableCell className="font-medium">{product}</TableCell>
                              <TableCell>{data.quantity}</TableCell>
                              <TableCell className="text-right">${data.amount.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* New Report Button */}
            <Dialog open={isNewReportDialogOpen} onOpenChange={setIsNewReportDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Sales Report</DialogTitle>
                  <DialogDescription>Fill in the details to submit a new sales report.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="retailerId" className="text-right">
                      Retailer*
                    </Label>
                    <Select
                      value={newReport.retailerId}
                      onValueChange={(value) => setNewReport({ ...newReport, retailerId: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select retailer" />
                      </SelectTrigger>
                      <SelectContent>
                        {retailers.map((retailer) => (
                          <SelectItem key={retailer.id} value={retailer.id}>
                            {retailer.name} ({retailer.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product" className="text-right">
                      Product*
                    </Label>
                    <Select
                      value={newReport.product}
                      onValueChange={(value) => setNewReport({ ...newReport, product: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.name}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity*
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newReport.quantity}
                      onChange={(e) => setNewReport({ ...newReport, quantity: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount ($)*
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newReport.amount}
                      onChange={(e) => setNewReport({ ...newReport, amount: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewReportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitReport}>Submit Report</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reports..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Reports table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Retailer ID</TableHead>
                <TableHead>Retailer Name</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.retailerId}</TableCell>
                    <TableCell>{report.retailerName}</TableCell>
                    <TableCell>{report.product}</TableCell>
                    <TableCell>{report.quantity}</TableCell>
                    <TableCell>${report.amount.toFixed(2)}</TableCell>
                    <TableCell>{format(new Date(report.timestamp), "MMM dd, yyyy HH:mm")}</TableCell>
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

