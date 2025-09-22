"use client"

import { useState } from "react"
import Footer from "@/layout/Footer"
import Header from "@/layout/Header"
import { useGetDoctorDetailPageQuery } from "@/features/users/userApi"
import { useNavigate, useParams } from "react-router-dom"
import { useGetSlotsQuery } from "@/features/users/userApi"
import { useGetRelatedDoctorQuery } from "@/features/users/userApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Star, MessageCircle, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react"

const UserDoctorDetailsPage = () => {
  const { doctorId } = useParams<{ doctorId: string }>()
  const navigate = useNavigate()

  const { data: doctor } = useGetDoctorDetailPageQuery(doctorId)
  const { data = {} } = useGetRelatedDoctorQuery({
    doctorId,
    specialization: doctor?.qualifications?.specialization,
  })

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  const relatedDoctor = data?.relatedDoctor || []
  const { data: slots = [] } = useGetSlotsQuery({
    doctorId,
    date: selectedDate || new Date().toISOString().split("T")[0],
  })

  type Slot = {
    _id: string
    doctorId: string
    date: string
    dayOfWeek: string
    startTime: string
    endTime: string
    status: string
  }

  const groupSlotsByDate = (slots: Slot[]) => {
    const grouped: { [key: string]: Slot[] } = {}
    slots.forEach((slot) => {
      if (!grouped[slot.date]) grouped[slot.date] = []
      grouped[slot.date].push(slot)
    })
    return grouped
  }

  const groupedSlots = groupSlotsByDate(slots)

  const handleCheckout = (doctorId: string) => {
    navigate("/checkout-page", {
      state: {
        doctorId: doctorId,
        slotTime: selectedSlot,
      },
    })
  }

  const handleDoctorDetailsPage = (doctorId: string) => {
    navigate(`/doctor-details/${doctorId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-16">
        {/* Doctor Profile Section */}
        <Card className="border-0 shadow-sm mb-12">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Doctor Image */}
              <div className="flex-shrink-0">
                <div className="w-40 h-40 rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={doctor?.profile_img || "/placeholder.svg"}
                    alt={doctor?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-semibold text-foreground">{doctor?.name}</h1>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-lg text-muted-foreground">
                        {doctor?.qualifications?.degree}, {doctor?.qualifications?.specialization}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>4.8 (124 reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Available today</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">{doctor?.qualifications?.about}</p>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Consultation Fee:</span>
                    <span className="text-2xl font-semibold text-foreground">₹{doctor?.qualifications?.fees}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Section */}
        <Card className="border-0 shadow-sm mb-12">
          <CardContent className="p-8">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Book Appointment</h2>
                <p className="text-muted-foreground">Select your preferred date and time slot</p>
              </div>

              {/* Date Picker */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground">Select Date</label>
                <input
                  type="date"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Date Navigation */}
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-4 h-4" />
                </Button>

                <div className="flex gap-3 overflow-x-auto pb-2">
                  {Object.keys(groupedSlots).map((day) => {
                    const dateObj = new Date(day)
                    const formattedDay = dateObj.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })

                    return (
                      <Button
                        key={day}
                        variant={selectedDate === day ? "default" : "outline"}
                        onClick={() => {
                          setSelectedDate(day)
                          setSelectedSlot(null)
                        }}
                        className="flex flex-col items-center p-4 h-auto min-w-20 rounded-xl"
                      >
                        <span className="text-sm font-medium">{formattedDay}</span>
                      </Button>
                    )
                  })}
                </div>

                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Available Time Slots</span>
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
                        className="h-auto py-3 px-4 rounded-lg text-sm"
                      >
                        <div className="text-center">
                          {slot.startTime && slot.endTime && (
                            <>
                              <div className="font-medium">
                                {new Date(`1970-01-01T${slot.startTime}:00`).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </div>
                              <div className="text-xs opacity-70">
                                {new Date(`1970-01-01T${slot.endTime}:00`).toLocaleTimeString([], {
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

              {/* Book Button */}
              {selectedSlot && (
                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={() => handleCheckout(doctor?._id)}
                    className="w-full py-4 text-base font-medium rounded-xl"
                    size="lg"
                  >
                    Book Appointment -{" "}
                    {selectedSlot?.startTime &&
                      new Date(`1970-01-01T${selectedSlot.startTime}:00`).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}{" "}
                    to{" "}
                    {selectedSlot?.endTime &&
                      new Date(`1970-01-01T${selectedSlot.endTime}:00`).toLocaleTimeString([], {
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

        {/* Related Doctors */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Related Specialists</h2>
                <p className="text-muted-foreground">Other qualified doctors in this specialty</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedDoctor?.map((doctor) => (
                  <Card key={doctor._id} className="border border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-muted">
                        <img
                          src={doctor?.profile_img || "/placeholder.svg?height=80&width=80"}
                          alt={doctor?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">{doctor?.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor?.qualifications?.specialization}</p>
                      </div>

                      <Button
                        onClick={() => handleDoctorDetailsPage(doctor?._id)}
                        className="w-full rounded-lg"
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

      <Footer />
    </div>
  )
}

export default UserDoctorDetailsPage
