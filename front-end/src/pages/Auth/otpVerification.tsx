import { useLocation, useNavigate } from "react-router-dom";
import VerificationOTP from "@/components/common/OTPVerification";

import { useVerifyOtpMutation } from "@/features/auth/authApi";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";

import { setCredentialsDoctor } from "@/features/docotr/doctorSlice";
import { useEffect } from "react";
import type { AppDispatch } from "@/app/store";
import { handleApiError } from "@/utils/handleApiError";

const OTPVerification = () => {
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const loaction = useLocation();
  const navigate = useNavigate();
  const email = loaction?.state?.email;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email,navigate]);

  const handleSubmit = async (otp: string) => {
    try {
      const res = await verifyOtp({ email, otp }).unwrap();
      // toast.success('response');
      console.log('response from back end',res);
      const role = res.role;
      if (role === "patients") {
        navigate("/login");
      } else if (role === "doctors") {
        dispatch(
          setCredentialsDoctor({
            doctor: res?.user,
            role: res?.role,
          })
        );
        navigate("/kyc-submit");
      }
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

export default OTPVerification;
