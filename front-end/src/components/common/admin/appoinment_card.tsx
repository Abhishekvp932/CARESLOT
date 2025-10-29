"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";

// interface Appointment {
//   id: string
//   title: string
//   date: string
//   time: string
//   location: string
//   doctor: string
//   status: "completed" | "upcoming" | "cancelled" | "rescheduled"
//   type: string
// }

// interface AppointmentCardProps {

//   onReschedule?: (id: string) => void
//   onCancel?: (id: string) => void
// }

const statusConfig = {
  completed: {
    label: "Completed",
    className: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  pending: {
    label: "pending",
    className: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  rescheduled: {
    label: "Rescheduled",
    className: "bg-accent text-accent-foreground hover:bg-accent/90",
  },
};

export function AppointmentCard({ appointment, onReschedule, onCancel }) {
  const statusInfo = statusConfig[appointment?.status];

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-all duration-200 hover:border-primary/20 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              Dr {appointment?.doctorId?.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {appointment?.doctorId?.specialization}
            </p>
          </div>
          <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-2 text-sm text-card-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Date : {appointment?.slot?.date}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-card-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              Time :{" "}
              {new Date(
                `1970-01-01T${appointment?.slot?.startTime}`
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>

          {/* <div className="flex items-center gap-2 text-sm text-card-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-balance">{appointment.location}</span>
          </div> */}

          <div className="flex items-center gap-2 text-sm text-card-foreground">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Patient : {appointment?.patientId?.name}</span>
          </div>
        </div>

        {appointment?.status === "upcoming" && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={() => onReschedule?.(appointment?.id)}
            >
              Reschedule
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => onCancel?.(appointment?.id)}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}