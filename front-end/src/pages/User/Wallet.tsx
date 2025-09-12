"use client"

import type React from "react"

// import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useGetAllPatientAppoinmentsQuery } from "@/features/users/userApi"
import {

  Calendar,
  Shield,
  Clock,
  CheckCircle,
  Stethoscope,
  Wallet,
  CreditCard,

  Receipt,
  RefreshCw,
  Download,
} from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"

export default function UserWallet() {

     const patient = useSelector((state:RootState)=> state.auth.user);

     const patientId = patient?._id as string;
    const {data = {}} = useGetAllPatientAppoinmentsQuery(patientId);
   console.log('wallet data',data);
  const walletBalance = 0;
   const upcomingAppointments = data || []
     


//   const upcomingAppointments = [
//     {
//       id: 1,
//       doctor: "Dr. Sarah Johnson",
//       specialty: "Cardiology",
//       date: "2024-01-15",
//       time: "10:00 AM",
//       cost: 150,
//       status: "confirmed",
//     },
//     {
//       id: 2,
//       doctor: "Dr. Michael Chen",
//       specialty: "Dermatology",
//       date: "2024-01-18",
//       time: "2:30 PM",
//       cost: 120,
//       status: "pending_payment",
//     },
//   ]


  const transactions = [
    {
      id: 1,
      type: "appointment",
      description: "Dr. Sarah Johnson - Cardiology Consultation",
      amount: -150.0,
      date: "2024-01-10",
      status: "completed",
      paymentMethod: "Visa ****4242",
      receiptUrl: "#",
    },
    {
      id: 2,
      type: "refund",
      description: "Cancelled Appointment Refund",
      amount: 75.0,
      date: "2024-01-08",
      status: "completed",
      paymentMethod: "Visa ****4242",
      receiptUrl: "#",
    },
    {
      id: 3,
      type: "appointment",
      description: "Dr. Michael Chen - Dermatology Check-up",
      amount: -120.0,
      date: "2024-01-05",
      status: "completed",
      paymentMethod: "Mastercard ****8888",
      receiptUrl: "#",
    },
    {
      id: 4,
      type: "deposit",
      description: "Wallet Top-up",
      amount: 200.0,
      date: "2024-01-03",
      status: "completed",
      paymentMethod: "Bank Transfer",
      receiptUrl: "#",
    },
    {
      id: 5,
      type: "appointment",
      description: "Dr. Emily Rodriguez - General Practice",
      amount: -95.0,
      date: "2023-12-28",
      status: "completed",
      paymentMethod: "Visa ****4242",
      receiptUrl: "#",
    },
  ]

//   const getCardName = (type: string) => {
//     switch (type) {
//       case "visa":
//         return "Visa"
//       case "mastercard":
//         return "Mastercard"
//       case "amex":
//         return "American Express"
//       default:
//         return "Card"
//     }
//   }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Stethoscope className="h-4 w-4" />
      case "refund":
        return <RefreshCw className="h-4 w-4" />
      case "deposit":
        return <CreditCard className="h-4 w-4" />
      default:
        return <Receipt className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("Adding payment method:", formData)
//     setShowAddPayment(false)
//   }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Medical Wallet</h1>
            <p className="text-muted-foreground text-pretty">Manage your healthcare payments and insurance benefits</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">HIPAA Compliant</span>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="max-w-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{walletBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Available for appointments</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>Review and manage payment for scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            { Array.isArray(upcomingAppointments) && upcomingAppointments.map((appointment) => (
                <div key={appointment?._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40&query=doctor`} />
                      <AvatarFallback>
                        <Stethoscope className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment?.doctorId.name}</p>
                      <p className="text-sm text-muted-foreground">{appointment?.doctorId?.specialization}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment?.slot?.date} at {appointment?.slot?.startTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium">₹{appointment?.amount}</p>
                      <Badge variant={appointment?.status === "pending" ? "default" : "secondary"}>
                        {appointment?.status === "pending" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Paid
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Payment Due
                          </>
                        )}
                      </Badge>
                    </div>
                    {appointment?.status === "pending_payment" && <Button size="sm">Pay Now</Button>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="payment-methods" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          </TabsList>

          {/* <TabsContent value="payment-methods" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment methods for appointments</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddPayment(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {paymentMethods.map((method) => (
                    <Card key={method.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {getCardName(method.type)} ending in {method.last4}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {method.isDefault && <Badge variant="secondary">Default</Badge>}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!method.isDefault && <DropdownMenuItem>Set as Default</DropdownMenuItem>}
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

           
            {showAddPayment && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Add Payment Method
                      </CardTitle>
                      <CardDescription>Add a new card for secure medical payments</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddPayment(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                          className="bg-input"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          placeholder="John Doe"
                          value={formData.cardholderName}
                          onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                          className="bg-input"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            className="bg-input"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                            className="bg-input"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isDefault"
                          checked={formData.isDefault}
                          onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
                        />
                        <Label htmlFor="isDefault" className="text-sm">
                          Set as default payment method
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Shield className="h-4 w-4 text-primary" />
                      <p className="text-sm text-muted-foreground">Your payment information is encrypted and secure</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        Add Payment Method
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddPayment(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent> */}

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      Transaction History
                    </CardTitle>
                    <CardDescription>View all your medical payments and transactions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium text-pretty">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                            <span className="text-muted-foreground">•</span>
                            <p className="text-sm text-muted-foreground">{transaction.paymentMethod}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-foreground"}`}>
                            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <Badge variant={getStatusColor(transaction.status)} className="text-xs">
                            {transaction.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Receipt className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
