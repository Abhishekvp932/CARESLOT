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
          { urls: "stun:stun.l.google.com:19302" } // public STUN
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
          socket.emit("ice-candidate", { appointmentId, candidate: event.candidate, to: otherUserId });
        }
      };

      // 4. Join room
      socket.emit("join-room", { appointmentId, userId });

      // 5. Set initiator if other user joined
      socket.on("user-joined", ({ userId: joinedId }) => {
        if (joinedId === otherUserId) {
          setIsInitiator(true);
        }
      });

      // 6. Receive offer
      socket.on("receive-call", async ({ from, offer }) => {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer-call", { appointmentId, answer, to: from });
      });

      // 7. Receive answer
      socket.on("call-answered", async ({ answer }) => {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      // 8. Receive ICE candidates
      socket.on("ice-candidate", async ({ candidate }) => {
        try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (err) { console.error(err); }
      });
    };

    init();

    return () => pcRef.current?.close();
  }, [appointmentId, userId, otherUserId]);

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
