import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";



interface Props {
    children:JSX.Element;
}
const ProtectDoctorRoute = ({children}:Props)=>{
    const {token,doctor,isKycSubmited} = useSelector((state:RootState)=> state.doctor)

    if(!token || !doctor) return <Navigate to = '/login'/>

        if(!isKycSubmited) return <Navigate to = '/kyc-submit'/>


    return children
}

export default ProtectDoctorRoute;