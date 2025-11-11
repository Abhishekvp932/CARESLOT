import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Star,
  Calendar,
  Filter,
  Award,
  GraduationCap,
  Stethoscope,

  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { useGetAllApprovedDoctorsQuery } from "@/features/users/userApi";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/common/user/pagination";
import { useGetAllSpecializationsQuery } from "@/features/users/userApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { ToastContainer } from "react-toastify";

export default function DoctorList() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("rating");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSpecialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(false);

  const limit = 10;
  const navigate = useNavigate();
    const patient = useSelector(
      (state: RootState) => state.auth.user
    );
  
    useEffect(()=>{
      if(!patient){
        navigate('/login')
      }
    },[patient]);

  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setLoading(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data = {}, isFetching } = useGetAllApprovedDoctorsQuery({
    page,
    limit,
    search: debouncedSearch,
    specialty: selectedSpecialty,
    sortBy:sortBy,
  });
  const { data: specializations = [] } = useGetAllSpecializationsQuery({});
  
  const doctors = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const isLoading = loading || isFetching;

  
  const handleDoctorDetailsPage = async (doctorId: string) => {
    navigate(`/doctor-details/${doctorId}`);
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  
  interface DoctorDTO {
    _id?: string;
    email?: string;
    isBlocked?: boolean;
    isApproved?: boolean;
    name?: string;
    DOB?: Date;
    gender?: 'male' | 'female' | 'others';
    role?: 'doctors';
    updatedAt?: Date;
    createdAt?: Date;
    profile_img?: string;
    qualifications?: {
      degree?: string;
      institution?: string;
      experince?:number;
      educationCertificate?: string;
      experienceCertificate?: string;
      graduationYear?: number;
      specialization?: string;
      medicalSchool?: string;
      about?: string;
      fees?: number;
      lisence?: string;
    };
    totalRating?:number;
    avgRating?:number;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/50 to-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Stethoscope className="w-4 h-4" />
              <span>{doctors.length} Expert Doctors Available</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold">
              Find Your Perfect Doctor
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Connect with top-rated healthcare professionals and book your appointment today
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by doctor name or specialty..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-12 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedSpecialty} onValueChange={setSpecialty}>
                  <SelectTrigger className="w-full sm:w-56 h-12 border-gray-200 text-gray-900">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Specializations" className="text-gray-900" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Specialties">All Specializations</SelectItem>
                    {specializations?.map((sp:string) => (
                      <SelectItem key={sp} value={sp}>
                        {sp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 h-12 border-gray-200 text-gray-900">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <SelectValue className="text-gray-900" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                    <SelectItem value="fee">Lowest Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 font-medium">Finding the best doctors for you...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {doctors.length === 0 ? (
              <div className="text-center py-20">
                <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Available Doctors</h2>
                    <p className="text-gray-600 mt-1">Showing {doctors.length} results</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {doctors.map((doctor:DoctorDTO) => (
                    <Card
                      key={doctor?._id}
                      className="group hover:shadow-2xl transition-all duration-300 bg-white border-2 hover:border-blue-200 overflow-hidden"
                    >
                      <CardHeader className="pb-4 bg-gradient-to-br from-blue-50 to-white">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                              <AvatarImage
                                src={doctor?.profile_img || "/placeholder.svg"}
                                alt={doctor?.name}
                              />
                              <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                                {doctor?.name?.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-gray-900 truncate">
                              Dr. {doctor?.name}
                            </h3>
                            <Badge className="bg-blue-600 hover:bg-blue-700 text-white mt-1">
                              {doctor?.qualifications?.specialization || "General Physician"}
                            </Badge>
                            
                            <div className="flex items-center mt-2 gap-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(doctor?.avgRating || 0)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-200 text-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-semibold text-gray-700 ml-1">
                                {doctor?.avgRating || "N/A"}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({doctor?.totalRating || 0})
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4 pt-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 text-sm">
                            <GraduationCap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {doctor?.qualifications?.degree || "Medical Degree"}
                              </p>
                              <p className="text-gray-600 text-xs">
                                {doctor?.qualifications?.medicalSchool || "Medical School"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm">
                            <Award className="w-5 h-5 text-blue-600 shrink-0" />
                            <span className="text-gray-700">
                              <span className="font-semibold text-gray-900">
                                {doctor?.qualifications?.experince || 0}+ years
                              </span>{" "}
                              experience
                            </span>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                              Consultation Fee
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              ₹{doctor?.qualifications?.fees || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDoctorDetailsPage(doctor?._id as string)}
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Calendar className="w-4 h-4 mr-1" />
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-12">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Footer />
         <ToastContainer autoClose={2000} />
    </div>
  );
}