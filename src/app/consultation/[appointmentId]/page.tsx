"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type SignalMessage = {
  type: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

export default function ConsultationPage() {
  const params = useParams();
  const router = useRouter();

  const appointmentId = params.appointmentId as string;

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [connected, setConnected] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [error, setError] = useState("");

  const sendSignal = useCallback((message: SignalMessage) => {
    const socket = socketRef.current;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, []);

  const createPeerConnection = useCallback(() => {
    if (peerRef.current) {
      return peerRef.current;
    }

    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({
          type: "ice-candidate",
          candidate: event.candidate.toJSON(),
        });
      }
    };

    peer.ontrack = (event) => {
      const [remoteStream] = event.streams;

      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    peer.onconnectionstatechange = () => {
      if (
        peer.connectionState === "failed" ||
        peer.connectionState === "disconnected"
      ) {
        setError("The consultation connection was lost.");
      }
    };

    peerRef.current = peer;

    return peer;
  }, [sendSignal]);

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

      setError(
        "Camera or microphone permission was denied or unavailable.",
      );

      return null;
    }
  }, [createPeerConnection]);

  useEffect(() => {
    if (!appointmentId) {
      return;
    }

    const protocol =
      window.location.protocol === "https:" ? "wss:" : "ws:";

    const host =
      process.env.NEXT_PUBLIC_API_URL
        ?.replace(/^https?:\/\//, "")
        .replace(/\/api\/v1$/, "") ||
      "127.0.0.1:8000";

    const socket = new WebSocket(
      `${protocol}//${host}/ws/${appointmentId}`,
    );

    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setError("");
    };

    socket.onclose = () => {
      setConnected(false);
    };

    socket.onerror = () => {
      setError("Unable to connect to the consultation server.");
    };

    socket.onmessage = async (event) => {
      const message: SignalMessage = JSON.parse(event.data);

      const peer = createPeerConnection();

      if (message.type === "offer" && message.offer) {
        await peer.setRemoteDescription(
          new RTCSessionDescription(message.offer),
        );

        await startLocalMedia();

        const answer = await peer.createAnswer();

        await peer.setLocalDescription(answer);

        sendSignal({
          type: "answer",
          answer,
        });

        setCallStarted(true);
      }

      if (message.type === "answer" && message.answer) {
        await peer.setRemoteDescription(
          new RTCSessionDescription(message.answer),
        );

        setCallStarted(true);
      }

      if (message.type === "ice-candidate" && message.candidate) {
        try {
          await peer.addIceCandidate(
            new RTCIceCandidate(message.candidate),
          );
        } catch (err) {
          console.error("ICE candidate error:", err);
        }
      }
    };

    return () => {
      socket.close();

      peerRef.current?.close();

      localStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      socketRef.current = null;
      peerRef.current = null;
      localStreamRef.current = null;
    };
  }, [
    appointmentId,
    createPeerConnection,
    sendSignal,
    startLocalMedia,
  ]);

  const startCall = async () => {
    setError("");

    const stream = await startLocalMedia();

    if (!stream) {
      return;
    }

    const peer = createPeerConnection();

    const offer = await peer.createOffer();

    await peer.setLocalDescription(offer);

    sendSignal({
      type: "offer",
      offer,
    });

    setCallStarted(true);
  };

  const toggleMute = () => {
    const stream = localStreamRef.current;

    if (!stream) {
      return;
    }

    const audioTrack = stream.getAudioTracks()[0];

    if (!audioTrack) {
      return;
    }

    audioTrack.enabled = !audioTrack.enabled;
    setMuted(!audioTrack.enabled);
  };

  const toggleCamera = () => {
    const stream = localStreamRef.current;

    if (!stream) {
      return;
    }

    const videoTrack = stream.getVideoTracks()[0];

    if (!videoTrack) {
      return;
    }

    videoTrack.enabled = !videoTrack.enabled;
    setCameraOff(!videoTrack.enabled);
  };

  const endCall = () => {
    peerRef.current?.close();

    localStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    socketRef.current?.close();

    router.back();
  };

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-400">RuralCare</p>

            <h1 className="text-2xl font-bold">
              Video Consultation
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Appointment: {appointmentId}
            </p>
          </div>

          <div
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              connected
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {connected ? "Connected" : "Connecting..."}
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />

            <div className="absolute left-4 top-4 rounded-lg bg-black/50 px-3 py-1 text-xs">
              Remote Participant
            </div>

            {!callStarted && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-slate-400">
                  Waiting for the other participant...
                </p>
              </div>
            )}
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />

            <div className="absolute left-4 top-4 rounded-lg bg-black/50 px-3 py-1 text-xs">
              You
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {!callStarted && (
            <button
              onClick={startCall}
              disabled={!connected}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Start Consultation
            </button>
          )}

          {callStarted && (
            <>
              <button
                onClick={toggleMute}
                className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-medium hover:bg-slate-700"
              >
                {muted ? "Unmute" : "Mute"}
              </button>

              <button
                onClick={toggleCamera}
                className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-medium hover:bg-slate-700"
              >
                {cameraOff ? "Camera On" : "Camera Off"}
              </button>
            </>
          )}

          <button
            onClick={endCall}
            className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold hover:bg-red-700"
          >
            End Consultation
          </button>
        </div>
      </div>
    </main>
  );
}