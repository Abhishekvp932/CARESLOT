import { useLocation, useNavigate } from "react-router-dom";
import VerificationOTP from "@/components/common/OTPVerification";

import { useVerifyEmailOTPMutation } from "@/features/auth/authApi";
import { toast, ToastContainer } from "react-toastify";
import { handleApiError } from "@/utils/handleApiError";

const VerifyEmail = () => {
  const [verifyEmailOTP, { isLoading }] = useVerifyEmailOTPMutation();
  const loaction = useLocation();
  const navigate = useNavigate();
  const email = loaction?.state?.email;

  const handleSubmit = async (otp: string) => {
    try {
      const res = await verifyEmailOTP({ email, otp }).unwrap();
      toast.success(res.msg);
      navigate("/forgot-password", { state: { email } });
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  return (
    <>
      <VerificationOTP
        email={email}
        onVerify={handleSubmit}
        isLoading={isLoading}
      />
      <ToastContainer autoClose={2000} />
    </>
  );
};

export default VerifyEmail;
