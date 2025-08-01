import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  MapPin,
  Star,
  Clock,
  Calendar,
  Filter,
  Heart,
  Award,
  GraduationCap,
  Stethoscope,
} from "lucide-react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { useGetAllApprovedDoctorsQuery } from "@/features/users/userApi";
import { useNavigate } from "react-router-dom";
const specialties = [
  "All Specialties",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Neurologist",
  "Gastroenterologist",
];

export default function DoctorList() {
  const { data: doctors = [] } = useGetAllApprovedDoctorsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [sortBy, setSortBy] = useState("rating");

   
  const navigate = useNavigate()
  const filteredDoctors = doctors
    .filter((doctor) => {
      const matchesSearch =
        doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor?.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === "All Specialties" ||
        doctor.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "experience") return b.experience - a.experience;
      if (sortBy === "fee") return a.consultationFee - b.consultationFee;
      return 0;
    });
     
    const handleDoctorDetailsPage = async (doctorId:string)=>{
      console.log('passing doctor id',doctorId);
      navigate(`/doctor-details/${doctorId}`);
    }


  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
       
        <div className="pt-20"> 
          
        
          <div className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Find Your Doctor
                    </h1>
                    <p className="text-gray-600 mt-2">
                      Book appointments with top-rated healthcare professionals
                    </p>
                  </div>
                  <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                    <Stethoscope className="w-4 h-4" />
                    <span>{filteredDoctors.length} doctors available</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search doctors by name or specialty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={selectedSpecialty}
                      onValueChange={setSelectedSpecialty}
                    >
                      <SelectTrigger className="w-48">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
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

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <Card
                  key={doctor?.id}
                  className="hover:shadow-lg transition-shadow duration-200 bg-white"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={doctor?.profile_img || "/placeholder.svg"}
                            alt={doctor?.name}
                          />
                          <AvatarFallback>
                            {doctor?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">
                            Dr.{doctor?.name}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {doctor?.specialty}
                          </p>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm font-medium">
                              {doctor?.rating || 'N/A'}
                            </span>
                            <span className="ml-1 text-sm text-gray-500">
                              ({doctor?.reviews || 0} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        <span>{doctor?.qualifications?.medicalSchool || 'Medical School'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        <span>{doctor?.qualifications?.degree || 'Degree'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-2" />
                        <span>{doctor?.qualifications?.experince || doctor?.qualifications?.experience || 0} years experience</span>
                      </div>
                    </div>

                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Consultation Fee</p>
                        <p className="font-bold text-lg">
                          ₹{doctor?.qualifications?.fees || doctor?.consultationFee || 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={()=> handleDoctorDetailsPage(doctor?._id)}>
                          <Calendar className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results State */}
            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No doctors found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
}