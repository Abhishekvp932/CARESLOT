
import { useParams } from "react-router-dom";
import VideoCall from "@/components/common/VideoCall";
import { useGetCallDataQuery } from "@/features/callLogs/videoCallApi";

export default function DoctorVideoCall() {
  const { appoinmentId } = useParams();
  const { data: callData = {} } = useGetCallDataQuery(appoinmentId);
  console.log(' user doctor data ',callData);
  return (
    <div>
      {callData && (
        <VideoCall
          userId={callData.doctorId}          
          otherUserId={callData.patientId}     
          appointmentId={callData.appoinmentId}
        />
      )}
    </div>
  );
}
