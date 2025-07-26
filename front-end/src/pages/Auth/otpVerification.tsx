import { useLocation, useNavigate } from "react-router-dom";
import VerificationOTP from "@/components/common/OTPVerification";

import { useVerifyOtpMutation } from "@/features/auth/authApi";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch} from "react-redux";

import { setCredentialsDoctor } from "@/features/docotr/doctorSlice";
import { useEffect } from "react";
import type { AppDispatch} from "@/app/store";

const OTPVerification = () => {
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const loaction = useLocation();
  const navigate = useNavigate();
  const email = loaction?.state?.email;
  const dispatch = useDispatch<AppDispatch>()

useEffect(()=>{
  if(!email){
    navigate('/signup')
  }
},[])

  const handleSubmit = async (otp: string) => {
    try {
      const res = await verifyOtp({ email, otp }).unwrap();
      // toast.success('response');
      console.log('response',res.user)
       const role = res.role
      if(role === 'patients'){
          navigate("/login");
      }else if(role === 'doctors'){
               dispatch(
               setCredentialsDoctor({
                 doctor: res?.user,
                 role: res?.role,
                 token : res?.token,
               })
              );
       navigate('/kyc-submit')
      }      
    } catch (error: any) {
      console.log("OTP Error", error);
      if (error?.data?.msg) {
        toast.error(error.data.msg);
      } else {
        toast.error("OTP verification error");
      }
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
