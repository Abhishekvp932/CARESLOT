
import { Routes,Route } from "react-router-dom"
import UserHome from './pages/User/Home'
import Login from "./pages/Auth/Login"
import Signup from "./pages/Auth/Signup"
import OtpVerification from "./pages/Auth/otpVerification"
import EmailValidation from "./pages/Auth/emailVerification"
import VerifyEmail from "./pages/Auth/verifyEmail"
import ForgotPassword from "./pages/Auth/forgotPassword"
import KYC from "./pages/Auth/KycForm"
// import ProtectDoctorRoute from "./components/routeProtect/doctorRoute"
import DocumentSubmitted from "./pages/Doctor/document.submited"
import EnteryPage from "./pages/Admin/EnteryPage"
function App() {
  return (
    <div>
     <Routes>
        <Route path="/" element = {<UserHome/>} />
        <Route path="/login" element = {<Login/>}/>
        <Route path="/signup" element=  {<Signup/>}/>
        <Route path="/otp-verification" element = {<OtpVerification/>}/>
        <Route path="/email-verification" element = {<EmailValidation/>}/>
        <Route path="/verify-email" element = {<VerifyEmail/>}/>
        <Route path="/forgot-password" element = {<ForgotPassword/>}/>
        <Route path="/kyc-submit" element ={
          <KYC/>
          }
          />
          <Route path="/kyc-success" element = {<DocumentSubmitted/>}/>
          <Route path="/admin" element={<EnteryPage/>}/>
     </Routes>
   </div>
  )
}

export default App