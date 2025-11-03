import { useParams } from "react-router-dom";
import VideoCall from "@/components/common/VideoCall";
import { useGetCallDataQuery } from "@/features/callLogs/videoCallApi";


export default function UserVideoCall() {
  const { appoinmentId } = useParams();
  console.log('appoinmentId',appoinmentId);
  const { data: callData = {} } = useGetCallDataQuery(appoinmentId);
  console.log('call data ',callData);
  return (
    <div>
      {callData && (
        <VideoCall
          userId={callData.patientId}         
           otherUserId={callData.doctorId}      
          appointmentId={callData.appoinmentId}
        />
      )}
    </div>
  );
}
