import { apiClient } from "./api-client";

export type CallSignal = {
  type: "offer" | "answer" | "ice-candidate" | "start-call" | "end-call" | "chat";
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  text?: string;
  time?: string;
};

type CallEvents = {
  localStream: (stream: MediaStream) => void;
  remoteStream: (stream: MediaStream) => void;
  room: (ready: boolean, name?: string) => void;
  state: (state: "joining" | "ready" | "connecting" | "connected" | "ended") => void;
  error: (message: string) => void;
  chat: (text: string, time: string) => void;
  relay: (configured: boolean) => void;
};

// One shared signaling transport avoids split WebSocket/HTTP rooms on serverless.
// Only the doctor creates offers, so simultaneous button clicks cannot cause glare.
export class ConsultationCall {
  private stopped = false;
  private joined = false;
  private peerReady = false;
  private joinedAt = "";
  private cursor: string | null = null;
  private peer: RTCPeerConnection | null = null;
  private stream: MediaStream | null = null;
  private mediaPromise: Promise<MediaStream | null> | null = null;
  private candidates: RTCIceCandidateInit[] = [];
  private offering = false;
  private offeredAt = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatAt = 0;
  private connectionTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private roomId: string, private doctor: boolean, private events: CallEvents) {}

  private path(suffix: string) { return `/consultation/${encodeURIComponent(this.roomId)}/${suffix}`; }

  async join() {
    if (this.stopped) return;
    this.events.state("joining");
    try {
      const room = await apiClient.post<{
        peer_ready: boolean; other_participant?: string; joined_at: string;
        ice_servers: RTCIceServer[]; relay_configured: boolean;
      }>(this.path("join"));
      if (this.stopped) return;
      this.joined = true;
      this.joinedAt = room.joined_at;
      this.peerReady = room.peer_ready;
      this.events.room(room.peer_ready, room.other_participant);
      this.events.relay(room.relay_configured);
      this.peer = new RTCPeerConnection({ iceServers: room.ice_servers });
      this.peer.onicecandidate = ({ candidate }) => {
        if (candidate) void this.send({ type: "ice-candidate", candidate: candidate.toJSON() }).catch(() => {});
      };
      this.peer.ontrack = ({ streams, track }) => {
        if (this.stopped) return;
        this.events.remoteStream(streams[0] || new MediaStream([track]));
      };
      this.peer.onconnectionstatechange = () => {
        if (this.stopped || !this.peer) return;
        if (this.peer.connectionState === "connected") {
          this.clearConnectionTimer();
          this.events.state("connected");
          this.events.error("");
        } else if (this.peer.connectionState === "failed") {
          this.clearConnectionTimer();
          this.events.error("Video could not connect. Retry the call. If this continues on mobile data, a TURN relay must be configured by the service administrator.");
          this.events.state("ready");
        } else if (this.peer.connectionState === "disconnected") {
          this.events.error("The video connection was interrupted. Check your internet connection.");
        }
      };
      this.events.state("ready");
      // Poll immediately; never wait for a WebSocket timeout to discover the peer.
      void this.poll();
      await this.media();
    } catch (error) {
      if (!this.stopped) this.events.error(error instanceof Error ? error.message : "Unable to join the consultation.");
    }
  }

  private async media(): Promise<MediaStream | null> {
    if (this.stream) return this.stream;
    if (this.mediaPromise) return this.mediaPromise;
    this.mediaPromise = (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 360 } }, audio: true });
        if (this.stopped) { stream.getTracks().forEach(track => track.stop()); return null; }
        this.stream = stream;
        stream.getTracks().forEach(track => this.peer?.addTrack(track, stream));
        this.events.localStream(stream);
        return stream;
      } catch (error) {
        if (!this.stopped) {
          const name = error instanceof Error ? error.name : "";
          this.events.error(name === "NotFoundError"
            ? "No camera or microphone was found. Connect a device and retry."
            : name === "NotReadableError"
            ? "Your camera or microphone is busy. Close other apps using it and retry."
            : "Allow camera and microphone access in your browser, then retry. Video requires HTTPS or localhost.");
        }
        return null;
      }
    })();
    try { return await this.mediaPromise; } finally { this.mediaPromise = null; }
  }

  private async send(signal: CallSignal) {
    if (this.stopped || !this.joined) throw new Error("Join the consultation before starting the call.");
    try { await apiClient.post(this.path("signal"), signal); }
    catch (error) {
      if (!this.stopped) this.events.error("The consultation signal could not be sent. Check your connection and retry.");
      throw error;
    }
  }

  async start() {
    if (!this.joined || !this.peerReady) {
      this.events.error("Wait for your consultation partner to join before starting.");
      return;
    }
    if (!await this.media() || this.stopped) return;
    this.events.error("");
    this.events.state("connecting");
    this.clearConnectionTimer();
    this.connectionTimer = setTimeout(() => {
      if (!this.stopped && this.peer?.connectionState !== "connected") {
        this.events.state("ready");
        this.events.error("The call has not connected. Ask your partner to stay in the room and retry. A TURN relay may be required for your network.");
      }
    }, 20000);
    try {
      if (this.doctor) await this.offer();
      else await this.send({ type: "start-call" });
    } catch {
      if (!this.stopped) { this.clearConnectionTimer(); this.events.state("ready"); }
    }
  }

  private async offer(rejoining = false) {
    if (this.offering || !this.peer || this.stopped || (!rejoining && this.peer.connectionState === "connected")) return;
    this.offering = true;
    try {
      if (!await this.media() || this.stopped) return;
      if (this.peer.signalingState === "have-local-offer") {
        // A patient start request can arrive just after the doctor's button click.
        // Keep the pending offer; only replace it after the connection timeout.
        if (Date.now() - this.offeredAt < 20000) return;
        await this.peer.setLocalDescription({ type: "rollback" });
      }
      if (this.peer.signalingState !== "stable") return;
      this.events.state("connecting");
      const offer = await this.peer.createOffer({ iceRestart: true });
      if (this.stopped) return;
      await this.peer.setLocalDescription(offer);
      this.offeredAt = Date.now();
      await this.send({ type: "offer", offer });
    } finally { this.offering = false; }
  }

  private async receive(message: CallSignal) {
    if (this.stopped || !this.peer) return;
    const peer = this.peer;
    if (message.type === "start-call" && this.doctor) await this.offer(true);
    if (message.type === "offer" && message.offer && !this.doctor) {
      if (!await this.media() || this.stopped) return;
      this.events.state("connecting");
      await peer.setRemoteDescription(message.offer);
      await this.flushCandidates();
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      await this.send({ type: "answer", answer });
    }
    if (message.type === "answer" && message.answer && this.doctor && peer.signalingState === "have-local-offer") {
      await peer.setRemoteDescription(message.answer);
      await this.flushCandidates();
      if (peer.connectionState === "connected") {
        this.clearConnectionTimer();
        this.events.state("connected");
      }
    }
    if (message.type === "ice-candidate" && message.candidate) {
      if (peer.remoteDescription) await peer.addIceCandidate(message.candidate);
      else this.candidates.push(message.candidate);
    }
    if (message.type === "chat" && message.text) this.events.chat(message.text, message.time || "");
    if (message.type === "end-call") {
      this.events.error("Your consultation partner ended the call.");
      this.dispose();
      this.events.state("ended");
    }
  }

  private async flushCandidates() {
    for (const candidate of this.candidates.splice(0)) await this.peer?.addIceCandidate(candidate);
  }

  private async poll() {
    if (this.stopped) return;
    try {
      if (Date.now() - this.heartbeatAt > 5000) {
        const heartbeat = await apiClient.post<{ peer_ready: boolean }>(this.path("heartbeat"));
        if (this.stopped) return;
        this.heartbeatAt = Date.now();
        this.peerReady = heartbeat.peer_ready;
        this.events.room(heartbeat.peer_ready);
      }
      const query = new URLSearchParams({ since: this.joinedAt });
      if (this.cursor) query.set("after_id", this.cursor);
      const data = await apiClient.get<{ signals: { id: string; payload: CallSignal }[] }>(this.path(`signals?${query}`));
      if (this.stopped) return;
      for (const item of data.signals) {
        // Advance even on a malformed signal, so a poison message cannot freeze the room.
        try { await this.receive(item.payload); }
        catch { if (!this.stopped) this.events.error("A call update failed. Retry the connection."); }
        this.cursor = item.id;
        if (this.stopped) break;
      }
    } catch (error) {
      if (!this.stopped) this.events.error(error instanceof Error ? error.message : "Consultation connection interrupted.");
    } finally {
      if (!this.stopped) this.timer = setTimeout(() => void this.poll(), 1000);
    }
  }

  async chat(text: string, time: string) { await this.send({ type: "chat", text, time }); }
  mute(muted: boolean) { this.stream?.getAudioTracks().forEach(track => { track.enabled = !muted; }); }
  camera(off: boolean) { this.stream?.getVideoTracks().forEach(track => { track.enabled = !off; }); }
  private clearConnectionTimer() { if (this.connectionTimer) clearTimeout(this.connectionTimer); }
  async end() {
    try { if (this.joined && !this.stopped) await this.send({ type: "end-call" }); }
    finally { this.dispose(); }
  }
  dispose() {
    if (this.stopped) return;
    this.stopped = true;
    if (this.timer) clearTimeout(this.timer);
    this.clearConnectionTimer();
    if (this.peer) {
      this.peer.ontrack = null;
      this.peer.onicecandidate = null;
      this.peer.onconnectionstatechange = null;
      this.peer.close();
    }
    this.stream?.getTracks().forEach(track => track.stop());
    if (this.joined) void apiClient.post(this.path("leave")).catch(() => {});
  }
}
