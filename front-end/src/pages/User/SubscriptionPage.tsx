

import { Button } from "@/components/ui/button";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { CheckCircle } from "lucide-react";
import { useGetAllActiveSubscriptionQuery } from "@/features/users/userApi";
import { useCreateOrderMutation } from "@/features/payment/paymentSlice";
import { toast, ToastContainer } from "react-toastify";
import { handleApiError } from "@/utils/handleApiError";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useNavigate } from "react-router-dom";
import { useVerifySubscriptionPlanPaymentMutation } from "@/features/payment/paymentSlice";
interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  discountAmount: number;
  durationInDays: number;
}

type PlanId = "1" | "2" | "3";

const planStyles: Record<
  string,
  {
    bgGradient: string;
    borderColor: string;
    accentColor: string;
    lightBg: string;
  }
> = {
  Silver: {
    bgGradient: "from-gray-50 to-gray-100",
    borderColor: "border-gray-200",
    accentColor: "bg-gray-400",
    lightBg: "bg-gray-50",
  },
  Gold: {
    bgGradient: "from-amber-50 to-yellow-50",
    borderColor: "border-yellow-200",
    accentColor: "bg-yellow-400",
    lightBg: "bg-amber-50",
  },
  Platinum: {
    bgGradient: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
    accentColor: "bg-purple-500",
    lightBg: "bg-purple-50",
  },
};

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

export default function SubscriptionPage() {
  const { data = [] } = useGetAllActiveSubscriptionQuery(undefined);
  type Patient = {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  const patient: Patient | null = useSelector(
    (state: RootState) => state.auth.user
  );
  const plan = data || [];
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();
  const [verifySubscriptionPlanPayment] =
    useVerifySubscriptionPlanPaymentMutation();

  const handleRazorPay = async (plan: SubscriptionPlan) => {
    try {
      if (!patient) {
        navigate("/login");
        return;
      }
      const order = await createOrder(plan.price).unwrap();
      const paymentMethod = "Online Payment";
      const options: RazorpayOptions = {
        key: "rzp_test_REa5si7xp8OFdl",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "CareSlot",
        description: "Subscription Plan Payment",
        handler: async function (response: RazorpayResponse) {
          try {
            await verifySubscriptionPlanPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId:plan._id,
              patientId: patient?._id,
              amount: plan.price,
              paymentMethod,
            }).unwrap();

            toast.success("Appointment booked successfully ✅");
            setTimeout(() => {
              navigate("/");
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
      toast.error(handleApiError(error));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="mb-16 text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Choose Your Subscription Plan
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Select the perfect plan for your needs and get started today
        </p>
      </div>

      {/* Plans Grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plan.map((plan: SubscriptionPlan) => {
          const styles = planStyles[plan.name as PlanId];

          return (
            <div
              key={plan._id}
              className={`group relative flex flex-col rounded-2xl border-2 ${styles.borderColor} ${styles.lightBg} p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105`}
            >
              {/* Plan Name */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h2>
              </div>

              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    ₹{plan.price}
                  </span>
                  <span className="text-lg text-gray-600">per appointment</span>
                </div>
              </div>

              <div
                className={`mb-6 inline-flex w-fit rounded-full ${styles.accentColor} px-4 py-2`}
              >
                <span className="text-sm font-semibold text-white">
                  Get ₹{plan.discountAmount} off per appointment
                </span>
              </div>

              <div className="mb-8 flex items-center gap-2 text-gray-700">
                <CheckCircle
                  className={`h-5 w-5 ${styles.accentColor.replace(
                    "bg-",
                    "text-"
                  )}`}
                />
                <span className="text-sm font-medium">
                  Valid for {plan.durationInDays} days
                </span>
              </div>

              <Button
                className={`mt-auto w-full rounded-xl py-6 text-base font-semibold transition-all duration-300 ${styles.accentColor} text-white hover:opacity-90 active:scale-95`}
                onClick={() => handleRazorPay(plan)}
              >
                Buy Now
              </Button>
            </div>
          );
        })}
      </div>
      <Footer />
      <ToastContainer autoClose={200} />
    </main>
  );
}
