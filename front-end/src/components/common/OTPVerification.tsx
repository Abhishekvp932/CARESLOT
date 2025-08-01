
import { Shield, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/common/SubmitButton";
import { toast,ToastContainer } from "react-toastify";
import { useResendOTPMutation } from "@/features/auth/authApi";
import { useNavigate } from "react-router-dom";
interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  isLoading: boolean;
  title?: string;
  message?: string;
}

const VerificationOTP: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  isLoading,
  title = "Verify Your Email",
  message = "We've sent a 6-digit verification code to",
}) => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
 const [timeLeft,setTimeLeft] = useState(60)
 const [resendDisabled,setResendDisabled] = useState(true);

 const [resendOTP] = useResendOTPMutation()

 useEffect(()=>{
  let timer : NodeJS.Timeout

  if(resendDisabled && timeLeft > 0){
    timer = setInterval(()=>{
     setTimeLeft((prev) =>{
       if(prev === 1){
          setResendDisabled(false);
          clearInterval(timer)
          return 0
        }
        return prev - 1
     });
    },1000);
  }
  return ()=> clearInterval(timer)
 },[resendDisabled,setTimeLeft]);
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackSpace = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please Enter all 6 digits.");
      return;
    }
    await onVerify(fullOtp);
  };

  const handleResnedOtp = async()=>{

    setResendDisabled(true)
    setTimeLeft(60);
    setOtp(Array(6).fill(""));
   
     try {
      
       const res = await resendOTP({email}).unwrap()
       
       toast.success(res.msg)    
     } catch (error : any) {
      
    if (error?.data?.msg) {
      toast.error(error.data.msg);
    } 
     }
  }

  const handleBack = ()=>{
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            {message}
            <br />
            <span className="font-semibold text-gray-800">{email}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex justify-center space-x-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleBackSpace(e, index)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 hover:border-gray-300"
                placeholder="0"
              />
            ))}
          </div>
          <SubmitButton
            label="Verify & Continue"
            onClick={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        
        <div className="text-center">
          <div className="flex items-center justify-center text-gray-600 mb-4">
            <Clock className="w-4 h-4 mr-2" />
            {resendDisabled ? (
               <span className="text-sm">
              Resend code in <span className="font-semibold text-blue-600">{timeLeft}</span>
            </span>
            ):(
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors mb-4" onClick={handleResnedOtp}>
                Resend verification code
                </button>
            )}
       
          </div>

          <p className="text-xs text-gray-500">
            Didn't receive the code? Check your spam folder or{" "}
            <a href="" className="text-blue-600 hover:text-blue-700 font-medium" onClick={handleBack}>
              change your email address
            </a>
          </p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-800 mb-1">
                Secure Verification
              </h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                This helps us verify your identity and secure your medical
                appointments. Your privacy is our priority.
              </p>
            </div>
          </div>
        </div>
      </div>
        <ToastContainer autoClose={2000} />
    </div>
  );
};

export default VerificationOTP;
