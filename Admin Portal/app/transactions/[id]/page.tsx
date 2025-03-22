"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle, Clock, XCircle, TruckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock transaction data
const transactionData = {
  "TR-1234": {
    id: "TR-1234",
    product: "Office Chairs",
    quantity: 50,
    status: "Pending",
    requestedBy: "John Doe",
    date: "2023-03-15",
    vendor: "Office Supplies Co.",
    severity: "Urgent",
    notes: "Urgent request for new office setup",
    timeline: [
      { status: "Requested", date: "2023-03-15T09:00:00", user: "John Doe" },
      { status: "Under Review", date: "2023-03-16T11:30:00", user: "Admin" },
    ],
  },
  "TR-1235": {
    id: "TR-1235",
    product: "Desk Lamps",
    quantity: 100,
    status: "Approved",
    requestedBy: "Jane Smith",
    date: "2023-03-14",
    vendor: "Lighting Solutions Inc.",
    severity: "Normal",
    notes: "Standard order for new hires",
    timeline: [
      { status: "Requested", date: "2023-03-14T10:15:00", user: "Jane Smith" },
      { status: "Under Review", date: "2023-03-14T14:20:00", user: "Admin" },
      { status: "Approved", date: "2023-03-15T09:45:00", user: "Manager" },
    ],
  },
  "TR-1236": {
    id: "TR-1236",
    product: "Monitors",
    quantity: 25,
    status: "Shipped",
    requestedBy: "Mike Johnson",
    date: "2023-03-12",
    vendor: "Tech Supplies Ltd.",
    severity: "High",
    notes: "High priority for development team",
    timeline: [
      { status: "Requested", date: "2023-03-12T08:30:00", user: "Mike Johnson" },
      { status: "Under Review", date: "2023-03-12T10:45:00", user: "Admin" },
      { status: "Approved", date: "2023-03-13T09:15:00", user: "Manager" },
      { status: "Shipped", date: "2023-03-14T14:00:00", user: "Vendor" },
    ],
  },
  "TR-1237": {
    id: "TR-1237",
    product: "Keyboards",
    quantity: 75,
    status: "Delivered",
    requestedBy: "Sarah Williams",
    date: "2023-03-10",
    vendor: "Tech Supplies Ltd.",
    severity: "Normal",
    notes: "Regular order for IT department",
    timeline: [
      { status: "Requested", date: "2023-03-10T08:30:00", user: "Sarah Williams" },
      { status: "Under Review", date: "2023-03-10T10:45:00", user: "Admin" },
      { status: "Approved", date: "2023-03-11T09:15:00", user: "Manager" },
      { status: "Shipped", date: "2023-03-12T14:00:00", user: "Vendor" },
      { status: "Delivered", date: "2023-03-14T11:30:00", user: "Logistics" },
    ],
  },
  "TR-1238": {
    id: "TR-1238",
    product: "Desk Organizers",
    quantity: 200,
    status: "Rejected",
    requestedBy: "David Brown",
    date: "2023-03-08",
    vendor: "Office Supplies Co.",
    severity: "Low",
    notes: "Budget constraints",
    timeline: [
      { status: "Requested", date: "2023-03-08T13:45:00", user: "David Brown" },
      { status: 'Under Review", date:  date: "2023-03-08T13:45:00', user: "David Brown" },
      { status: "Under Review", date: "2023-03-09T10:30:00", user: "Admin" },
      { status: "Rejected", date: "2023-03-10T14:15:00", user: "Manager" },
    ],
  },
  "TR-1239": {
    id: "TR-1239",
    product: "Whiteboards",
    quantity: 10,
    status: "Pending",
    requestedBy: "Emily Davis",
    date: "2023-03-07",
    vendor: "Office Supplies Co.",
    severity: "Urgent",
    notes: "Needed for upcoming planning sessions",
    timeline: [
      { status: "Requested", date: "2023-03-07T11:20:00", user: "Emily Davis" },
      { status: "Under Review", date: "2023-03-08T09:45:00", user: "Admin" },
    ],
  },
  "TR-1240": {
    id: "TR-1240",
    product: "Filing Cabinets",
    quantity: 15,
    status: "Approved",
    requestedBy: "Robert Wilson",
    date: "2023-03-05",
    vendor: "Office Supplies Co.",
    severity: "Normal",
    notes: "For document storage reorganization",
    timeline: [
      { status: "Requested", date: "2023-03-05T14:30:00", user: "Robert Wilson" },
      { status: "Under Review", date: "2023-03-06T10:15:00", user: "Admin" },
      { status: "Approved", date: "2023-03-07T11:45:00", user: "Manager" },
    ],
  },
}

// Status icon component
function StatusIcon({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case "requested":
    case "under review":
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />
    case "approved":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "rejected":
      return <XCircle className="h-5 w-5 text-red-500" />
    case "shipped":
    case "delivered":
      return <TruckIcon className="h-5 w-5 text-blue-500" />
    default:
      return <Clock className="h-5 w-5 text-gray-500" />
  }
}

export default function TransactionDetailsPage() {
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
        const data = transactionData[transactionId as keyof typeof transactionData]

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
          <h1 className="text-3xl font-bold">Request {transaction.id}</h1>
          <Badge
            variant="outline"
            className={cn(
              "ml-auto font-medium text-sm px-3 py-1",
              transaction.status.toLowerCase() === "approved" && "bg-green-100 text-green-800",
              transaction.status.toLowerCase() === "pending" && "bg-yellow-100 text-yellow-800",
              transaction.status.toLowerCase() === "rejected" && "bg-red-100 text-red-800",
              transaction.status.toLowerCase() === "shipped" && "bg-blue-100 text-blue-800",
              transaction.status.toLowerCase() === "delivered" && "bg-purple-100 text-purple-800",
            )}
          >
            {transaction.status}
          </Badge>
        </div>

        {/* Transaction details */}
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
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
                <p className="text-sm font-medium text-muted-foreground">Requested By</p>
                <p className="font-medium">{transaction.requestedBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="font-medium">{transaction.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendor</p>
                <p className="font-medium">{transaction.vendor}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Severity</p>
                <p className="font-medium">{transaction.severity}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-sm">{transaction.notes}</p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Request Timeline</CardTitle>
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

