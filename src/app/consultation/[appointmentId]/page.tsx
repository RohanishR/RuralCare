"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, type Appointment } from "@/lib/api-client";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Send, Save, ArrowLeft, RefreshCw, Users } from "lucide-react";

type SignalMessage = {
  type: string;
  error?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  text?: string;
  time?: string;
  sender?: string;
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
  const [otherParticipantName, setOtherParticipantName] = useState<string | null>(null);
  const [callStarted, setCallStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [error, setError] = useState("");
  const [connectionMode, setConnectionMode] = useState<"connecting" | "websocket" | "http">("connecting");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatReady, setChatReady] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [notesLoaded, setNotesLoaded] = useState(false);

  // REST polling state refs
  const isRestPollingRef = useRef(false);
  const lastSignalIdRef = useRef<string | null>(null);
  const processedSignalIdsRef = useRef<Set<string>>(new Set());

  // 1. Fetch notes if doctor
  useEffect(() => {
    if (!isDoctor || !appointmentId) return;
    let active = true;
    apiClient
      .get<Appointment>(`/appointments/${appointmentId}`)
      .then((appointment) => {
        if (active) {
          setNotes(appointment.notes || "");
          setNotesLoaded(true);
        }
      })
      .catch(() => {
        if (active) setError("Existing notes could not be loaded. Refresh before editing notes.");
      });
    return () => {
      active = false;
    };
  }, [appointmentId, isDoctor]);

  // 2. Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // 3. Send Signal (hybrid: WebSocket or REST)
  const sendSignal = useCallback(
    async (message: SignalMessage) => {
      const socket = socketRef.current;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      } else if (appointmentId) {
        // Fallback to REST signaling
        try {
          await apiClient.post(`/consultation/${appointmentId}/signal`, message);
        } catch (err) {
          console.error("Failed to send REST signal:", err);
        }
      }
    },
    [appointmentId]
  );

  const setupDataChannel = useCallback((channel: RTCDataChannel) => {
    dataChannelRef.current = channel;
    channel.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setChatMessages((prev) => [...prev, { sender: "Remote", text: msg.text, time: msg.time }]);
      } catch (err) {
        console.error("Error parsing chat data:", err);
      }
    };
    channel.onopen = () => setChatReady(true);
    channel.onclose = () => setChatReady(false);
  }, []);

  const createPeerConnection = useCallback(() => {
    if (peerRef.current) {
      return peerRef.current;
    }

    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
      ],
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
        setCallStarted(true);
      }
    };

    peer.ondatachannel = (event) => {
      setupDataChannel(event.channel);
    };

    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "connected") {
        setCallStarted(true);
        setError("");
      } else if (peer.connectionState === "failed") {
        setError("Direct peer connection failed. Reconnecting...");
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
        // Prevent adding tracks multiple times
        const senders = peer.getSenders();
        const alreadyAdded = senders.some((s) => s.track === track);
        if (!alreadyAdded) {
          peer.addTrack(track, stream);
        }
      });

      return stream;
    } catch (err) {
      console.warn("Camera/microphone access issue:", err);
      setError("Please allow camera and microphone access to use video consultation.");
      return null;
    }
  }, [createPeerConnection]);

  // Auto-start camera preview on mount so user sees their own feed immediately
  useEffect(() => {
    startLocalMedia();
  }, [startLocalMedia]);

  const flushPendingCandidates = useCallback(async (peer: RTCPeerConnection) => {
    for (const candidate of pendingCandidatesRef.current.splice(0)) {
      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error flushing pending ICE candidate:", err);
      }
    }
  }, []);

  const beginOffer = useCallback(async () => {
    setError("");
    const stream = await startLocalMedia();
    if (!stream) return;
    const peer = createPeerConnection();
    const dc = peer.createDataChannel("chat");
    setupDataChannel(dc);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    sendSignal({ type: "offer", offer });
  }, [createPeerConnection, sendSignal, setupDataChannel, startLocalMedia]);

  // Dispatch incoming signal message
  const handleIncomingSignal = useCallback(
    async (message: SignalMessage) => {
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
    },
    [createPeerConnection, flushPendingCandidates, sendSignal, startLocalMedia]
  );

  // 4. Room Connection & Hybrid Signaling
  useEffect(() => {
    if (!appointmentId) return;

    let isSubscribed = true;
    let pollInterval: NodeJS.Timeout | null = null;

    const token = Cookies.get("access_token");
    if (!token) {
      setError("Please sign in before joining a consultation.");
      return;
    }

    // Step A: Join via REST to guarantee access & presence
    apiClient
      .post<{ status: string; peer_ready: boolean; other_participant?: string }>(
        `/consultation/${appointmentId}/join`
      )
      .then((res) => {
        if (!isSubscribed) return;
        setConnected(true);
        if (res.peer_ready) setPeerReady(true);
        if (res.other_participant) setOtherParticipantName(res.other_participant);
      })
      .catch((err) => {
        if (isSubscribed) {
          console.warn("REST join warning:", err);
        }
      });

    // Step B: Connect via WebSocket (or fallback to REST polling)
    const startRestPolling = () => {
      if (isRestPollingRef.current) return;
      isRestPollingRef.current = true;
      setConnectionMode("http");
      setConnected(true);

      pollInterval = setInterval(async () => {
        if (!isSubscribed) return;

        // 1. Heartbeat
        try {
          const hb = await apiClient.post<{ peer_ready: boolean }>(
            `/consultation/${appointmentId}/heartbeat`
          );
          if (hb.peer_ready) setPeerReady(true);
        } catch {
          // ignore transient poll error
        }

        // 2. Poll signals
        try {
          const query = lastSignalIdRef.current ? `?after_id=${lastSignalIdRef.current}` : "";
          const data = await apiClient.get<{
            signals: Array<{ id: string; payload: SignalMessage }>;
            last_id: string;
          }>(`/consultation/${appointmentId}/signals${query}`);

          if (data?.signals && data.signals.length > 0) {
            for (const item of data.signals) {
              if (!processedSignalIdsRef.current.has(item.id)) {
                processedSignalIdsRef.current.add(item.id);
                lastSignalIdRef.current = item.id;
                await handleIncomingSignal(item.payload);
              }
            }
          }
        } catch {
          // ignore transient signal poll error
        }
      }, 1200);
    };

    // Calculate WebSocket endpoint URL
    const getWsUrl = () => {
      const isLocal =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

      const base = isLocal ? "http://localhost:8000" : window.location.origin;
      const url = new URL(base);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      url.pathname = `/ws/${encodeURIComponent(appointmentId)}`;
      url.searchParams.set("token", token);
      return url.toString();
    };

    try {
      const wsUrl = getWsUrl();
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        if (!isSubscribed) return;
        setConnected(true);
        setConnectionMode("websocket");
        setError("");
      };

      socket.onmessage = async (event) => {
        if (!isSubscribed) return;
        try {
          const message: SignalMessage = JSON.parse(event.data);
          await handleIncomingSignal(message);
        } catch (err) {
          console.error("Error parsing WS message:", err);
        }
      };

      socket.onerror = () => {
        console.info("WebSocket unavailable, switching to HTTP REST signaling...");
        startRestPolling();
      };

      socket.onclose = () => {
        if (!isSubscribed) return;
        startRestPolling();
      };
    } catch {
      startRestPolling();
    }

    return () => {
      isSubscribed = false;
      if (pollInterval) clearInterval(pollInterval);
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.onmessage = null;
        socketRef.current.onerror = null;
        socketRef.current.close();
      }
      peerRef.current?.close();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      peerRef.current = null;
      localStreamRef.current = null;
      socketRef.current = null;
      dataChannelRef.current = null;
      pendingCandidatesRef.current = [];
    };
  }, [appointmentId, handleIncomingSignal]);

  const startCall = async () => {
    try {
      await beginOffer();
    } catch {
      setError("Unable to start call. Check camera permissions and try again.");
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
    if (!chatInput.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msg = { text: chatInput, time };

    if (dataChannelRef.current?.readyState === "open") {
      dataChannelRef.current.send(JSON.stringify(msg));
    } else {
      sendSignal({ type: "chat", text: chatInput, time, sender: user?.name || "Participant" });
    }

    setChatMessages((prev) => [...prev, { sender: "You", text: chatInput, time }]);
    setChatInput("");
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
        {/* Back Link */}
        <div className="mb-4">
          <Link
            href={isDoctor ? "/doctor/dashboard" : "/patient/dashboard"}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
          <div>
            <p className="text-sm text-primary font-bold uppercase tracking-wider">RuralCare Telehealth</p>
            <h1 className="text-2xl font-bold mt-1 text-on-surface">Video Consultation</h1>
            <p className="mt-1 text-sm text-on-surface-variant">Appointment ID: {appointmentId}</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2 shadow-sm ${
                connected
                  ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800"
                  : "bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  connected ? "bg-green-500" : "bg-orange-500 animate-pulse"
                }`}
              ></span>
              {connected
                ? peerReady
                  ? "Both Participants Ready"
                  : otherParticipantName
                  ? `${otherParticipantName} Joined`
                  : "Room Connected (Waiting for peer)"
                : "Connecting to room..."}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-error bg-error-container p-4 text-sm text-on-error-container flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-4 font-bold hover:underline text-xs uppercase"
            >
              Dismiss
            </button>
          </div>
        )}

        {notesSaved && <p role="status" className="mb-4 text-sm text-primary font-semibold">Consultation notes saved successfully.</p>}

        {/* Main Video & Content Area */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          {/* Main Video Area */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="relative flex-1 bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant shadow-md flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
              {/* Remote Video Stream */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  !callStarted ? "opacity-0" : "opacity-100"
                }`}
              />

              <div className="absolute left-4 top-4 rounded-lg bg-surface/85 backdrop-blur-sm px-3 py-1.5 text-xs font-bold z-10 border border-outline-variant text-on-surface shadow-sm">
                Remote: {isDoctor ? "Patient" : "Doctor"}
              </div>

              {!callStarted && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant bg-surface/90 backdrop-blur-sm z-0 p-6 text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-surface-container flex items-center justify-center shadow-inner">
                    <Video className="w-8 h-8 text-on-surface-variant/70" />
                  </div>
                  <p className="font-bold text-xl text-on-surface">
                    {peerReady ? "Participant is Ready!" : "Waiting for other participant to join..."}
                  </p>
                  <p className="text-sm mt-1 max-w-md">
                    {peerReady
                      ? "Both participants are in the consultation room. Click 'Start Consultation' below to connect video."
                      : "Your camera and microphone preview are active below. Once the other participant joins, you can start the call."}
                  </p>
                  {!peerReady && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Listening for incoming participant...
                    </div>
                  )}
                </div>
              )}

              {/* Self View Preview */}
              <div className="absolute right-4 bottom-4 w-36 sm:w-56 aspect-video bg-background rounded-xl overflow-hidden border-2 border-primary/50 shadow-xl z-20 transition-transform hover:scale-105">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-2 top-2 rounded bg-surface/85 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold border border-outline-variant text-on-surface">
                  You ({user?.name || (isDoctor ? "Doctor" : "Patient")})
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-center gap-4 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm">
              {!callStarted ? (
                <button
                  onClick={startCall}
                  className="rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-primary/90 flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                >
                  <Video className="w-5 h-5" />
                  {peerReady ? "Start Consultation" : "Start Consultation (Ready)"}
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleMute}
                    title={muted ? "Unmute" : "Mute"}
                    className={`rounded-xl p-4 transition flex flex-col items-center gap-1 shadow-sm ${
                      muted
                        ? "bg-error-container text-on-error-container hover:bg-error-container/80"
                        : "bg-surface-container hover:bg-surface-variant text-on-surface"
                    }`}
                  >
                    {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={toggleCamera}
                    title={cameraOff ? "Turn camera on" : "Turn camera off"}
                    className={`rounded-xl p-4 transition flex flex-col items-center gap-1 shadow-sm ${
                      cameraOff
                        ? "bg-error-container text-on-error-container hover:bg-error-container/80"
                        : "bg-surface-container hover:bg-surface-variant text-on-surface"
                    }`}
                  >
                    {cameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                  </button>
                  <div className="w-px h-10 bg-outline-variant mx-2"></div>
                  <button
                    onClick={endCall}
                    title="End Call"
                    className="rounded-xl bg-error px-6 py-4 text-white hover:bg-error/90 shadow-md hover:shadow-lg flex items-center gap-2 font-semibold text-sm transition active:scale-95"
                  >
                    <PhoneOff className="w-5 h-5" />
                    End Call
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Sidebar: Chat & Doctor Notes */}
          <div className="w-full lg:w-96 flex flex-col gap-4">
            {/* Live Chat */}
            <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm min-h-[300px]">
              <div className="p-4 border-b border-outline-variant font-bold text-on-surface flex items-center justify-between">
                <span>In-Call Chat</span>
                <span className="text-xs text-on-surface-variant font-medium">
                  {chatReady ? "P2P Active" : "Online"}
                </span>
              </div>
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[180px] max-h-[320px]"
              >
                {chatMessages.length === 0 ? (
                  <p className="text-center text-xs text-on-surface-variant/70 italic mt-8">
                    Send a message to your consultation partner...
                  </p>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`rounded-2xl px-3.5 py-2 text-sm max-w-[85%] ${
                          msg.sender === "You"
                            ? "bg-primary text-white rounded-br-xs"
                            : "bg-surface-container text-on-surface rounded-bl-xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-on-surface-variant/70 mt-1 px-1">
                        {msg.sender} • {msg.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={sendChatMessage} className="p-3 border-t border-outline-variant flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl bg-surface border border-outline-variant px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="rounded-xl bg-primary px-3 py-2 text-white hover:bg-primary/90 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Doctor Clinical Notes */}
            {isDoctor && (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-on-surface">Doctor Notes</h3>
                  <button
                    onClick={saveNotes}
                    disabled={savingNotes || !notesLoaded}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {savingNotes ? "Saving..." : "Save Notes"}
                  </button>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter clinical notes, diagnoses, or follow-up instructions..."
                  rows={4}
                  className="w-full rounded-xl bg-surface border border-outline-variant p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
