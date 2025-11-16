import EmailForm from "@/components/common/EmailForm";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useVerifyEmailMutation } from "@/features/auth/authApi";
import { handleApiError } from "@/utils/handleApiError";
const SendOTPPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [verifyEmail] = useVerifyEmailMutation();

  const handleForm = async () => {
    if (!email || !email.includes("@")) {
      setError("Please Enter valid email address");
      return;
    }
   
    try {
     
      const res = await verifyEmail({ email }).unwrap();
    
      toast.success(res.msg);
      setTimeout(() => {
        navigate("/verify-email", { state: { email } });
      }, 2000);
    } catch (error) {
       toast.error(handleApiError(error));
    }
  };

  return (
    <>
      <EmailForm
        email={email}
        onEmailChange={(val) => {
          setEmail(val);
          setError("");
        }}
        onSubmit={handleForm}
        error={error}
        title="Get Started with verification"
        buttonText="send code"
      />
      <ToastContainer autoClose={2000} />
    </>
  );
};

export default SendOTPPage;
