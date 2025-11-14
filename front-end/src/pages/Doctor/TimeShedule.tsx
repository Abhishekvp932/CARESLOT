import { useState } from "react";
import { DoctorSidebar } from "@/layout/doctor/sideBar";
import { useSelector } from "react-redux";
import { useSlotAddMutation } from "@/features/docotr/doctorApi";
import {
  Plus,
  Timer,
  Calendar,
  Save,
  Coffee,
  Briefcase,
  X,
  Edit,
} from "lucide-react";
import type { RootState } from "@/app/store";
import { toast, ToastContainer } from "react-toastify";

interface DaySchedule {
  day: string;
  startTime: string;
  endTime: string;
  breaks: { id: string; start: string; end: string }[];
}

// interface Slot {
//   _id: string;
//   day: string;
//   startTime: string;
//   endTime: string;
// }

export default function TimeShedule() {
  const doctor = useSelector((state: RootState) => state.doctor.doctor);

  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>(
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
      (day) => ({
        day,
        startTime: "09:00",
        endTime: "17:00",
        breaks: [],
      })
    )
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // Track unsaved changes

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 6; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        times.push(
          `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
    return times;
  };
  const timeOptions = generateTimeOptions();

  const updateDaySchedule = (
    day: string,
    field: keyof DaySchedule,
    value: string | { id: string; start: string; end: string }[]
  ) => {
    if (!isEditing) return;

    setWeekSchedule((prev) =>
      prev.map((d) => (d.day === day ? { ...d, [field]: value } : d))
    );
    setHasUnsavedChanges(true);
  };

  const addBreak = (day: string) => {
    if (!isEditing) return; // Prevent adding breaks when not in edit mode

    setWeekSchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              breaks: [
                ...d.breaks,
                { id: Date.now().toString(), start: "12:00", end: "13:00" },
              ],
            }
          : d
      )
    );
    setHasUnsavedChanges(true);
  };

  const updateBreak = (
    day: string,
    id: string,
    field: "start" | "end",
    value: string
  ) => {
    if (!isEditing) return; // Prevent updates when not in edit mode

    setWeekSchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              breaks: d.breaks.map((b) =>
                b.id === id ? { ...b, [field]: value } : b
              ),
            }
          : d
      )
    );
    setHasUnsavedChanges(true);
  };

  const removeBreak = (day: string, id: string) => {
    if (!isEditing) return; // Prevent removing breaks when not in edit mode

    setWeekSchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, breaks: d.breaks.filter((b) => b.id !== id) }
          : d
      )
    );
    setHasUnsavedChanges(true);
  };

  const [slotAdd] = useSlotAddMutation();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = {
        doctorId: doctor?._id,
        recurrenceType: "weekly",
        recurrenceStartDate: new Date(),
        recurrenceEndDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ),
        daysOfWeek: weekSchedule.map((day) => ({
          daysOfWeek: day.day,
          startTime: day.startTime,
          endTime: day.endTime,
          breakTime: day.breaks.map((b) => ({
            startTime: b.start,
            endTime: b.end,
          })),
        })),
      };
      
      const res = await slotAdd({ data }).unwrap();
      toast.success(res?.msg);
     

      setIsEditing(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to save schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing && hasUnsavedChanges) {
      // If in edit mode with unsaved changes, save first
      handleSubmit();
    } else if (isEditing && !hasUnsavedChanges) {
      // If in edit mode without changes, just exit edit mode
      setIsEditing(false);
    } else {
      // If not in edit mode, enter edit mode
      setIsEditing(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DoctorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Timer className="h-6 w-6 text-gray-700" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Time Schedule
                </h1>
                <p className="text-sm text-gray-500">
                  {isEditing
                    ? "Edit your weekly recurring slots"
                    : "Manage your weekly recurring slots"}
                </p>
              </div>
            </div>
            <button
              onClick={handleEditToggle}
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isEditing
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isEditing ? (
                <Save className="h-4 w-4" />
              ) : (
                <Edit className="h-4 w-4" />
              )}
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Edit Schedule"}
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-2">
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <Edit className="h-4 w-4" />
              <span className="font-medium">Edit Mode Active</span>
              {hasUnsavedChanges && (
                <span className="text-orange-600 ml-2">• Unsaved changes</span>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {weekSchedule.map((day) => (
                <div
                  key={day.day}
                  className={`bg-white rounded-lg border shadow-sm transition-all ${
                    isEditing
                      ? "border-blue-200 hover:shadow-md"
                      : "border-gray-200 hover:shadow-md"
                  } ${!isEditing ? "opacity-90" : ""}`}
                >
                  {/* Day Header */}
                  <div
                    className={`px-4 py-3 border-b border-gray-200 ${
                      isEditing ? "bg-blue-50" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{day.day}</h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {isEditing && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-6">
                    {/* Work Hours */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Briefcase className="h-4 w-4" />
                        Work Hours
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500">
                            Start Time
                          </label>
                          <select
                            value={day.startTime}
                            onChange={(e) =>
                              updateDaySchedule(
                                day.day,
                                "startTime",
                                e.target.value
                              )
                            }
                            disabled={!isEditing}
                            className={`w-full p-2 border rounded-md text-sm transition-colors ${
                              isEditing
                                ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                                : "border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600"
                            }`}
                          >
                            {timeOptions.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500">
                            End Time
                          </label>
                          <select
                            value={day.endTime}
                            onChange={(e) =>
                              updateDaySchedule(
                                day.day,
                                "endTime",
                                e.target.value
                              )
                            }
                            disabled={!isEditing}
                            className={`w-full p-2 border rounded-md text-sm transition-colors ${
                              isEditing
                                ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                                : "border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600"
                            }`}
                          >
                            {timeOptions.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Breaks Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Coffee className="h-4 w-4" />
                          Breaks
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => addBreak(day.day)}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                            Add Break
                          </button>
                        )}
                      </div>

                      {day.breaks.length === 0 ? (
                        <div className="text-center py-3 text-gray-400 text-sm">
                          No breaks scheduled
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {day.breaks.map((breakItem) => (
                            <div
                              key={breakItem.id}
                              className={`flex gap-2 items-center p-2 rounded-md border ${
                                isEditing
                                  ? "bg-blue-50 border-blue-200"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <select
                                value={breakItem.start}
                                onChange={(e) =>
                                  updateBreak(
                                    day.day,
                                    breakItem.id,
                                    "start",
                                    e.target.value
                                  )
                                }
                                disabled={!isEditing}
                                className={`flex-1 p-1 border rounded text-xs transition-colors ${
                                  isEditing
                                    ? "border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                    : "border-gray-200 bg-gray-100 cursor-not-allowed text-gray-600"
                                }`}
                              >
                                {timeOptions.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>
                              <span className="text-gray-500 text-xs">to</span>
                              <select
                                value={breakItem.end}
                                onChange={(e) =>
                                  updateBreak(
                                    day.day,
                                    breakItem.id,
                                    "end",
                                    e.target.value
                                  )
                                }
                                disabled={!isEditing}
                                className={`flex-1 p-1 border rounded text-xs transition-colors ${
                                  isEditing
                                    ? "border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                    : "border-gray-200 bg-gray-100 cursor-not-allowed text-gray-600"
                                }`}
                              >
                                {timeOptions.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>
                              {isEditing && (
                                <button
                                  onClick={() =>
                                    removeBreak(day.day, breakItem.id)
                                  }
                                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={300} />
    </div>
  );
}
