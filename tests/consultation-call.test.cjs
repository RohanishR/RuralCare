const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const compiled = ts.transpileModule(fs.readFileSync("src/lib/consultation-call.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function setup(api, media) {
  const states = [], errors = [], rooms = [], timers = [];
  const track = { enabled: true, stop() { this.stopped = true; } };
  const stream = { getTracks: () => [track], getAudioTracks: () => [track], getVideoTracks: () => [track] };
  const peers = [];
  class Peer {
    constructor() { this.signalingState = "stable"; this.connectionState = "new"; this.candidates = []; peers.push(this); }
    addTrack() {}
    close() { this.closed = true; }
    async createOffer() { return { type: "offer", sdp: "synthetic offer" }; }
    async createAnswer() { return { type: "answer", sdp: "synthetic answer" }; }
    async setLocalDescription(value) { this.signalingState = value.type === "offer" ? "have-local-offer" : "stable"; }
    async setRemoteDescription(value) { this.remoteDescription = value; this.signalingState = value.type === "offer" ? "have-remote-offer" : "stable"; }
    async addIceCandidate(value) { this.candidates.push(value); }
  }
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, require: () => ({ apiClient: api }), Error, Date, URLSearchParams,
    navigator: { mediaDevices: { getUserMedia: () => media ? media(stream) : Promise.resolve(stream) } }, RTCPeerConnection: Peer,
    setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; }, clearTimeout: () => {},
  });
  const call = new exports.ConsultationCall("room", true, {
    localStream() {}, remoteStream() {}, room: ready => rooms.push(ready), relay() {}, chat() {},
    state: state => states.push(state), error: error => errors.push(error),
  });
  return { call, states, errors, rooms, peers, timers, track };
}

const tick = () => new Promise(resolve => setImmediate(resolve));
function api(signals = []) {
  const sent = [];
  return {
    sent,
    post: async (url, payload) => {
      if (url.endsWith("/join")) return { peer_ready: true, joined_at: "2026-10-10T12:00:00Z", ice_servers: [], relay_configured: false };
      if (url.endsWith("/heartbeat")) return { peer_ready: true };
      if (url.endsWith("/signal")) sent.push(payload);
      return {};
    },
    get: async () => ({ signals }),
  };
}

test("join failures never mark the room ready or acquire media", async () => {
  let mediaCalls = 0;
  const context = setup({ post: async () => { throw new Error("Forbidden"); } }, async () => { mediaCalls++; });
  await context.call.join();
  assert.deepEqual(context.states, ["joining"]);
  assert.equal(mediaCalls, 0);
  assert.equal(context.errors[0], "Forbidden");
  context.call.dispose();
});

test("concurrent starts produce one offer and do not claim video connected", async () => {
  const backend = api();
  const context = setup(backend, async stream => stream);
  await context.call.join();
  await Promise.all([context.call.start(), context.call.start()]);
  assert.equal(backend.sent.filter(signal => signal.type === "offer").length, 1);
  assert.equal(context.states.includes("connected"), false);
  context.peers[0].connectionState = "connected";
  context.peers[0].onconnectionstatechange();
  assert.equal(context.states.at(-1), "connected");
  context.call.dispose();
  assert.equal(context.track.stopped, true);
});

test("media resolving after unmount is stopped without creating a leak", async () => {
  let resolveMedia;
  const context = setup(api(), stream => new Promise(resolve => { resolveMedia = () => resolve(stream); }));
  const joining = context.call.join();
  await tick();
  context.call.dispose();
  resolveMedia();
  await joining;
  assert.equal(context.track.stopped, true);
  assert.equal(context.peers[0].closed, true);
});

test("delayed patient start does not replace a pending doctor offer", async () => {
  let incoming = [];
  const backend = api();
  backend.get = async () => ({ signals: incoming });
  const context = setup(backend);
  await context.call.join();
  await tick();
  await context.call.start();
  incoming = [{ id: "1", payload: { type: "start-call" } }];
  await context.timers.find(timer => timer.ms === 1000).fn();
  await tick();
  assert.equal(backend.sent.filter(signal => signal.type === "offer").length, 1);
  context.call.dispose();
});

test("ICE before answer is queued and flushed after remote description", async () => {
  let incoming = [];
  const backend = api();
  backend.get = async () => ({ signals: incoming });
  const context = setup(backend, async stream => stream);
  await context.call.join();
  await tick();
  await context.call.start();
  incoming = [
    { id: "1", payload: { type: "ice-candidate", candidate: { candidate: "synthetic" } } },
    { id: "2", payload: { type: "answer", answer: { type: "answer", sdp: "synthetic" } } },
  ];
  await context.timers.find(timer => timer.ms === 1000).fn();
  await tick();
  assert.equal(context.peers[0].candidates.length, 1);
  context.call.dispose();
});
