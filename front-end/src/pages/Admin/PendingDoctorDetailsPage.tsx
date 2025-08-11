
import { useParams,useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDoctorApproveMutation } from "@/features/admin/adminApi";
import { useDoctorRejectMutation } from "@/features/admin/adminApi";
import {toast,ToastContainer} from 'react-toastify'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Phone,
  Mail,
  Calendar,
  Award,
  GraduationCap,
  Users,

  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  FileText,
  Banknote,
  Eye,
} from "lucide-react";
import BackButton from "@/layout/admin/backButton";
import { useGetDoctorDataQuery } from "@/features/admin/adminApi";
import { useState } from "react";
import RejectionReasonModal from "@/components/common/admin/rejectionReasonModal";
const DoctorDetails = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams<{ doctorId: string }>();
   const [isOpen,setIsOpen] = useState(false);
   const [selectedDoctorId,setSelectedDoctorId] = useState<string | null>(null);
  const { data: doctor } = useGetDoctorDataQuery(doctorId);
   console.log('doctors',doctor);
 const [doctorApprove] = useDoctorApproveMutation();
const [doctorReject] = useDoctorRejectMutation();

  const handleApprove = async(doctorId:string)=>{
       try {
      const res = await doctorApprove({ doctorId }).unwrap();
        toast.success(res?.msg);
        setTimeout(()=>{
          navigate('/admin/doctors');
        },1000)
       } catch (error:any) {
         
      if (error?.data?.msg) {
        toast.error(error.data.msg);
      } else {
        toast.error("Doctor approve error");
      }
       }
  }

  const handleReject = async (doctorId:string,reason:string)=>{
    try {
      const res = await doctorReject({ doctorId,reason }).unwrap();
      console.log('res',res);
      toast.success(res?.msg);
        setTimeout(()=>{
          navigate('/admin/pending-verification');
        },1000)
    } catch (error:any) {
        
      if (error?.data?.msg) {
        toast.error(error.data.msg);
      } else {
        toast.error("Doctor rejection error");
      }
    }
  }


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <BackButton />

      <div className="container mx-auto px-4 py-8">
     
        {!doctor?.isApproved && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-amber-800 font-medium">Pending Verification</p>
              <p className="text-amber-700 text-sm">This doctor profile requires admin approval</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
           
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-white to-blue-50/30">
              <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500"></div>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="relative">
                    <Avatar className="w-36 h-36 mx-auto md:mx-0 ring-4 ring-white shadow-2xl">
                      <AvatarImage src={doctor?.profile_img} className="object-cover" />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {doctor?.name?.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {doctor?.isApproved && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                      Dr. {doctor?.name}
                    </h1>
                    <p className="text-2xl text-blue-600 font-semibold mb-4">
                      {doctor?.qualifications?.specialization}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="font-medium text-gray-700">
                          {doctor?.qualifications?.experince} experience
                        </span>
                       
                      </div>
                       <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                         <Banknote  className="w-5 h-5 text-blue-500"/>
                         <span className="font-medium text-gray-700">
                          ₹{doctor?.qualifications?.fees}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1">
                        {doctor?.qualifications?.specialization}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
                <CardTitle className="text-2xl text-gray-800">
                  <FileText className="w-6 h-6 inline mr-3 text-blue-600" />
                  About Dr. {doctor?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {doctor?.qualifications.about}
                </p>
              </CardContent>
            </Card>

           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-gray-800">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    Educational Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Award className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">Degree</p>
                        <p className="text-gray-600">{doctor?.qualifications?.degree}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Building className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">Institution</p>
                        <p className="text-gray-600">{doctor?.qualifications?.institution}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">Medical School</p>
                        <p className="text-gray-600">{doctor?.qualifications?.medicalSchool}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-indigo-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">Graduation Year</p>
                        <p className="text-gray-600">{doctor?.qualifications?.graduationYear}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-gray-800">
                    <Award className="w-6 h-6 text-green-600" />
                    Certifications & Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                                     <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">Education Certificate</h4>
                        <Badge variant="outline" className="text-xs">
                          Issued {doctor?.issueDate || "2023"}
                        </Badge>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="cursor-pointer group relative">
                            <img
                              src={doctor?.qualifications?.educationCertificate || "/api/placeholder/300/200"}
                              alt="Education Certificate"
                              className="w-full h-32 object-cover rounded-lg border group-hover:opacity-90 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                              <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              Click to view full certificate
                            </p>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Education Certificate</DialogTitle>
                          </DialogHeader>
                          <img
                            src={doctor?.qualifications?.educationCertificate}
                            alt="Education Certificate"
                            className="w-full h-auto rounded-lg border"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>

                   
                    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">Experience Certificate</h4>
                        <Badge variant="outline" className="text-xs">
                          Issued {doctor?.issueDate || "2023"}
                        </Badge>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="cursor-pointer group relative">
                            <img
                              src={doctor?.qualifications?.experienceCertificate || "/api/placeholder/300/200"}
                              alt="Experience Certificate"
                              className="w-full h-32 object-cover rounded-lg border group-hover:opacity-90 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                              <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              Click to view full certificate
                            </p>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Experience Certificate</DialogTitle>
                          </DialogHeader>
                          <img
                            src={doctor?.qualifications?.experienceCertificate}
                            alt="Experience Certificate"
                            className="w-full h-auto rounded-lg border"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          
          <div className="space-y-8">
            <Card className="sticky top-6 border-0 shadow-xl">
 
             
                <div className="p-6">
                  <div className="text-center mb-6">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Pending Approval</h3>
                    <p className="text-gray-600">Review doctor credentials and approve or reject this application</p>
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg" onClick={()=> handleApprove(doctor._id)}>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Approve
                    </Button>
                    <Button variant="destructive" className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg" onClick={()=>{
                      setIsOpen(true);
                      setSelectedDoctorId(doctor?._id);
                    }}>
                      <XCircle className="w-5 h-5 mr-2" />
                      Reject
                    </Button>
                    <RejectionReasonModal open={isOpen}  title="Rejection Reason" onOpenChange={setIsOpen} onSave={(reason)=>{
                      if(selectedDoctorId){
                        handleReject(selectedDoctorId,reason);
                      }
                    }}/>
                  </div>
                </div>  
            
            </Card>

            {/* Contact Info Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-t-lg">
                <CardTitle className="text-gray-800">
                  <Phone className="w-5 h-5 inline mr-3 text-teal-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-800">{doctor?.phone || "+1 (555) 123-4567"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-800">{doctor?.email || "doctor@example.com"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ToastContainer autoClose= {200}/>
    </div>
  );
};

export default DoctorDetails;