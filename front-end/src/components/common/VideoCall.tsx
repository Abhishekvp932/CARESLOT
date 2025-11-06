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
  
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [incomingCallFrom, setIncomingCallFrom] = useState<string>('');
  const [remoteSocketId, setRemoteSocketId] = useState<string>('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [remoteVideoReady, setRemoteVideoReady] = useState(false);
  const [tracksReceived, setTracksReceived] = useState({ video: false, audio: false });

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
      }
    });

    socket.on("ice-candidate", async ({ candidate, from }) => {
      console.log("ICE candidate from:", from);
      if (pcRef.current && pcRef.current.remoteDescription) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
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
    };
  }, [appointmentId, userId, onCallEnd]);

  // Attach remote stream when it's available - using a better dependency
  const [remoteStreamUpdate, setRemoteStreamUpdate] = useState(0);
  
  useEffect(() => {
    if (remoteStreamRef.current && remoteVideoRef.current) {
      console.log("🔄 Attaching remote stream to video element");
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
      remoteVideoRef.current.play().catch(err => console.log("Remote video play error:", err));
      setRemoteVideoReady(true);
    }
  }, [remoteStreamUpdate]);

  const setupPeerConnection = async (targetSocketId?: string) => {
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
        video: { width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: true 
      });
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        console.log("📹 Attaching local stream to video element");
        localVideoRef.current.srcObject = stream;
        
        // Add event listeners for local video too
        localVideoRef.current.onloadedmetadata = () => {
          console.log("📺 Local video metadata loaded");
        };
        
        localVideoRef.current.play().catch(err => console.log("Local video play error:", err));
      }
      
      stream.getTracks().forEach(track => {
        console.log("➕ Adding track to peer connection:", track.kind, "enabled:", track.enabled, "readyState:", track.readyState);
        pc.addTrack(track, stream);
      });
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Could not access camera/microphone. Please check permissions.");
      return null;
    }

    pc.ontrack = (event) => {
      console.log("🎥 Received remote track:", event.track.kind, "readyState:", event.track.readyState);
      
      // Update tracks received status
      setTracksReceived(prev => ({
        ...prev,
        [event.track.kind]: true
      }));
      
      // Log all streams
      event.streams.forEach((stream, index) => {
        console.log(`Stream ${index}:`, stream.id, "tracks:", stream.getTracks().length);
      });
      
      const stream = event.streams[0];
      
      if (stream) {
        console.log("✅ Setting remote stream reference with", stream.getTracks().length, "tracks");
        remoteStreamRef.current = stream;
        
        // Force update to trigger useEffect
        setRemoteStreamUpdate(prev => prev + 1);
        
        // Immediately attach to video element
        if (remoteVideoRef.current) {
          console.log("✅ Directly attaching remote stream to video element");
          remoteVideoRef.current.srcObject = stream;
          
          // Add event listeners to track video status
          remoteVideoRef.current.onloadedmetadata = () => {
            console.log("📺 Remote video metadata loaded");
            remoteVideoRef.current?.play()
              .then(() => console.log("✅ Remote video playing"))
              .catch(err => console.error("❌ Remote video play error:", err));
          };
          
          remoteVideoRef.current.onplay = () => {
            console.log("▶️ Remote video started playing");
            setRemoteVideoReady(true);
          };
          
          remoteVideoRef.current.onerror = (e) => {
            console.error("❌ Remote video error:", e);
          };
          
          // Try to play immediately
          remoteVideoRef.current.play()
            .then(() => console.log("✅ Remote video play initiated"))
            .catch(err => console.log("⏳ Remote video play pending:", err.message));
        }
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const targetId = targetSocketId || remoteSocketId;
        if (targetId) {
          console.log("Sending ICE candidate to:", targetId);
          socket.emit("ice-candidate", { 
            appointmentId, 
            candidate: event.candidate,
            to: targetId
          });
        }
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("🔌 Connection state:", pc.connectionState);
      if (pc.connectionState === 'connected') {
        console.log("✅ Peer connection established!");
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        console.error("❌ Connection failed or disconnected");
        setRemoteVideoReady(false);
    setTracksReceived({ video: false, audio: false });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("🧊 ICE connection state:", pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        console.log("✅ ICE connection successful!");
      }
    };
    
    pc.onsignalingstatechange = () => {
      console.log("📡 Signaling state:", pc.signalingState);
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
        offerToReceiveVideo: true
      });
      console.log("📝 Created offer:", offer.type);
      await pc.setLocalDescription(offer);
      console.log("✅ Set local description");
      
      console.log("📤 Sending start-call to:", otherUserId);
      socket.emit("start-call", { 
        appointmentId, 
        offer, 
        to: otherUserId,
        from: userId
      });
    } catch (err) {
      console.error("❌ Error in startCall:", err);
      alert("Failed to start call: " + err);
      setCallStatus('idle');
      cleanup();
    }
  };

  const acceptCall = async () => {
    console.log("📞 Accepting call from:", incomingCallFrom);
    const pc = await setupPeerConnection(incomingCallFrom);
    if (!pc) {
      setCallStatus('idle');
      return;
    }

    try {
      const offerStr = sessionStorage.getItem('pendingOffer');
      if (offerStr) {
        const offer = JSON.parse(offerStr);
        console.log("📝 Setting remote description from offer");
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        console.log("✅ Remote description set");
        
        console.log("📝 Creating answer");
        const answer = await pc.createAnswer();
        console.log("✅ Answer created:", answer.type);
        await pc.setLocalDescription(answer);
        console.log("✅ Local description set");
        
        console.log("📤 Sending accept-call to:", incomingCallFrom);
        socket.emit("accept-call", { 
          appointmentId, 
          answer, 
          to: incomingCallFrom
        });
        
        setCallStatus('active');
        sessionStorage.removeItem('pendingOffer');
      }
    } catch (err) {
      console.error("❌ Error in acceptCall:", err);
      alert("Failed to accept call: " + err);
      setCallStatus('idle');
      cleanup();
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
    setRemoteVideoReady(false);
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
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Video Call</h2>
          <button
            onClick={startCall}
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
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
        <div className="bg-white p-6 md:p-12 rounded-2xl shadow-lg text-center w-full max-w-md">
          {localStreamRef.current && (
            <div className="mb-6 relative">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-48 md:h-64 object-cover rounded-xl bg-black"
              />
              <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded text-sm">
                You
              </div>
            </div>
          )}
          <div className="mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Phone size={40} className="text-blue-500 md:w-12 md:h-12" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Calling...</h2>
            <p className="text-gray-600 text-sm md:text-base">Waiting for the other person to answer</p>
          </div>
          <button
            onClick={() => {
              cleanup();
              setCallStatus('idle');
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
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
        <div className="bg-white p-6 md:p-12 rounded-2xl shadow-lg text-center w-full max-w-md">
          <div className="mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Phone size={40} className="text-green-500 md:w-12 md:h-12" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Incoming Call</h2>
            <p className="text-gray-600 text-sm md:text-base">Someone is calling you...</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={acceptCall}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-semibold transition-colors"
            >
              <Phone size={20} />
              Accept
            </button>
            <button
              onClick={rejectCall}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-semibold transition-colors"
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
        <div className="bg-white p-6 md:p-12 rounded-2xl shadow-lg text-center w-full max-w-md">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOff size={40} className="text-red-500 md:w-12 md:h-12" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-red-600">Call Rejected</h2>
          <p className="text-gray-600 text-sm md:text-base">The call was declined</p>
        </div>
      </div>
    );
  }

  if (callStatus === 'ended') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 md:p-12 rounded-2xl shadow-lg text-center w-full max-w-md">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOff size={40} className="text-gray-500 md:w-12 md:h-12" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">Call Ended</h2>
          <p className="text-gray-600 text-sm md:text-base">The call has been disconnected</p>
        </div>
      </div>
    );
  }

  // Active call - Responsive layout
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Video area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Remote video - full screen */}
        <div className="absolute inset-0 bg-black">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteVideoReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-white text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video size={32} />
                </div>
                <p className="mb-2">Connecting...</p>
                <div className="text-xs text-gray-400">
                  <p>Audio: {tracksReceived.audio ? '✓' : '...'}</p>
                  <p>Video: {tracksReceived.video ? '✓' : '...'}</p>
                </div>
              </div>
            </div>
          )}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
            Other User
          </div>
        </div>

        {/* Local video - picture in picture */}
        <div className="absolute bottom-4 right-4 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-gray-600">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            You
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-800">
        <button
          onClick={toggleAudio}
          className={`p-3 sm:p-4 rounded-full transition-colors ${
            isAudioEnabled 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
          title={isAudioEnabled ? "Mute" : "Unmute"}
        >
          {isAudioEnabled ? (
            <Phone size={20} className="text-white sm:w-6 sm:h-6" />
          ) : (
            <PhoneOff size={20} className="text-white sm:w-6 sm:h-6" />
          )}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-3 sm:p-4 rounded-full transition-colors ${
            isVideoEnabled 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
          title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
        >
          {isVideoEnabled ? (
            <Video size={20} className="text-white sm:w-6 sm:h-6" />
          ) : (
            <VideoOff size={20} className="text-white sm:w-6 sm:h-6" />
          )}
        </button>

        <button
          onClick={endCall}
          className="p-3 sm:p-4 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
          title="End call"
        >
          <PhoneOff size={20} className="text-white sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;