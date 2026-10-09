"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, type Appointment } from "@/lib/api-client";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Send, Save, ArrowLeft } from "lucide-react";

type SignalMessage = {
  type: string;
  error?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

type ChatMessage = {
  sender: string;
  text: string;
  time: string;
};

export default function ConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";

  const appointmentId = params.appointmentId as string;

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const [connected, setConnected] = useState(false);
  const [peerReady, setPeerReady] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [error, setError] = useState("");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatReady, setChatReady] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [notesLoaded, setNotesLoaded] = useState(false);

  useEffect(() => {
    if (!isDoctor) return;
    let active = true;
    apiClient.get<Appointment>(`/appointments/${appointmentId}`).then(appointment => {
      if (active) { setNotes(appointment.notes || ""); setNotesLoaded(true); }
    }).catch(() => {
      if (active) setError("Existing notes could not be loaded. Refresh before editing notes.");
    });
    return () => { active = false; };
  }, [appointmentId, isDoctor]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendSignal = useCallback((message: SignalMessage) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, []);

  const setupDataChannel = useCallback((channel: RTCDataChannel) => {
    dataChannelRef.current = channel;
    channel.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setChatMessages((prev) => [...prev, { sender: "Remote", text: msg.text, time: msg.time }]);
    };
    channel.onopen = () => setChatReady(true);
    channel.onclose = () => setChatReady(false);
  }, []);

  const createPeerConnection = useCallback(() => {
    if (peerRef.current) {
      return peerRef.current;
    }

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({ type: "ice-candidate", candidate: event.candidate.toJSON() });
      }
    };

    peer.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    peer.ondatachannel = (event) => {
      setupDataChannel(event.channel);
    };

    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "failed" || peer.connectionState === "disconnected") {
        setError("The consultation connection was lost.");
      }
    };

    peerRef.current = peer;
    return peer;
  }, [sendSignal, setupDataChannel]);

  const startLocalMedia = useCallback(async () => {
    if (localStreamRef.current) {
      return localStreamRef.current;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peer = createPeerConnection();
      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      return stream;
    } catch (err) {
      console.error(err);
      setError("Camera or microphone permission was denied or unavailable.");
      return null;
    }
  }, [createPeerConnection]);

  const flushPendingCandidates = useCallback(async (peer: RTCPeerConnection) => {
    for (const candidate of pendingCandidatesRef.current.splice(0)) {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }, []);

  const beginOffer = useCallback(async () => {
    if (!peerReady || peerRef.current?.localDescription) return;
    setError("");
    const stream = await startLocalMedia();
    if (!stream) return;
    const peer = createPeerConnection();
    const dc = peer.createDataChannel("chat");
    setupDataChannel(dc);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    sendSignal({ type: "offer", offer });
  }, [createPeerConnection, peerReady, sendSignal, setupDataChannel, startLocalMedia]);

  useEffect(() => {
    if (!appointmentId) return;

    const getBaseUrl = () => {
      if (typeof window !== "undefined") {
        return window.location.origin;
      }
      return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    };
    const signalingUrl = new URL(getBaseUrl());
    signalingUrl.protocol = signalingUrl.protocol === "https:" ? "wss:" : "ws:";
    signalingUrl.pathname = `/ws/${encodeURIComponent(appointmentId)}`;
    
    const token = Cookies.get("access_token");
    if (!token) {
      setError("Please sign in before joining a consultation.");
      return;
    }

    signalingUrl.searchParams.set("token", token);
    const socket = new WebSocket(signalingUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setError("");
    };

    socket.onclose = (event) => {
      setConnected(false);
      setPeerReady(false);
      if (event.code !== 1000) setError(event.reason || "The consultation connection closed. Refresh to reconnect.");
    };
    socket.onerror = () => setError("Unable to connect to the consultation server.");

    socket.onmessage = async (event) => {
      const message: SignalMessage = JSON.parse(event.data);
      if (message.error) {
        setError(message.error);
        return;
      }
      if (message.type === "peer-ready") {
        setPeerReady(true);
        return;
      }
      const peer = createPeerConnection();

      if (message.type === "offer" && message.offer) {
        await peer.setRemoteDescription(new RTCSessionDescription(message.offer));
        await flushPendingCandidates(peer);
        const stream = await startLocalMedia();
        if (!stream) return;
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        sendSignal({ type: "answer", answer });
        setCallStarted(true);
      }

      if (message.type === "answer" && message.answer) {
        await peer.setRemoteDescription(new RTCSessionDescription(message.answer));
        await flushPendingCandidates(peer);
        setCallStarted(true);
      }

      if (message.type === "ice-candidate" && message.candidate) {
        try {
          if (peer.remoteDescription) {
            await peer.addIceCandidate(new RTCIceCandidate(message.candidate));
          } else {
            pendingCandidatesRef.current.push(message.candidate);
          }
        } catch (err) {
          console.error("ICE candidate error:", err);
        }
      }
    };

    return () => {
      socket.onclose = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.close();
      peerRef.current?.close();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      peerRef.current = null;
      localStreamRef.current = null;
      socketRef.current = null;
      dataChannelRef.current = null;
      pendingCandidatesRef.current = [];
    };
  }, [appointmentId, createPeerConnection, flushPendingCandidates, sendSignal, startLocalMedia]);

  const startCall = async () => {
    try {
      await beginOffer();
    } catch {
      setError("Unable to start the call. Check camera permissions and refresh to try again.");
    }
  };

  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMuted(!audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOff(!videoTrack.enabled);
    }
  };

  const endCall = () => {
    peerRef.current?.close();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    socketRef.current?.close();
    router.back();
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() && dataChannelRef.current?.readyState === "open") {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const msg = { text: chatInput, time };
      dataChannelRef.current.send(JSON.stringify(msg));
      setChatMessages((prev) => [...prev, { sender: "You", ...msg }]);
      setChatInput("");
    }
  };

  const saveNotes = async () => {
    if (!appointmentId || !notesLoaded) return;
    setSavingNotes(true);
    setNotesSaved(false);
    try {
      await apiClient.updateAppointment(appointmentId, { notes });
      setNotesSaved(true);
    } catch (err) {
      console.error(err);
      setError("Failed to save notes. Your text is still here; please try again.");
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 text-on-surface sm:p-6 lg:p-8 flex flex-col animate-in fade-in duration-500">
      <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col">
        <div className="mb-4">
          <Link
            href={isDoctor ? "/doctor/dashboard" : "/patient/dashboard"}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        <div className="mb-5 flex items-center justify-between border-b border-outline-variant pb-4">
          <div>
            <p className="text-sm text-primary font-bold uppercase tracking-wider">RuralCare</p>
            <h1 className="text-2xl font-bold mt-1 text-on-surface">Video Consultation</h1>
            <p className="mt-1 text-sm text-on-surface-variant">Appointment: {appointmentId}</p>
          </div>
          <div className={`rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2 ${
            connected ? "bg-green-100 text-green-700 border border-green-200" : "bg-orange-100 text-orange-700 border border-orange-200"
          }`}>
            <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-orange-500 animate-pulse"}`}></span>
            {connected ? "Signaling connected" : error ? "Connection unavailable" : "Connecting..."}
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-error bg-error-container p-4 text-sm text-on-error-container">
            {error}
          </div>
        )}
        {notesSaved && <p role="status" className="mb-4 text-sm text-primary">Consultation notes saved.</p>}

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          {/* Main Video Area */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="relative flex-1 bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant shadow-md flex items-center justify-center">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`h-full w-full object-cover ${!callStarted ? 'opacity-0' : 'opacity-100'}`}
              />
              <div className="absolute left-4 top-4 rounded-lg bg-surface/80 backdrop-blur-sm px-3 py-1.5 text-xs font-bold z-10 border border-outline-variant text-on-surface shadow-sm">
                Remote Participant
              </div>
              {!callStarted && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant bg-surface/90 backdrop-blur-sm z-0">
                  <div className="w-16 h-16 mb-4 rounded-full bg-surface-container flex items-center justify-center shadow-inner">
                    <Video className="w-8 h-8 text-on-surface-variant/70" />
                  </div>
                  <p className="font-bold text-lg text-on-surface">Waiting to connect</p>
                  <p className="text-sm mt-1">The consultation will begin shortly.</p>
                </div>
              )}
              
              {/* Floating Self View */}
              <div className="absolute right-4 bottom-4 w-32 sm:w-48 aspect-video bg-background rounded-xl overflow-hidden border-2 border-outline-variant shadow-lg z-10">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-2 top-2 rounded bg-surface/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold border border-outline-variant text-on-surface">
                  You
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm">
              {!callStarted ? (
                <button
                  onClick={startCall}
                  disabled={!connected || !peerReady}
                  className="rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                  <Video className="w-5 h-5" /> {peerReady ? "Start Consultation" : "Waiting for participant"}
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleMute}
                    className={`rounded-xl p-4 transition flex flex-col items-center gap-1 ${
                      muted ? "bg-error-container text-on-error-container hover:bg-error-container/80" : "bg-surface-container hover:bg-surface-variant text-on-surface"
                    }`}
                  >
                    {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={toggleCamera}
                    className={`rounded-xl p-4 transition flex flex-col items-center gap-1 ${
                      cameraOff ? "bg-error-container text-on-error-container hover:bg-error-container/80" : "bg-surface-container hover:bg-surface-variant text-on-surface"
                    }`}
                  >
                    {cameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                  </button>
                  <div className="w-px h-10 bg-outline-variant mx-2"></div>
                  <button
                    onClick={endCall}
                    className="rounded-xl bg-error p-4 text-white hover:bg-error/90 shadow-sm"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 flex flex-col gap-4">
            {/* Chat */}
            <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm min-h-[300px]">
              <div className="p-4 border-b border-outline-variant font-bold text-on-surface flex items-center justify-between">
                Chat
                <span className="text-xs text-on-surface-variant font-medium">
                  {chatReady ? "Connected" : "Waiting..."}
                </span>
              </div>
              <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                {chatMessages.length === 0 ? (
                  <p className="text-center text-sm text-on-surface-variant mt-auto mb-auto">No messages yet.</p>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
                      <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                        msg.sender === "You" ? "bg-primary text-white rounded-br-sm" : "bg-surface-container text-on-surface rounded-bl-sm"
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-on-surface-variant mt-1 mx-1">{msg.time}</span>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={sendChatMessage} className="p-3 border-t border-outline-variant bg-surface flex gap-2">
                <input
                  type="text"
                  aria-label="Chat message"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-surface-container border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-on-surface placeholder-on-surface-variant/50 transition-all"
                  disabled={!chatReady}
                />
                <button 
                  type="submit" 
                  aria-label="Send message"
                  disabled={!chatInput.trim() || !chatReady}
                  className="p-2 bg-primary rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Doctor Notes */}
            {isDoctor && (
              <div className="flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shrink-0 shadow-sm">
                <div className="p-4 border-b border-outline-variant font-bold text-on-surface flex items-center justify-between">
                  Consultation Notes
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <textarea
                    aria-label="Consultation notes"
                    maxLength={10000}
                    disabled={!notesLoaded}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add clinical notes here..."
                    className="w-full h-32 bg-surface-container border border-outline-variant/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-on-surface placeholder-on-surface-variant/50 resize-none transition-all"
                  />
                  <button
                    onClick={saveNotes}
                    disabled={savingNotes || !notesLoaded}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-surface-container hover:bg-surface-variant text-primary font-bold rounded-xl transition text-sm disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> {savingNotes ? "Saving..." : "Save Notes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
