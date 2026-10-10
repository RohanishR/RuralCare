# Video consultation fix — 10 October 2026

## Confirmed defects

- The frontend could send via WebSocket while its partner used HTTP polling, so they never exchanged signals. WebSocket rooms lived only in one process, with no serverless instance affinity.
- HTTP fallback claimed connection success without a successful authorized join, swallowed signaling errors, used overlapping interval requests, and waited for WebSocket failure before starting.
- Both participants created offers, causing simultaneous-start negotiation conflicts.
- Historical offers, candidates and end-call events could replay when reopening a room.
- Camera acquisition could finish after unmount, leaking active capture. Signaling success was displayed as video success before WebRTC connected.
- Fallback chat messages were not handled by the receiver. End-call did not notify the other participant.
- Only STUN servers were configured; no TURN relay was available for carrier NAT/restricted networks.

## Changes

The existing authenticated MongoDB signaling endpoints are now the single signaling transport for this page. WebRTC still carries audio/video directly or via configured TURN; no video is stored in MongoDB. Existing WebSocket endpoints remain available but are not selected by this page until cross-instance coordination is implemented.

Room join returns an authenticated ICE configuration and session start timestamp. Sequential immediate polling excludes prior sessions, queues early ICE candidates, updates presence every five seconds, and exposes failures. Only the doctor creates offers; a patient sends a start request. Rejoining patients can request a fresh offer. The UI shows connection success only when WebRTC connects. Remote playback controls handle browser autoplay restrictions. Chat delivery and remote call termination are handled. Capture cleanup includes late media promises.

Signals expire after five minutes and presence after one minute using MongoDB TTL indexes (deletion is asynchronous). Queries also exclude expired signals immediately. Room ownership remains checked for each operation. Payload types, description sizes, chat length and cursors are validated. WebSocket authorization failures no longer expose exception detail.

## TURN setup required for reliable cross-network calling

You currently have no TURN provider. Obtain a WebRTC TURN service (or operate a secured TURN server), then add the provider's **actual values** in Vercel → RuralCare → Settings → Environment Variables → Production:

| Variable | Value |
| --- | --- |
| TURN_URLS | Provider's comma-separated `turn:` / `turns:` URLs, including supplied ports and transport parameters |
| TURN_USERNAME | Provider's relay username |
| TURN_CREDENTIAL | Provider's relay password/credential; store as a Secret |

Do not use placeholders, public shared demo credentials, or NEXT_PUBLIC variables. This authenticated join response supplies the relay credentials only to authorized room participants; dedicated limited-use/rotated credentials are recommended. Provider admin API keys are not relay credentials and must never be returned to browsers. Match the provider's expiry to consultation duration; this implementation accepts supplied relay credentials, not provider-specific token-minting APIs.

Redeploy after changing environment variables. Test with a doctor on Wi-Fi and a patient on mobile data, then confirm relay candidates in browser WebRTC diagnostics. Keep TLS/camera permissions enabled. Vercel handles signaling, not the TURN media relay.

References: [MDN WebRTC protocols](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols), [Vercel WebSockets](https://vercel.com/docs/functions/websockets).

## Verification

- 25 backend tests passed, including consultation authentication/ownership, schema validation, join configuration, stale-signal filtering and leave isolation.
- Eight frontend library tests passed, including simultaneous starts, queued candidates, join failure and capture resolving after cleanup.
- Next.js production build and targeted ESLint passed.
- Two isolated Edge browser sessions used the actual Next.js page, FastAPI and MongoDB, with synthetic camera/audio (no mocked APIs). Video connected, mute/camera toggles worked, chat arrived, and remote end-call was observed.
- Temporary synthetic test users, profiles, appointment, presence and signals were removed by exact fixture IDs. No real clinical data was modified; no credentials were printed.
- Local same-machine testing does not establish Wi-Fi/mobile cross-network reliability. That requires the TURN setup above.

Run tests:

    python -B -m unittest discover -s backend/tests
    node --test tests/*.test.cjs
    npm run build

With Next.js on localhost:3000 and FastAPI on localhost:8000:

    node tests/verify-video-browser.cjs

The browser runner requires an available Playwright module and Edge. Set PLAYWRIGHT_MODULE to an existing installed module path if it is not available in the project. VIDEO_TEST_ORIGIN and VIDEO_TEST_API_ORIGIN can target a deployment, but MongoDB fixture configuration must securely match that deployment. The runner never prints fixture credentials.
