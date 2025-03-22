"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle, Clock, TruckIcon, Package } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock confirmed transaction data
const confirmedTransactionData = {
  "CT-1001": {
    id: "CT-1001",
    product: "Office Chairs",
    quantity: 50,
    status: "Confirmed",
    vendor: "Office Supplies Co.",
    date: "2023-03-18",
    purchaseOrder: "PO-5678",
    totalAmount: "$4,500.00",
    estimatedDelivery: "2023-03-25",
    shippingAddress: "123 Business Ave, Suite 100, Business City, BC 12345",
    timeline: [{ status: "Confirmed", date: "2023-03-18T09:00:00", user: "Admin" }],
  },
  "CT-1002": {
    id: "CT-1002",
    product: "Desk Lamps",
    quantity: 100,
    status: "Accepted by All",
    vendor: "Lighting Solutions Inc.",
    date: "2023-03-17",
    purchaseOrder: "PO-5679",
    totalAmount: "$2,500.00",
    estimatedDelivery: "2023-03-24",
    shippingAddress: "123 Business Ave, Suite 100, Business City, BC 12345",
    timeline: [
      { status: "Confirmed", date: "2023-03-17T10:15:00", user: "Admin" },
      { status: "Accepted by All", date: "2023-03-18T14:20:00", user: "Vendor" },
    ],
  },
  "CT-1003": {
    id: "CT-1003",
    product: "Monitors",
    quantity: 25,
    status: "In Transit",
    vendor: "Tech Supplies Ltd.",
    date: "2023-03-16",
    purchaseOrder: "PO-5680",
    totalAmount: "$7,500.00",
    estimatedDelivery: "2023-03-23",
    shippingAddress: "123 Business Ave, Suite 100, Business City, BC 12345",
    trackingNumber: "TRK123456789",
    timeline: [
      { status: "Confirmed", date: "2023-03-16T08:30:00", user: "Admin" },
      { status: "Accepted by All", date: "2023-03-17T10:45:00", user: "Vendor" },
      { status: "In Transit", date: "2023-03-18T09:15:00", user: "Shipping" },
    ],
  },
  "CT-1004": {
    id: "CT-1004",
    product: "Keyboards",
    quantity: 75,
    status: "Delivered",
    vendor: "Tech Supplies Ltd.",
    date: "2023-03-15",
    purchaseOrder: "PO-5681",
    totalAmount: "$3,750.00",
    deliveryDate: "2023-03-20",
    shippingAddress: "123 Business Ave, Suite 100, Business City, BC 12345",
    trackingNumber: "TRK987654321",
    timeline: [
      { status: "Confirmed", date: "2023-03-15T09:00:00", user: "Admin" },
      { status: "Accepted by All", date: "2023-03-16T11:30:00", user: "Vendor" },
      { status: "In Transit", date: "2023-03-17T14:45:00", user: "Shipping" },
      { status: "Delivered", date: "2023-03-20T10:15:00", user: "Delivery" },
    ],
  },
  "CT-1005": {
    id: "CT-1005",
    product: "Desk Organizers",
    quantity: 200,
    status: "Confirmed",
    vendor: "Office Supplies Co.",
    date: "2023-03-14",
    purchaseOrder: "PO-5682",
    totalAmount: "$1,800.00",
    estimatedDelivery: "2023-03-21",
    shippingAddress: "123 Business Ave, Suite 100, Business City, BC 12345",
    timeline: [{ status: "Confirmed", date: "2023-03-14T15:20:00", user: "Admin" }],
  },
}

// Status icon component
function StatusIcon({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return <CheckCircle className="h-5 w-5 text-blue-500" />
    case "accepted by all":
      return <CheckCircle className="h-5 w-5 text-indigo-500" />
    case "in transit":
      return <TruckIcon className="h-5 w-5 text-yellow-500" />
    case "delivered":
      return <Package className="h-5 w-5 text-green-500" />
    default:
      return <Clock className="h-5 w-5 text-gray-500" />
  }
}

export default function ConfirmedTransactionDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const [transaction, setTransaction] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch
    const fetchTransaction = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        const transactionId = Array.isArray(id) ? id[0] : id
        const data = confirmedTransactionData[transactionId as keyof typeof confirmedTransactionData]

        if (data) {
          setTransaction(data)
        }
      } catch (error) {
        console.error("Error fetching transaction:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTransaction()
    }
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading transaction details...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!transaction) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <h2 className="text-2xl font-bold">Transaction not found</h2>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transactions
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Transaction {transaction.id}</h1>
          <Badge
            variant="outline"
            className={cn(
              "ml-auto font-medium text-sm px-3 py-1",
              transaction.status.toLowerCase() === "confirmed" && "bg-blue-100 text-blue-800",
              transaction.status.toLowerCase() === "accepted by all" && "bg-indigo-100 text-indigo-800",
              transaction.status.toLowerCase() === "in transit" && "bg-yellow-100 text-yellow-800",
              transaction.status.toLowerCase() === "delivered" && "bg-green-100 text-green-800",
            )}
          >
            {transaction.status}
          </Badge>
        </div>

        {/* Transaction details */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Product</p>
                <p className="font-medium">{transaction.product}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                <p className="font-medium">{transaction.quantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendor</p>
                <p className="font-medium">{transaction.vendor}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="font-medium">{transaction.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Purchase Order</p>
                <p className="font-medium">{transaction.purchaseOrder}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="font-medium">{transaction.totalAmount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {transaction.deliveryDate ? "Delivery Date" : "Estimated Delivery"}
                </p>
                <p className="font-medium">{transaction.deliveryDate || transaction.estimatedDelivery}</p>
              </div>
              {transaction.trackingNumber && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tracking Number</p>
                  <p className="font-medium">{transaction.trackingNumber}</p>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground">Shipping Address</p>
              <p className="text-sm">{transaction.shippingAddress}</p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {transaction.timeline.map((event: any, index: number) => (
                <div key={index} className="mb-8 flex gap-4">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <StatusIcon status={event.status} />
                    {index < transaction.timeline.length - 1 && (
                      <div className="absolute top-10 left-1/2 h-full w-px -translate-x-1/2 bg-border" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium">{event.status}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleString()}</p>
                      <span className="text-sm text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">{event.user}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

