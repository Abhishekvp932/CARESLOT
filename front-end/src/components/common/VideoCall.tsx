import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Phone, PhoneOff, Video, VideoOff,Mic, MicOff } from "lucide-react";

interface VideoCallProps {
  userId: string;
  appointmentId: string;
  otherUserId: string;
  onCallEnd?: () => void;
}

const socket: Socket = io("https://www.careslot.site");

type CallStatus =
  | "idle"
  | "calling"
  | "incoming"
  | "active"
  | "rejected"
  | "ended";

const VideoCall: React.FC<VideoCallProps> = ({
  userId,
  appointmentId,
  otherUserId,
  onCallEnd,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  // Buffer for ICE candidates that arrive before peer connection is ready
  const iceCandidateBufferRef = useRef<RTCIceCandidateInit[]>([]);

  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [incomingCallFrom, setIncomingCallFrom] = useState<string>("");
  const [remoteSocketId, setRemoteSocketId] = useState<string>("");
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {

    socket.emit("join-room", { appointmentId, userId });

    socket.on("user-joined", ({ userId: joinedId, socketId }) => {
    
      if (joinedId !== userId) {
        setRemoteSocketId(socketId);
      }
    });

    socket.on(
      "user-already-in-room",
      ({ userId: existingUserId, socketId }) => {
        console.log(
          "User already in room:",
          existingUserId,
          "socketId:",
          socketId
        );
        setRemoteSocketId(socketId);
      }
    );

    socket.on("incoming-call", ({ from, fromUserId, offer }) => {
      console.log("Incoming call from:", fromUserId, "socketId:", from);
      setIncomingCallFrom(from);
      setRemoteSocketId(from);
      setCallStatus("incoming");
      sessionStorage.setItem("pendingOffer", JSON.stringify(offer));
    });

    socket.on("call-failed", ({ reason }) => {
      console.error("Call failed:", reason);
      alert(`Call failed: ${reason}`);
      setCallStatus("idle");
      cleanup();
    });

    socket.on("call-accepted", async ({ answer, from }) => {
      console.log("Call accepted by:", from);
      if (pcRef.current) {
        try {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          setCallStatus("active");
          setRemoteSocketId(from);

          // Process buffered ICE candidates
          console.log(
            `Processing ${iceCandidateBufferRef.current.length} buffered ICE candidates`
          );
          for (const candidate of iceCandidateBufferRef.current) {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
          iceCandidateBufferRef.current = [];
        } catch (err) {
          console.error("Error in call-accepted:", err);
        }
      }
    });

    socket.on("call-rejected", ({ from }) => {
      console.log("Call rejected by:", from);
      setCallStatus("rejected");
      cleanup();
      setTimeout(() => setCallStatus("idle"), 3000);
    });

    socket.on("call-ended", ({ from }) => {
      console.log("Call ended by:", from);
      setCallStatus("ended");
      cleanup();
      setTimeout(() => {
        setCallStatus("idle");
        onCallEnd?.();
      }, 2000);
    });

    socket.on("ice-candidate", async ({ candidate, from }) => {
      console.log("ICE candidate from:", from);

      if (pcRef.current && pcRef.current.remoteDescription) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("✅ ICE candidate added successfully");
        } catch (err) {
          console.error("❌ Error adding ICE candidate:", err);
        }
      } else {
        console.log("⏳ Buffering ICE candidate (peer connection not ready)");
        iceCandidateBufferRef.current.push(candidate);
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("user-already-in-room");
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-rejected");
      socket.off("call-ended");
      socket.off("call-failed");
      socket.off("ice-candidate");
    };
  }, [appointmentId, userId, onCallEnd]);

  useEffect(() => {
    if (
      remoteStreamRef.current &&
      remoteVideoRef.current &&
      callStatus === "active"
    ) {
      console.log("🔄 Syncing remote stream to video element");
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [callStatus]);

  useEffect(() => {
    if (
      localStreamRef.current &&
      localVideoRef.current &&
      (callStatus === "calling" || callStatus === "active")
    ) {
      console.log("🔄 Syncing local stream to video element");
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [callStatus]);

  const setupPeerConnection = async (targetSocketId?: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
            "stun:stun.services.mozilla.com",
            "stun:global.relay.metered.ca:80",
          ],
        },
        {
          urls: [
            "turn:bn-turn1.xirsys.com:80?transport=udp",
            "turn:bn-turn1.xirsys.com:3478?transport=udp",
            "turn:bn-turn1.xirsys.com:80?transport=tcp",
            "turn:bn-turn1.xirsys.com:3478?transport=tcp",
            "turns:bn-turn1.xirsys.com:443?transport=tcp",
            "turns:bn-turn1.xirsys.com:5349?transport=tcp",
          ],
          username:
            "755lOUxgC038eVVWmighZ6n56l-LnHyx2nTMBm7PTs3H1FZCPYkn8SsJ-KaUlCB6AAAAAGkR0NxBYmhpc2hla3Zw",
          credential: "0fab11e4-be2b-11f0-a1ef-0242ac140004",
        },
      ],
      iceCandidatePoolSize: 10, // Pre-gather ICE candidates
    });

    pcRef.current = pc;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        console.log("📹 Attaching local stream to video element");
        localVideoRef.current.srcObject = stream;
        localVideoRef.current
          .play()
          .catch((err) => console.log("Local video play error:", err));
      }

      stream.getTracks().forEach((track) => {
        console.log("Adding track:", track.kind);
        pc.addTrack(track, stream);
      });
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Could not access camera/microphone. Please check permissions.");
      return null;
    }

    // Handle incoming tracks
    pc.ontrack = (event) => {
      console.log(
        "🎥 Received remote track:",
        event.track.kind,
        "readyState:",
        event.track.readyState
      );
      const stream = event.streams[0];

      if (stream) {
        console.log(
          "📺 Remote stream received with",
          stream.getTracks().length,
          "tracks"
        );
        remoteStreamRef.current = stream;

        if (remoteVideoRef.current) {
          console.log("✅ Attaching remote stream to video element");
          remoteVideoRef.current.srcObject = stream;

          // Ensure the video element is ready
          remoteVideoRef.current.onloadedmetadata = () => {
            console.log("🎬 Remote video metadata loaded");
            remoteVideoRef.current
              ?.play()
              .catch((err) => console.error("Remote video play error:", err));
          };
        } else {
          console.warn("⚠️ Remote video ref not available");
        }
      }
    };

    // ICE candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const targetId = targetSocketId || remoteSocketId;
        if (targetId) {
          console.log("📤 Sending ICE candidate to:", targetId);
          socket.emit("ice-candidate", {
            appointmentId,
            candidate: event.candidate.toJSON(),
            to: targetId,
          });
        } else {
          console.warn("⚠️ No target socket ID for ICE candidate");
        }
      } else {
        console.log("✅ ICE gathering complete");
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("🔗 Connection state:", pc.connectionState);
      if (
        pc.connectionState === "failed" ||
        pc.connectionState === "disconnected"
      ) {
        console.error("Connection failed or disconnected");
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("🧊 ICE connection state:", pc.iceConnectionState);
    };

    pc.onicegatheringstatechange = () => {
      console.log("🔍 ICE gathering state:", pc.iceGatheringState);
    };

    return pc;
  };

  const startCall = async () => {
    console.log("📞 Starting call to otherUserId:", otherUserId);
    setCallStatus("calling");

    const pc = await setupPeerConnection();
    if (!pc) {
      setCallStatus("idle");
      return;
    }

    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);

      console.log("📤 Sending start-call to:", otherUserId);
      socket.emit("start-call", {
        appointmentId,
        offer,
        to: otherUserId,
        from: userId,
      });
    } catch (err) {
      console.error("Error creating offer:", err);
      setCallStatus("idle");
      cleanup();
    }
  };

  const acceptCall = async () => {
    console.log("✅ Accepting call from:", incomingCallFrom);

    const pc = await setupPeerConnection(incomingCallFrom);
    if (!pc) {
      setCallStatus("idle");
      return;
    }

    try {
      const offerStr = sessionStorage.getItem("pendingOffer");
      if (offerStr) {
        const offer = JSON.parse(offerStr);

        console.log("📥 Setting remote description (offer)");
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        console.log("📝 Creating answer");
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        console.log("📤 Sending accept-call to:", incomingCallFrom);
        socket.emit("accept-call", {
          appointmentId,
          answer,
          to: incomingCallFrom,
        });

        setCallStatus("active");
        sessionStorage.removeItem("pendingOffer");

        // Process buffered ICE candidates after setting remote description
        console.log(
          `Processing ${iceCandidateBufferRef.current.length} buffered ICE candidates`
        );
        for (const candidate of iceCandidateBufferRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        iceCandidateBufferRef.current = [];
      }
    } catch (err) {
      console.error("Error accepting call:", err);
      setCallStatus("idle");
      cleanup();
    }
  };

  const rejectCall = () => {
    console.log("❌ Rejecting call from:", incomingCallFrom);
    socket.emit("reject-call", {
      appointmentId,
      to: incomingCallFrom,
    });
    setCallStatus("idle");
    sessionStorage.removeItem("pendingOffer");
  };

  const endCall = () => {
    console.log("📴 Ending call with:", remoteSocketId);
    socket.emit("end-call", {
      appointmentId,
      to: remoteSocketId,
    });
    setCallStatus("ended");
    cleanup();
    setTimeout(() => {
      setCallStatus("idle");
      onCallEnd?.();
    }, 2000);
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    iceCandidateBufferRef.current = [];
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  if (callStatus === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Video Call</h2>
          <button
            onClick={startCall}
            className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
          >
            <Video size={24} />
            Start Call
          </button>
        </div>
      </div>
    );
  }

  if (callStatus === "calling") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-md">
          {localStreamRef.current && (
            <div className="mb-6 relative">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 object-cover rounded-xl bg-black"
              />
              <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded text-sm">
                You
              </div>
            </div>
          )}
          <div className="mb-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Phone size={48} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Calling...</h2>
            <p className="text-gray-600">
              Waiting for the other person to answer
            </p>
          </div>
          <button
            onClick={() => {
              cleanup();
              setCallStatus("idle");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Cancel Call
          </button>
        </div>
      </div>
    );
  }

  if (callStatus === "incoming") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Phone size={48} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Incoming Call</h2>
            <p className="text-gray-600">Someone is calling you...</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={acceptCall}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              <Phone size={20} />
              Accept
            </button>
            <button
              onClick={rejectCall}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              <PhoneOff size={20} />
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (callStatus === "rejected") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOff size={48} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-red-600">
            Call Rejected
          </h2>
          <p className="text-gray-600">The call was declined</p>
        </div>
      </div>
    );
  }

  if (callStatus === "ended") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOff size={48} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Call Ended</h2>
          <p className="text-gray-600">The call has been disconnected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <div className="flex-1 flex gap-4 p-6">
        <div className="flex-1 relative bg-black rounded-2xl overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
            Other User
          </div>
          {!remoteStreamRef.current && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <p className="text-white">Waiting for video...</p>
            </div>
          )}
        </div>

        <div className="w-80 relative bg-black rounded-2xl overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
            You
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 p-6 bg-gray-800">
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full transition-colors ${
            isAudioEnabled
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isAudioEnabled ? (
            <Mic size={24} className="text-white" />
          ) : (
            <MicOff size={24} className="text-white" />
          )}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-colors ${
            isVideoEnabled
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isVideoEnabled ? (
            <Video size={24} className="text-white" />
          ) : (
            <VideoOff size={24} className="text-white" />
          )}
        </button>

        <button
          onClick={endCall}
          className="p-4 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
        >
          <PhoneOff size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
