"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import { useGetDoctorDetailPageQuery } from "@/features/users/userApi";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSlotsQuery } from "@/features/users/userApi";
import { useGetRelatedDoctorQuery } from "@/features/users/userApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAddRatingMutation } from "@/features/users/userApi";
import {
  Calendar,
  Clock,
  Star,
  MessageCircle,
  CheckCircle2,
  User,
} from "lucide-react";

import AddRatingModal from "@/components/common/AddRatingModal";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { toast, ToastContainer } from "react-toastify";
import { useFindDoctorRatingsQuery } from "@/features/users/userApi";

interface Ratings {
  doctorId: string;
  patinetId: { name: string; _id: string };
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserDoctorDetailsPage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const patient = useSelector((state: RootState) => state.auth.user);
  const patientId = patient?._id as string;
  const { data: doctor } = useGetDoctorDetailPageQuery(doctorId);

  const [rating, setRatings] = useState<Ratings[]>([]);
  const { data: ratings = [] } = useFindDoctorRatingsQuery(doctorId);

  useEffect(() => {
    if (ratings) {
      setRatings(ratings);
    }
  }, [ratings]);
  console.log("ratings data", rating);
  const { data = {} } = useGetRelatedDoctorQuery({
    doctorId,
    specialization: doctor?.qualifications?.specialization,
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const relatedDoctor = data?.relatedDoctor || [];
  const { data: slots = [] } = useGetSlotsQuery({
    doctorId,
    date: selectedDate || new Date().toISOString().split("T")[0],
  });

  type Slot = {
    _id: string;
    doctorId: string;
    date: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    status: string;
  };

  const groupSlotsByDate = (slots: Slot[]) => {
    const grouped: { [key: string]: Slot[] } = {};
    slots.forEach((slot) => {
      if (!grouped[slot.date]) grouped[slot.date] = [];
      grouped[slot.date].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupSlotsByDate(slots);

  const handleCheckout = (doctorId: string) => {
    navigate("/checkout-page", {
      state: {
        doctorId: doctorId,
        slotTime: selectedSlot,
      },
    });
  };

  const handleDoctorDetailsPage = (doctorId: string) => {
    navigate(`/doctor-details/${doctorId}`);
  };

  const [addRating] = useAddRatingMutation();
  const handleRatingSubmit = async (rating: number, review: string) => {
    if (review === "") return;
    console.log("doctor id and patient id", doctorId, patientId);
    const res = await addRating({
      doctorId,
      patientId,
      rating,
      review,
    }).unwrap();
    toast.success(res.msg);

    setRatings((prev) => [
      {
        doctorId: doctorId!,
        patinetId: { name: patient?.name, _id: patientId },
        rating: rating,
        comment: review,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ...prev, 
    ]);
  };

  interface StarRatingProps {
    value : string | number;
  }
  const StarRating:React.FC<StarRatingProps> =  ({ value }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 transition-colors ${
              star <= Number(value)? "fill-amber-400 text-amber-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-16">
        {/* Doctor Profile Card */}
        <Card className="border border-gray-200 shadow-sm mb-8 rounded-2xl bg-white">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={doctor?.profile_img || "/placeholder.svg"}
                    alt={doctor?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-semibold text-gray-900">
                        {doctor?.name}
                      </h1>
                      <Badge className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-lg text-gray-600">
                        {doctor?.qualifications?.degree},{" "}
                        {doctor?.qualifications?.specialization}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-gray-900 font-medium">
                            {doctor?.avgRating}
                          </span>
                          <span className="text-gray-500">
                            ({doctor?.totalRating} reviews)
                          </span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Available today</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-gray-200"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600 leading-relaxed">
                    {doctor?.qualifications?.about}
                  </p>

                  <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                    <span className="text-sm text-gray-600">
                      Consultation Fee:
                    </span>
                    <span className="text-2xl font-semibold text-blue-600">
                      ₹{doctor?.qualifications?.fees}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Book Appointment Card */}
        <Card className="border border-gray-200 shadow-sm mb-8 rounded-2xl bg-white">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                  Book Appointment
                </h2>
                <p className="text-gray-600">
                  Select your preferred date and time
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Select Date
                </label>
                <input
                  type="date"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="rounded-full">
                  
                </Button>

                <div className="flex gap-3 overflow-x-auto pb-2 flex-1">
                  {Object.keys(groupedSlots).map((day) => {
                    const dateObj = new Date(day);
                    const formattedDay = dateObj.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    });

                    return (
                      <Button
                        key={day}
                        variant={selectedDate === day ? "default" : "outline"}
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedSlot(null);
                        }}
                        className={`flex flex-col items-center p-4 h-auto min-w-20 rounded-xl ${
                          selectedDate === day
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {formattedDay}
                        </span>
                      </Button>
                    );
                  })}
                </div>

                <Button variant="ghost" size="icon" className="rounded-full">
                 
                </Button>
              </div>

              {selectedDate && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">
                      Available Times
                    </span>
                    <span className="text-sm text-gray-500">
                      ({groupedSlots[selectedDate]?.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {groupedSlots[selectedDate]?.map((slot) => (
                      <Button
                        key={`${slot.doctorId}-${slot.date}-${slot.startTime}`}
                        variant={
                          selectedSlot &&
                          selectedSlot.doctorId === slot.doctorId &&
                          selectedSlot.date === slot.date &&
                          selectedSlot.startTime === slot.startTime
                            ? "default"
                            : "outline"
                        }
                        onClick={() => setSelectedSlot(slot)}
                        className={`h-auto py-3 px-4 rounded-lg text-sm ${
                          selectedSlot &&
                          selectedSlot.doctorId === slot.doctorId &&
                          selectedSlot.date === slot.date &&
                          selectedSlot.startTime === slot.startTime
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="text-center">
                          {slot.startTime && slot.endTime && (
                            <>
                              <div className="font-medium">
                                {new Date(
                                  `1970-01-01T${slot.startTime}:00`
                                ).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </div>
                              <div className="text-xs opacity-70">
                                {new Date(
                                  `1970-01-01T${slot.endTime}:00`
                                ).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {selectedSlot && (
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleCheckout(doctor?._id)}
                    className="w-full py-4 text-base font-medium rounded-xl bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    Book Appointment -{" "}
                    {selectedSlot?.startTime &&
                      new Date(
                        `1970-01-01T${selectedSlot.startTime}:00`
                      ).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}{" "}
                    to{" "}
                    {selectedSlot?.endTime &&
                      new Date(
                        `1970-01-01T${selectedSlot.endTime}:00`
                      ).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ratings & Reviews Card - Only History */}
        <Card className="border border-gray-200 shadow-sm mb-8 rounded-2xl bg-white">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                    Ratings & Reviews
                  </h2>
                </div>

                {/* Add Rating Modal Component */}
                <AddRatingModal
                  doctorId={doctorId}
                  doctorName={doctor?.name}
                  onSubmit={handleRatingSubmit}
                />
              </div>

              {/* Rating Summary */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900">
                      {doctor?.avgRating}
                    </div>
                    <StarRating
                      value={Math.round(parseFloat(doctor?.avgRating))}
                    />
                    <div className="text-sm text-gray-600 mt-1">
                      Based on {doctor?.totalRating} reviews
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = rating.filter(
                        (r) => r.rating === star
                      ).length;
                      const percentage =
                        doctor?.totalRating > 0
                          ? (count / doctor?.totalRating) * 100
                          : 0;

                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-8">
                            {star}★
                          </span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {rating.map((rating) => (
                  <Card key={rating.id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {rating?.patientId?.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <StarRating value={rating.rating} />
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    rating.createdAt
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            {rating.comment}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Specialists Card */}
        <Card className="border border-gray-200 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                  Related Specialists
                </h2>
                <p className="text-gray-600">
                  Other qualified doctors in this specialty
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedDoctor?.map((doctor) => (
                  <Card
                    key={doctor._id}
                    className="border border-gray-200 hover:shadow-md transition-shadow rounded-xl"
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-100">
                        <img
                          src={
                            doctor?.profile_img ||
                            "/placeholder.svg?height=80&width=80"
                          }
                          alt={doctor?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900">
                          {doctor?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {doctor?.qualifications?.specialization}
                        </p>
                      </div>

                      <Button
                        onClick={() => handleDoctorDetailsPage(doctor?._id)}
                        className="w-full rounded-lg bg-white hover:bg-gray-50 text-blue-600 border border-blue-600"
                        variant="outline"
                      >
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <ToastContainer autoClose={200} />
      <Footer />
    </div>
  );
};

export default UserDoctorDetailsPage;
