import { useState } from "react";
import {
  CalendarIcon,
  Clock,
  Trash2,
  Plus,
  Timer,
  Calendar as CalendarSchedule,
} from "lucide-react";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DoctorSidebar } from "@/layout/doctor/sideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useSlotAddMutation } from "@/features/docotr/doctorApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useGetDoctorSlotsQuery } from "@/features/docotr/doctorApi";
interface TimeSlot {
  startTime: string;
  endTime: string;
  id: string;
}

export default function TimeShedule() {
  const [slotAdd] = useSlotAddMutation();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      startTime: "09:00",
      endTime: "10:00",
    },
  ]);

  const doctor = useSelector((state: RootState) => state.doctor.doctor);

  const { data: slots = [], refetch } = useGetDoctorSlotsQuery(doctor?._id);
   

  const updateTimeSlot = (
    id: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setTimeSlots(
      timeSlots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    );
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleSubmit = async () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }
    const formattedDate = selectedDate.toISOString().split("T")[0];

    const payload = {
      startTime: `${formattedDate}T${timeSlots[0].startTime}:00`,
      endTime: `${formattedDate}T${timeSlots[0].endTime}:00`,
      date: formattedDate,
      doctorId: doctor?._id,
    };

    try {
      const res = await slotAdd({ data: payload }).unwrap();
      toast.success(res?.msg);
      refetch();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.msg || "Time schedule error");
    }
  };


  const availableSlotCount = slots.filter((slot) => slot.status === 'Available').length
    const bookedSlotCount = slots.filter((slot) => slot.status === 'Booked').length

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
        <DoctorSidebar />
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
                <Timer className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 bg-clip-text text-transparent mb-3">
                Time Slot Management
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create and manage your appointment time slots with ease
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Create New Time Slot
                        </h2>
                        <p className="text-blue-100 mt-1">
                          Schedule your available appointment times
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <CalendarSchedule className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Select Date
                        </h3>
                      </div>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-14 justify-start text-left font-normal border-2 hover:border-blue-300 transition-all duration-200",
                              !selectedDate && "text-muted-foreground",
                              selectedDate && "border-blue-200 bg-blue-50"
                            )}
                          >
                            <CalendarIcon className="mr-3 h-5 w-5" />
                            <div>
                              <div className="font-medium">
                                {selectedDate
                                  ? format(selectedDate, "EEEE, MMMM do, yyyy")
                                  : "Choose appointment date"}
                              </div>
                              {selectedDate && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {format(selectedDate, "PPP")}
                                </div>
                              )}
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                            className="rounded-lg border shadow-lg"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Set Time Slot
                        </h3>
                      </div>

                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border-2 border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            <span className="font-medium text-gray-900">
                              Appointment Slot
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                            1 Hour Duration
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Start Time
                            </label>
                            <Select
                              value={timeSlots[0].startTime}
                              onValueChange={(value) =>
                                updateTimeSlot("1", "startTime", value)
                              }
                            >
                              <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem
                                    key={time}
                                    value={time}
                                    className="text-base"
                                  >
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-center mt-6">
                            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                          </div>

                          <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              End Time
                            </label>
                            <Select
                              value={timeSlots[0].endTime}
                              onValueChange={(value) =>
                                updateTimeSlot("1", "endTime", value)
                              }
                            >
                              <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem
                                    key={time}
                                    value={time}
                                    className="text-base"
                                  >
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={handleSubmit}
                        className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                        size="lg"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Create Time Slot
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 h-14 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-200"
                        size="lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <CalendarSchedule className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          Scheduled Slots
                        </h2>
                        <p className="text-indigo-100 text-sm mt-1">
                          Your upcoming appointments
                        </p>
                      </div>
                    </div>
                  </div>
                  {slots.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Slots Created Yet
                      </h3>
                      <p className="text-gray-500 text-sm mb-6">
                        Create your first time slot to start scheduling
                        appointments
                      </p>
                      <div className="w-full h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 rounded-full opacity-50"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {slots.map((slot) => (
                        <div
                          key={slot._id}
                          className="p-4 border rounded-lg shadow-sm bg-white"
                        >
                          <div className="text-sm text-gray-500">
                            {format(new Date(slot.date), "eeee, MMMM do, yyyy")}
                          </div>
                          <div className="text-lg font-semibold text-blue-600">
                            {format(new Date(slot.startTime), "hh:mm a")} -{" "}
                            {format(new Date(slot.endTime), "hh:mm a")}
                          </div>
                          <div
                            className={`text-sm mt-1 ${
                              slot.status === "Available"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {slot.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">
                      Quick Stats
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {availableSlotCount}
                        </div>
                        <div className="text-xs text-gray-600">Available</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">
                        {bookedSlotCount}
                        </div>
                        <div className="text-xs text-gray-600">Booked</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ToastContainer
            autoClose={3000}
            position="top-right"
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="mt-16"
          />
        </div>
      </div>
    </SidebarProvider>
  );
}
