import React, { useState } from "react";

import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import { useGetDoctorDetailPageQuery } from "@/features/users/userApi";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSlotsQuery } from "@/features/users/userApi";
import { useGetRelatedDoctorQuery } from "@/features/users/userApi";
import { format } from "date-fns";

const UserDoctorDetailsPage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  console.log("doctorId", doctorId);
  const { data: doctor } = useGetDoctorDetailPageQuery(doctorId);
  console.log("doctor", doctor);
  const { data = {} } = useGetRelatedDoctorQuery({
    doctorId,
    specialization: doctor?.qualifications?.specialization,
  });
  // console.log('sppppp',doctor?.qualifications?.specialization,);
  const relatedDoctor = data?.relatedDoctor || [];
  const { data: slots = [] } = useGetSlotsQuery(doctorId);
  console.log("slots", slots);

  type Slot = {
    _id: string;
    doctorId: string;
    date: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    status: string;
  };

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const groupSlotsByDate = (slots: Slot[]) => {
    const grouped: { [key: string]: Slot[] } = {};

    slots.forEach((slot) => {
      if (!grouped[slot.dayOfWeek]) grouped[slot.dayOfWeek] = [];
      grouped[slot.dayOfWeek].push(slot);
    });

    return grouped;
  };

  const groupedSlots = groupSlotsByDate(slots);
  console.log('selected slot',selectedSlot);
  console.log('selected',selectedDate); 
  const handleCheckout = (doctorId: string) => {
    console.log("doctoottid", doctorId);
    navigate("/checkout-page", {
      state: {
        doctorId: doctorId,
        slotTime:selectedSlot,
      },
    });
  };

  const handleDoctorDetailsPage = (doctorId: string) => {
    navigate(`/doctor-details/${doctorId}`);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 flex items-center justify-center">
                <span className="text-6xl">
                  <img src={doctor?.profile_img} alt={doctor?.name} />
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {doctor?.name}
                </h2>
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <p className="text-black font-medium mb-2">
                {doctor?.qualifications?.degree},
                {doctor?.qualifications?.specialization}
              </p>
              <p className="text-gray-600 mb-2">Reviews(0)</p>
              <p className="text-gray-700 mb-4 max-w-2xl">
                {doctor?.qualifications?.about}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Appointment Fee:</span> ₹
                {doctor?.qualifications?.fees}
              </p>
            </div>

            <div className="flex-shrink-0">
              <button className="bg-blue-100 text-black p-3 rounded-full hover:bg-blue-200">
                <span className="text-xl">💬</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6">Booking slots</h3>

          <div className="flex items-center justify-between mb-6">
            <button className="p-2 hover:bg-gray-100 rounded-full"></button>
            <div className="flex gap-2 overflow-x-auto">
              {Object.keys(groupedSlots).map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDate(day);
                    setSelectedSlot(null);
                  }}
                  className={`flex flex-col items-center p-3 rounded-lg min-w-16 transition-all duration-200 ${
                    selectedDate === day
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <span className="text-sm">{day}</span>
                </button>
              ))}
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full"></button>
          </div>

          {selectedDate && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
              {groupedSlots[selectedDate]?.map((slot) => (
              <button
                key={`${slot.doctorId}-${slot.date}-${slot.startTime}`} 
                onClick={() => setSelectedSlot(slot)}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  selectedSlot &&
                  selectedSlot.doctorId === slot.doctorId &&
                  selectedSlot.date === slot.date &&
                  selectedSlot.startTime === slot.startTime
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {slot.startTime} - {slot.endTime}
              </button>

              ))}
            </div>
          )}

          {selectedSlot && (
            <button
              className="w-full mt-6 bg-black text-white py-3 rounded-md font-medium"
              onClick={() => handleCheckout(doctor?._id)}
            >
              Book an Appointment
              -
              {selectedSlot.startTime} - {selectedSlot.endTime}
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-2">Related Doctors</h3>
          <p className="text-gray-600 mb-6">
            Browse through our best doctors for you
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {relatedDoctor?.map((doctor) => (
              <div
                key={doctor._id}
                className="text-center flex flex-col items-center p-4 border rounded-lg shadow-sm"
              >
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                  <img
                    src={doctor?.profile_img || "/default-profile.png"}
                    alt={doctor?.name}
                    className="w-20 h-20 object-cover rounded-full"
                  />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {doctor?.name}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {doctor?.qualifications?.specialization}
                </p>

                <button
                  className="mt-auto bg-black hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium"
                  onClick={() => {
                    handleDoctorDetailsPage(doctor?._id);
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-2 text-center">What our patient say</h3>
          <p className="text-gray-600 mb-8 text-center">World class care for everyone. Our health system offers unmatched expert health care.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={`p-6 rounded-lg `}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-2xl"></span>
                  </div>
                  <div>
                    <h4 className={`font-medium }`}>
                      {testimonial.name}
                    </h4>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className={`text-sm `}>
                  {testimonial.text}
                </p>
              </div>
          </div>
        </div>  */}
      </div>
      <Footer />
    </div>
  );
};

export default UserDoctorDetailsPage;
