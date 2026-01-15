import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, CreditCard, Wallet, CheckCircle } from "lucide-react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetDoctorAndSlotQuery } from "@/features/users/userApi";
import {
  useCreateOrderMutation,
  useVerifyOrderMutation,
  useWalletPaymentMutation,
} from "@/features/payment/paymentSlice";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [createOrder] = useCreateOrderMutation();
  const [verifyOrder] = useVerifyOrderMutation();
  const [walletPayment] = useWalletPaymentMutation();

  type Patient = {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  const patient: Patient | null = useSelector(
    (state: RootState) => state.auth.user
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!patient) {
      navigate("/login");
    }
  }, [patient, navigate]);

  const doctorId = location?.state?.doctorId ?? null;
  const time = location?.state?.slotTime ?? null;

  const { data = {} } = useGetDoctorAndSlotQuery({ doctorId });
  const doctor = data?.doctor ?? null;

  const total = Number(data?.doctor?.qualifications?.fees) + 100;

  // Helper function to format time
  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}:00`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const loadRazorpay = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (paymentMethod === "Online Payment") {
      try {
        const order = await createOrder(total).unwrap();

        const options: RazorpayOptions = {
          key: "rzp_test_REa5si7xp8OFdl",
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: "CareSlot",
          description: "Doctor Appointment Payment",
          handler: async function (response: RazorpayResponse) {
            try {
              await verifyOrder({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                doctorId,
                patientId: patient?._id,
                date: time?.date,
                startTime: time?.startTime,
                endTime: time?.endTime,
                amount: total,
                paymentMethod,
              }).unwrap();

              toast.success("Appointment booked successfully ✅");
              setTimeout(() => {
                navigate("/sessions");
              }, 3000);
            } catch (error) {
              const err = error as {
                data?: { message?: string; msg?: string };
                message?: string;
              };
              const message =
                err?.data?.message ||
                err?.data?.msg ||
                err?.message ||
                "Booking failed, please try again.";
              toast.error(message);
            }
          },
          prefill: {
            name: patient?.name || "",
            email: patient?.email || "",
            contact: patient?.phone || "",
          },
          theme: { color: "#3399cc" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        const err = error as {
          data?: { message?: string; msg?: string };
          message?: string;
        };
        const message =
          err?.data?.message ||
          err?.data?.msg ||
          err?.message ||
          "Something went wrong creating the order.";
        toast.error(message);
      }
    } else {
      // Wallet payment
      try {
        const payload = {
          doctorId,
          date: time?.date,
          startTime: time?.startTime,
          endTime: time?.endTime,
          patientId: patient?._id as string,
          amount: total,
        };

        await walletPayment(payload).unwrap();
        toast.success("Appointment booked successfully ✅");
        navigate("/sessions");
      } catch (error) {
        const err = error as {
          data?: { message?: string; msg?: string };
          message?: string;
        };
        const message =
          err?.data?.message ||
          err?.data?.msg ||
          err?.message ||
          "Wallet payment failed.";
        toast.error(message);
      }
    }
  };

  if (!doctorId) {
    return <div className="p-8">No doctor selected.</div>;
  }

  if (!data || !doctor) {
    return <div className="p-8">Loading appointment details...</div>;
  }

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
                      <img
                        src={doctor?.profile_img}
                        alt={`Dr. ${doctor?.name}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <Badge className="absolute -top-2 -right-2 bg-green-500">
                      ★ {doctor?.rating}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Dr. {doctor?.name}
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
                      <p className="text-gray-900">
                        {time?.date &&
                          new Date(time.date).toLocaleDateString([], {
                            month: "long",
                            day: "numeric",
                          })}
                        - {time?.dayOfWeek}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Time Slot
                      </p>
                      <p className="text-gray-900">
                        {time?.startTime && formatTime(time.startTime)} -{" "}
                        {time?.endTime && formatTime(time.endTime)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Duration
                      </p>
                      <p className="text-gray-900">30 minutes</p>
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
                      <RadioGroupItem
                        value="Online Payment"
                        id="online-payment"
                      />
                      <Label
                        htmlFor="online-payment"
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Online Payment</p>
                          <p className="text-sm text-gray-500">
                            Pay securely via Razorpay
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
                          <p className="font-medium">Wallet Payment</p>
                          <p className="text-sm text-gray-500">
                            Use your wallet balance
                          </p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
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
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">₹{total}</span>
                </div>

                <div className="pt-4 space-y-3">
                  <Button className="w-full" size="lg" onClick={loadRazorpay}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm & Pay ₹{total}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                    </div>
                    Secure payment powered by SSL encryption
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">What&apos;s included:</h4>
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
      <ToastContainer autoClose={500} />
      <Footer />
    </div>
  );
}
