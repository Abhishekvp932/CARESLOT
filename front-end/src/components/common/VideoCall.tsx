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
  const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);
  
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [incomingCallFrom, setIncomingCallFrom] = useState<string>('');
  const [remoteSocketId, setRemoteSocketId] = useState<string>('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Attach remote stream whenever it changes or video ref becomes available
  useEffect(() => {
    if (remoteStreamRef.current && remoteVideoRef.current) {
      console.log("✅ Attaching remote stream to video element");
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
      remoteVideoRef.current.play().catch(err => console.log("Remote video play error:", err));
    }
  }, [remoteStreamRef.current, callStatus]);

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
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallStatus('active');
        setRemoteSocketId(from);
        // Process queued ICE candidates
        await processIceCandidatesQueue();
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

    socket.on("receive-call", async ({ from, offer }) => {
      console.log("Receive call from:", from);
      setIncomingCallFrom(from);
      setRemoteSocketId(from);
      setCallStatus('incoming');
      sessionStorage.setItem('pendingOffer', JSON.stringify(offer));
    });

    socket.on("call-answered", async ({ answer, from }) => {
      console.log("Call answered by:", from);
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallStatus('active');
        setRemoteSocketId(from);
        // Process queued ICE candidates
        await processIceCandidatesQueue();
      }
    });

    socket.on("ice-candidate", async ({ candidate, from }) => {
      console.log("ICE candidate from:", from);
      if (pcRef.current && pcRef.current.remoteDescription) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("✅ Added ICE candidate");
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      } else {
        console.log("⏳ Queuing ICE candidate (remote description not set yet)");
        iceCandidatesQueue.current.push(candidate);
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
      socket.off("receive-call");
      socket.off("call-answered");
      socket.off("ice-candidate");
      cleanup();
    };
  }, [appointmentId, userId, onCallEnd]);

  const processIceCandidatesQueue = async () => {
    if (pcRef.current && pcRef.current.remoteDescription && iceCandidatesQueue.current.length > 0) {
      console.log(`Processing ${iceCandidatesQueue.current.length} queued ICE candidates`);
      for (const candidate of iceCandidatesQueue.current) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("✅ Added queued ICE candidate");
        } catch (err) {
          console.error("Error adding queued ICE candidate:", err);
        }
      }
      iceCandidatesQueue.current = [];
    }
  };

  const setupPeerConnection = async (targetSocketId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
          ],
        },
        {
          urls: "turn:relay1.expressturn.com:3478",
          username: "efQnZ1k1eZ8W4M6x2xqz1AovxjP9Pz8t2",
          credential: "8fYEH2H7mRQp4aC6xPq8rLs6bK3vKc9D",
        },
      ]
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
      console.log("🎥 Received remote track:", event.track.kind);
      const stream = event.streams[0];
      
      if (stream) {
        console.log("✅ Remote stream received with", stream.getTracks().length, "tracks");
        remoteStreamRef.current = stream;
        
        // Force update by setting srcObject immediately
        if (remoteVideoRef.current) {
          console.log("✅ Immediately attaching remote stream to video element");
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.play().catch(err => console.log("Remote video play error:", err));
        }
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate to:", targetSocketId);
        socket.emit("ice-candidate", { 
          appointmentId, 
          candidate: event.candidate,
          to: targetSocketId
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        console.error("Connection failed or disconnected");
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
    };

    pc.onicegatheringstatechange = () => {
      console.log("ICE gathering state:", pc.iceGatheringState);
    };

    return pc;
  };

  const startCall = async () => {
    console.log("Starting call to user:", otherUserId);
    setCallStatus('calling');
    
    // Use remoteSocketId if available, otherwise let server route by userId
    const targetId = remoteSocketId || otherUserId;
    const pc = await setupPeerConnection(targetId);
    if (!pc) {
      setCallStatus('idle');
      return;
    }

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    console.log("Sending start-call to user:", otherUserId, "socket:", remoteSocketId);
    socket.emit("start-call", { 
      appointmentId, 
      offer, 
      to: otherUserId, // Send to user ID, server will route to correct socket
      from: userId
    });
  };

  const acceptCall = async () => {
    console.log("Accepting call from:", incomingCallFrom);
    const pc = await setupPeerConnection(incomingCallFrom);
    if (!pc) {
      setCallStatus('idle');
      return;
    }

    const offerStr = sessionStorage.getItem('pendingOffer');
    if (offerStr) {
      const offer = JSON.parse(offerStr);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Process any queued ICE candidates
      await processIceCandidatesQueue();
      
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      console.log("Sending accept-call to:", incomingCallFrom);
      socket.emit("accept-call", { 
        appointmentId, 
        answer, 
        to: incomingCallFrom
      });
      
      setCallStatus('active');
      sessionStorage.removeItem('pendingOffer');
    }
  };

  const rejectCall = () => {
    console.log("Rejecting call from:", incomingCallFrom);
    socket.emit("reject-call", { 
      appointmentId, 
      to: incomingCallFrom 
    });
    setCallStatus('idle');
    sessionStorage.removeItem('pendingOffer');
  };

  const endCall = () => {
    console.log("Ending call with:", remoteSocketId);
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
    iceCandidatesQueue.current = [];
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
          {remoteSocketId && (
            <p className="text-green-600 text-sm mt-2">✓ Other user is online</p>
          )}
          {!remoteSocketId && (
            <p className="text-amber-600 text-sm mt-2">⏳ Waiting for other user to join...</p>
          )}
        </div>
      </div>
    );
  }

  if (callStatus === 'calling') {
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
            <p className="text-gray-600">Waiting for the other person to answer</p>
          </div>
          <button
            onClick={() => {
              cleanup();
              setCallStatus('idle');
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Cancel Call
          </button>
        </div>
      </div>
    );
  }

  if (callStatus === 'incoming') {
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

  if (callStatus === 'rejected') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOff size={48} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-red-600">Call Rejected</h2>
          <p className="text-gray-600">The call was declined</p>
        </div>
      </div>
    );
  }

  if (callStatus === 'ended') {
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
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="animate-pulse mb-2">📹</div>
                <p>Waiting for remote video...</p>
              </div>
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
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isAudioEnabled ? (
            <Phone size={24} className="text-white" />
          ) : (
            <PhoneOff size={24} className="text-white" />
          )}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-colors ${
            isVideoEnabled 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-red-500 hover:bg-red-600'
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