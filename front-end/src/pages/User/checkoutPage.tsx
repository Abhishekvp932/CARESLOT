"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  CreditCard,
  Wallet,
  CheckCircle,
} from "lucide-react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { useLocation } from "react-router-dom";

import { useGetDoctorAndSlotQuery } from "@/features/users/userApi";
   import { format} from 'date-fns';
export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    // Handle successful payment
  };

  const location = useLocation();
  const doctorId = location?.state?.doctorId ?? null;
  const slotId = location?.state?.slotId ?? null
  const { data = {} } = useGetDoctorAndSlotQuery({doctorId,slotId});
console.log('data',data)
  const doctor = data?.doctor ?? null;
  const slot = data?.slot ?? null;
 const total =  Number(data?.doctor?.qualifications?.fees) + 100

  if (!doctorId) {
  return <div className="p-8">No doctor selected.</div>;
}

if (!data || !doctor || !slot) {
  return <div className="p-8">Loading appointment details...</div>;
}


  console.log("docrto", doctor);
  console.log("slot", slot);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Header />
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Doctor Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-32 h-32 flex items-center justify-center">
                      <span className="text-6xl">
                        <img src={doctor?.profile_img} />
                      </span>
                    </div>
                    <Badge className="absolute -top-2 -right-2 bg-green-500">
                      ★ {doctor?.rating}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Dr.{doctor?.name}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      {doctor?.qualifications?.specialization}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {doctor?.qualifications?.experince} experience
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="text-gray-900">{format(new Date(slot?.date), 'MMMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Time Slot
                      </p>
                      <p className="text-gray-900">{format(new Date(slot?.startTime), 'hh:mm a')}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Duration
                      </p>
                      {format(new Date(slot?.startTime), 'hh:mm a')} - {format(new Date(slot?.endTime  ), 'hh:mm a')}
                    </div>
                    <div>
                      {/* <p className="text-sm font-medium text-gray-500">Appointment Type</p>
                      <Badge variant="outline">{mockBookingData.appointment.type}</Badge> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Credit/Debit Card</p>
                          <p className="text-sm text-gray-500">
                            Visa, Mastercard, American Express
                          </p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label
                        htmlFor="wallet"
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <Wallet className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Digital Wallet</p>
                          <p className="text-sm text-gray-500">
                            PayPal, Apple Pay, Google Pay
                          </p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="font-medium">
                      ₹{doctor?.qualifications?.fees}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium">₹100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">₹{total}</span>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm & Pay ₹ {total}
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                    </div>
                    Secure payment powered by SSL encryption
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">What's included:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Medical prescription (if needed)</li>
                    <li>• Follow-up recommendations</li>
                    <li>• Digital health record</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
