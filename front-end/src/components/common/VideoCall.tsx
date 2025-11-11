import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Phone, PhoneOff, Video, VideoOff } from "lucide-react";

interface VideoCallProps {
  userId: string;
  appointmentId: string;
  otherUserId: string;
  onCallEnd?: () => void;
}

const socket: Socket = io("https://careslot.ddns.net");

type CallStatus = 'idle' | 'calling' | 'incoming' | 'active' | 'rejected' | 'ended';

const VideoCall: React.FC<VideoCallProps> = ({ userId, appointmentId, otherUserId, onCallEnd }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  
  // Buffer for ICE candidates that arrive before peer connection is ready
  const iceCandidateBufferRef = useRef<RTCIceCandidateInit[]>([]);
  
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [incomingCallFrom, setIncomingCallFrom] = useState<string>('');
  const [remoteSocketId, setRemoteSocketId] = useState<string>('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    console.log("Joining room with userId:", userId, "appointmentId:", appointmentId);
    socket.emit("join-room", { appointmentId, userId });

    socket.on("user-joined", ({ userId: joinedId, socketId }) => {
      console.log("User joined:", joinedId, "socketId:", socketId);
      if (joinedId !== userId) {
        setRemoteSocketId(socketId);
      }
    });

    socket.on("user-already-in-room", ({ userId: existingUserId, socketId }) => {
      console.log("User already in room:", existingUserId, "socketId:", socketId);
      setRemoteSocketId(socketId);
    });

    socket.on("incoming-call", ({ from, fromUserId, offer }) => {
      console.log("Incoming call from:", fromUserId, "socketId:", from);
      setIncomingCallFrom(from);
      setRemoteSocketId(from);
      setCallStatus('incoming');
      sessionStorage.setItem('pendingOffer', JSON.stringify(offer));
    });

    socket.on("call-failed", ({ reason }) => {
      console.error("Call failed:", reason);
      alert(`Call failed: ${reason}`);
      setCallStatus('idle');
      cleanup();
    });

    socket.on("call-accepted", async ({ answer, from }) => {
      console.log("Call accepted by:", from);
      if (pcRef.current) {
        try {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          setCallStatus('active');
          setRemoteSocketId(from);
          
          // Process buffered ICE candidates
          console.log(`Processing ${iceCandidateBufferRef.current.length} buffered ICE candidates`);
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
      setCallStatus('rejected');
      cleanup();
      setTimeout(() => setCallStatus('idle'), 3000);
    });

    socket.on("call-ended", ({ from }) => {
      console.log("Call ended by:", from);
      setCallStatus('ended');
      cleanup();
      setTimeout(() => {
        setCallStatus('idle');
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
    if (remoteStreamRef.current && remoteVideoRef.current && callStatus === 'active') {
      console.log("🔄 Syncing remote stream to video element");
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [callStatus]);

  useEffect(() => {
    if (localStreamRef.current && localVideoRef.current && (callStatus === 'calling' || callStatus === 'active')) {
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
          username: "755lOUxgC038eVVWmighZ6n56l-LnHyx2nTMBm7PTs3H1FZCPYkn8SsJ-KaUlCB6AAAAAGkR0NxBYmhpc2hla3Zw",
          credential: "0fab11e4-be2b-11f0-a1ef-0242ac140004",
        },
      ],
      iceCandidatePoolSize: 10,
    });

    pcRef.current = pc;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        console.log("📹 Attaching local stream to video element");
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(err => console.log("Local video play error:", err));
      }
      
      stream.getTracks().forEach(track => {
        console.log("Adding track:", track.kind);
        pc.addTrack(track, stream);
      });
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Could not access camera/microphone. Please check permissions.");
      return null;
    }

    pc.ontrack = (event) => {
      console.log("🎥 Received remote track:", event.track.kind, "readyState:", event.track.readyState);
      const stream = event.streams[0];
      
      if (stream) {
        console.log("📺 Remote stream received with", stream.getTracks().length, "tracks");
        remoteStreamRef.current = stream;
        
        if (remoteVideoRef.current) {
          console.log("✅ Attaching remote stream to video element");
          remoteVideoRef.current.srcObject = stream;
          
          remoteVideoRef.current.onloadedmetadata = () => {
            console.log("🎬 Remote video metadata loaded");
            remoteVideoRef.current?.play().catch(err => 
              console.error("Remote video play error:", err)
            );
          };
        } else {
          console.warn("⚠️ Remote video ref not available");
        }
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const targetId = targetSocketId || remoteSocketId;
        if (targetId) {
          console.log("📤 Sending ICE candidate to:", targetId);
          socket.emit("ice-candidate", { 
            appointmentId, 
            candidate: event.candidate.toJSON(),
            to: targetId
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
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
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
    setCallStatus('calling');
    
    const pc = await setupPeerConnection();
    if (!pc) {
      setCallStatus('idle');
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
        from: userId
      });
    } catch (err) {
      console.error("Error creating offer:", err);
      setCallStatus('idle');
      cleanup();
    }
  };

  const acceptCall = async () => {
    console.log("✅ Accepting call from:", incomingCallFrom);
    
    const pc = await setupPeerConnection(incomingCallFrom);
    if (!pc) {
      setCallStatus('idle');
      return;
    }

    try {
      const offerStr = sessionStorage.getItem('pendingOffer');
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
          to: incomingCallFrom
        });
        
        setCallStatus('active');
        sessionStorage.removeItem('pendingOffer');
        
        console.log(`Processing ${iceCandidateBufferRef.current.length} buffered ICE candidates`);
        for (const candidate of iceCandidateBufferRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        iceCandidateBufferRef.current = [];
      }
    } catch (err) {
      console.error("Error accepting call:", err);
      setCallStatus('idle');
      cleanup();
    }
  };

  const rejectCall = () => {
    console.log("❌ Rejecting call from:", incomingCallFrom);
    socket.emit("reject-call", { 
      appointmentId, 
      to: incomingCallFrom 
    });
    setCallStatus('idle');
    sessionStorage.removeItem('pendingOffer');
  };

  const endCall = () => {
    console.log("📴 Ending call with:", remoteSocketId);
    socket.emit("end-call", { 
      appointmentId, 
      to: remoteSocketId
    });
    setCallStatus('ended');
    cleanup();
    setTimeout(() => {
      setCallStatus('idle');
      onCallEnd?.();
    }, 2000);
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
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

  if (callStatus === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Video Call</h2>
          <button
            onClick={startCall}
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-colors"
          >
            <Video size={24} />
            Start Call
          </button>
        </div>
      </div>
    );
  }

  if (callStatus === 'calling') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 sm:p-12 rounded-2xl shadow-lg text-center w-full max-w-md">
          {localStreamRef.current && (
            <div className="mb-6 relative">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-48 sm:h-64 object-cover rounded-xl bg-black"
              />
              <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded text-sm">
                You
              </div>
            </div>
          )}
          <div className="mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Phone size={40} className="sm:w-12 sm:h-12 text-blue-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Calling...</h2>
            <p className="text-sm sm:text-base text-gray-600">Waiting for the other person to answer</p>
          </div>
          <button
            onClick={() => {
              cleanup();
              setCallStatus('idle');
            }}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Cancel Call
          </button>
        </div>
      </div>
    );
  }

  if (callStatus === 'incoming') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 sm:p-12 rounded-2xl shadow-lg text-center w-full max-w-md">
          <div className="mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Phone size={40} className="sm:w-12 sm:h-12 text-green-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Incoming Call</h2>
            <p className="text-sm sm:text-base text-gray-600">Someone is calling you...</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={acceptCall}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 sm:py-4 rounded-xl font-semibold transition-colors"
            >
              <Phone size={20} />
              Accept
            </button>
            <button
              onClick={rejectCall}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 sm:py-4 rounded-xl font-semibold transition-colors"
            >
              <PhoneOff size={20} />
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (callStatus === 'rejected') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 sm:p-12 rounded-2xl shadow-lg text-center w-full max-w-md">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOff size={40} className="sm:w-12 sm:h-12 text-red-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-red-600">Call Rejected</h2>
          <p className="text-sm sm:text-base text-gray-600">The call was declined</p>
        </div>
      </div>
    );
  }

  if (callStatus === 'ended') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 sm:p-12 rounded-2xl shadow-lg text-center w-full max-w-md">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOff size={40} className="sm:w-12 sm:h-12 text-gray-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Call Ended</h2>
          <p className="text-sm sm:text-base text-gray-600">The call has been disconnected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Video Container - Responsive Layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 sm:gap-4 p-2 sm:p-4 md:p-6">
        {/* Remote Video - Main/Large Video */}
        <div className="flex-1 relative bg-black rounded-xl md:rounded-2xl overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/50 text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm md:text-base">
            Other User
          </div>
          {!remoteStreamRef.current && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <p className="text-white text-sm sm:text-base">Waiting for video...</p>
            </div>
          )}
        </div>

        {/* Local Video - Picture-in-Picture Style */}
        <div className="w-full h-48 md:w-72 md:h-auto lg:w-96 relative bg-black rounded-xl md:rounded-2xl overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/50 text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm md:text-base">
            You
          </div>
        </div>
      </div>

      {/* Controls - Fixed at Bottom */}
      <div className="flex justify-center items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-800">
        <button
          onClick={toggleAudio}
          className={`p-3 sm:p-4 rounded-full transition-colors ${
            isAudioEnabled 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
          aria-label={isAudioEnabled ? "Mute audio" : "Unmute audio"}
        >
          {isAudioEnabled ? (
            <Phone size={20} className="sm:w-6 sm:h-6 text-white" />
          ) : (
            <PhoneOff size={20} className="sm:w-6 sm:h-6 text-white" />
          )}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-3 sm:p-4 rounded-full transition-colors ${
            isVideoEnabled 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
          aria-label={isVideoEnabled ? "Turn off video" : "Turn on video"}
        >
          {isVideoEnabled ? (
            <Video size={20} className="sm:w-6 sm:h-6 text-white" />
          ) : (
            <VideoOff size={20} className="sm:w-6 sm:h-6 text-white" />
          )}
        </button>

        <button
          onClick={endCall}
          className="p-3 sm:p-4 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
          aria-label="End call"
        >
          <PhoneOff size={20} className="sm:w-6 sm:h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;