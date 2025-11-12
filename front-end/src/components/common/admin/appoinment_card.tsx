"use client";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";

const statusConfig = {
  completed: {
    label: "Completed",
    className: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  pending: {
    label: "Pending",
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
} as const;

export interface AppoinmentPopulatedDTO {
  appointment: {
    _id: string;
    doctorId: { _id: string; name: string; specialization: string };
    status?: keyof typeof statusConfig;
    transactionId?: string;
    amount?: string;
    patientId: { _id: string; name: string };
    slot: { date: string; startTime: string; endTime: string };
    createdAt?: Date;
    updatedAt?: Date;
  };
}

export function AppointmentCard({ appointment }: AppoinmentPopulatedDTO) {
  const statusInfo = statusConfig[appointment?.status ?? "pending"] || {
    label: "Unknown",
    className: "bg-gray-200 text-gray-700",
  };
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
          <div className="flex items-center gap-2 text-sm text-card-foreground">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Patient : {appointment?.patientId?.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
