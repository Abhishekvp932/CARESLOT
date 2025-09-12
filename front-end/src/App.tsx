
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
import Dashboard from "./pages/Admin/Dashboard"
import UsersList from "./pages/Admin/UsersList"
import { AdminLayout } from "./layout/admin/AdminLayout"
import DoctorsList from "./pages/Admin/DoctorsList"
import VerificationList from "./pages/Admin/verificationList"
import UserProfile from "./pages/User/userProfile"
import { UserLayout } from "./layout/user/userLayout"
import DoctorDetails from "@/pages/Admin/PendingDoctorDetailsPage";
import DoctorEditPage from "./pages/Admin/DoctorEditPage"
import AddDoctorPage from "./pages/Admin/AddDoctor"
import DoctorDetailsPage from "./pages/Admin/DoctorDetails"
import DoctorDashboard from "./pages/Doctor/Dashboard"
import DoctorProfile from "./pages/Doctor/DoctorProfile"
import TimeShedule from "./pages/Doctor/TimeShedule"
import DoctorList from "./pages/User/DoctorList"
import UserDoctorDetailsPage from "./pages/User/DoctorDetailsPage"
import CheckoutPage from "./pages/User/checkoutPage"
// import PublicOnlyRoute from "./protectRoute/PublicOnlyRoute"
import ChangePasswordPage from "./pages/User/changePasswordPage"
import AppointmentsListDoctor from "./pages/Doctor/Appoinments"
import { SessionCard } from "./pages/User/session"
import { AppointmentHistory } from "./pages/Admin/Appoinment"
import UserWallet from "./pages/User/Wallet"
function App() {

  return (
    <div>
     <Routes>
      {/* auth  and user*/}
        <Route path="/" element = {<UserHome/>} />
        <Route path="/login" element = {<Login/>}/>
        <Route path="/signup" element=  {<Signup/>}/>
        <Route path="/otp-verification" element = {<OtpVerification/>}/>
        <Route path="/email-verification" element = {<EmailValidation/>}/>
        <Route path="/verify-email" element = {<VerifyEmail/>}/>
        <Route path="/forgot-password" element = {<ForgotPassword/>}/>
        <Route path="/profile" element = {<UserLayout><UserProfile/></UserLayout>}/>
        <Route path="/doctors" element = {<DoctorList/>}/>
        <Route path = "/doctor-details/:doctorId" element = {<UserDoctorDetailsPage/>}/>
        <Route path = "/checkout-page" element = {<CheckoutPage/>}/>
        <Route path="/change-password/:userId" element={<ChangePasswordPage/>}/>
        <Route path = '/sessions' element={<UserLayout><SessionCard/></UserLayout>}/>
        <Route path='/wallet' element = {<UserLayout><UserWallet/></UserLayout>}/>
        <Route path="/kyc-submit" element ={
          <KYC/>
          }
          />
          <Route path="/kyc-success" element = {<DocumentSubmitted/>}/>
          {/* admin */}
          <Route path="/admin" element={<AdminLayout><Dashboard/> </AdminLayout>}/>
          <Route path="/admin/users" element={<AdminLayout><UsersList/> </AdminLayout>}/>
           <Route path="/admin/doctors" element={<AdminLayout><DoctorsList/> </AdminLayout>}/>
           <Route path="/admin/pending-verification" element={<AdminLayout><VerificationList/> </AdminLayout>}/>
           <Route path="/admin/verification-details/:doctorId" element = {<DoctorDetails/>}/>
           <Route path="/admin/doctor-edit/:doctorId" element = {<DoctorEditPage/>}/>
           <Route path="/admin/add-doctors" element = {<AddDoctorPage/>}/>
           <Route path="/admin/doctor-details/:doctorId" element = {<DoctorDetailsPage/>}/>
           <Route path="/admin/appoinments" element = {<AdminLayout><AppointmentHistory/></AdminLayout>}/>

           {/* doctor */}

           <Route path="/doctor" element = {<DoctorDashboard/>}/>
           <Route path="/doctor/profile" element = {<DoctorProfile/>}/>
           <Route path="/doctor/time-shedule" element = {<TimeShedule/>}/>
           <Route path="/doctor/appoinment" element = {<AppointmentsListDoctor/>}/>
     </Routes>
   </div>
  )
}

export default App