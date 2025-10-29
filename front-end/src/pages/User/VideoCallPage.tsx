import React from "react";
import { useParams } from "react-router-dom";
import VideoCall from "@/components/common/VideoCall";
import { useGetCallDataQuery } from "@/features/callLogs/videoCallApi";
import { LucideToggleRight } from "lucide-react";

export default function UserVideoCall() {
  const { appoinmentId } = useParams();
  console.log('appoinmentId',appoinmentId);
  const { data: callData = {} } = useGetCallDataQuery(appoinmentId);
  console.log('call data ',callData);
  return (
    <div>
      {callData && (
        <VideoCall
          userId={callData.patientId}           // logged-in user
           otherUserId={callData.doctorId}       // the person to call
          appointmentId={callData.appoinmentId}
        />
      )}
    </div>
  );
}
