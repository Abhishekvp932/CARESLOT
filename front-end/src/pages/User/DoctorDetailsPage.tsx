"use client";

import { useState } from "react";
import { Star, MapPin, Clock, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { useParams } from "react-router-dom";
import { useGetDoctorDetailPageQuery } from "@/features/users/userApi";
export default function UserDoctorDetailsPage() {
  const [selectedTime, setSelectedTime] = useState("");

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];
  const { doctorId } = useParams<{ doctorId: string }>();
  console.log("doctor id is", doctorId);
  const { data: doctors } = useGetDoctorDetailPageQuery(doctorId);
  console.log("doctors", doctors);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-blue-100 mx-auto md:mx-0 flex-shrink-0">
                  <img
                    src={doctors?.profile_img}
                    alt="Doctor"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {doctors?.name}
                  </h1>
                  <p className="text-blue-600 font-medium text-lg mb-3">
                    {doctors?.qualifications?.specialization}
                  </p>

                  {/* <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                     0
                    </span>
                  </div> */}

                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <Badge variant="secondary">
                      {doctors?.qualifications?.experince} years exp
                    </Badge>
                    <Badge variant="secondary">
                      {doctors?.qualifications?.specialization}
                    </Badge>
                    <Badge variant="secondary">Board Certified</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">About Doctor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {doctors?.qualifications?.about}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      {doctors?.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      Mon-Fri: 9AM-5PM
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center bg-blue-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">₹{doctors?.qualifications?.fees}</p>
                  <p className="text-sm text-gray-600">Consultation Fee</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">
                    Available Today
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="h-10"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                  disabled={!selectedTime}
                >
                  {selectedTime
                    ? `Book for ${selectedTime}`
                    : "Select Time Slot"}
                </Button>

                <div className="text-center text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                  <p className="flex items-center justify-center gap-1">
                    <span className="text-green-600">✓</span> Instant
                    confirmation
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <span className="text-green-600">✓</span> Free cancellation
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Patient Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      John Smith
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    "Excellent doctor! Very professional and explained
                    everything clearly. Highly recommend."
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      Maria Garcia
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    "Dr. Johnson is amazing. She took time to listen and
                    provided great care."
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      David Lee
                    </span>
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                    </div>
                    <span className="text-xs text-gray-500">2 weeks ago</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    "Great experience overall. The appointment was on time and
                    very helpful."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>

      <Footer />
    </div>
  );
}
