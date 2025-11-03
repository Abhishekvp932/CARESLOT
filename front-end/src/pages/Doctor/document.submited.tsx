
import { CheckCircle } from "lucide-react";
import {logOut} from '../../features/docotr/doctorSlice'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SubmitButton } from "@/components/common/SubmitButton";
const DocumentSubmitted = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleLogin = ()=>{
       dispatch(logOut());
       navigate('/login');
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Documents Submitted!</h2>
        <p className="text-gray-700 mb-4">
          Thank you for submitting your qualification and experience documents.
        </p>
        <p className="text-gray-600">
          Our team will now review your submission. You'll receive a notification once your profile is approved.
        </p>
        <SubmitButton label="Back to login" onClick={handleLogin}/>
      </div>
    </div>
  );
};

export default DocumentSubmitted;
