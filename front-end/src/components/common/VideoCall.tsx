import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface VideoCallProps {
  userId: string;
  appointmentId: string;
  otherUserId: string;
}

const socket: Socket = io("http://localhost:3000");

const VideoCall: React.FC<VideoCallProps> = ({ userId, appointmentId, otherUserId }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [isInitiator, setIsInitiator] = useState(false);

 useEffect(() => {
  const init = async () => {
const pc = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    {
      urls: [
        "stun:bn-turn2.xirsys.com",
        "turn:bn-turn2.xirsys.com:80?transport=udp",
        "turn:bn-turn2.xirsys.com:3478?transport=udp",
        "turn:bn-turn2.xirsys.com:80?transport=tcp",
        "turn:bn-turn2.xirsys.com:3478?transport=tcp",
        "turns:bn-turn2.xirsys.com:443?transport=tcp",
        "turns:bn-turn2.xirsys.com:5349?transport=tcp"
      ],
      username: "VBSM2Unob7naeN02iA5squNL_7IR8vBa_l8w05zd6Vy4oSVUETFuzHNMH8fItX3CAAAAAGjb7S9BYmhpc2hla3Zw",
      credential: "3271c50e-9e0c-11f0-be60-0242ac140004"
    },
  ]
});
    pcRef.current = pc;

    // 1. Get local media
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    } catch (err) {
      console.error("Error accessing media devices:", err);
      return;
    }

    // 2. Remote stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    // 3. ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { appointmentId, candidate: event.candidate });
      }
    };

    // 4. Join room
    socket.emit("join-room", { appointmentId, userId });

    // 5. Socket events
    socket.on("user-joined", async ({ userId: joinedId }) => {
      // If first user, create offer
      if (joinedId !== userId) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("call-user", { appointmentId, offer, to: joinedId });
      }
    });

    socket.on("receive-call", async ({ from, offer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer-call", { appointmentId, answer, to: from });
    });

    socket.on("call-answered", async ({ answer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) { console.error(err); }
    });
  };

  init();
  return () => pcRef.current?.close();
}, [appointmentId, userId]);
  // 9. Make offer only if initiator
  useEffect(() => {
    const makeCall = async () => {
      if (isInitiator && pcRef.current) {
        const pc = pcRef.current;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("call-user", { appointmentId, offer, to: otherUserId });
      }
    };
    makeCall();
  }, [isInitiator, otherUserId]);

  return (
    <div className="flex gap-6 items-center justify-center mt-10">
      <div className="flex flex-col items-center">
        <h3>Your Video</h3>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="w-96 h-72 bg-black rounded-xl object-cover"
        />
      </div>
      <div className="flex flex-col items-center">
        <h3>Other Video</h3>
        <video
          ref={remoteVideoRef}
          autoPlay
          className="w-96 h-72 bg-black rounded-xl object-cover"
        />
      </div>
    </div>
  );
};

export default VideoCall;
