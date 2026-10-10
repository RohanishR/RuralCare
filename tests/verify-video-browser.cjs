// Uses two isolated browser sessions, real FastAPI/MongoDB, synthetic camera/audio.
// No API mocking, no real patient data, no credentials printed or saved.
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const origin = process.env.VIDEO_TEST_ORIGIN || "http://localhost:3000";
const apiOrigin = process.env.VIDEO_TEST_API_ORIGIN || "http://localhost:8000";
let fixture;
let browser;
const pages = [];
let stage = "fixture";

(async () => {
  const result = spawnSync("python", ["-B", "-m", "backend.tests.consultation_fixture", "create", apiOrigin], {
    cwd: path.resolve(__dirname, ".."), encoding: "utf8",
  });
  assert.equal(result.status, 0, "Synthetic fixture creation failed (credentials suppressed)");
  fixture = JSON.parse(result.stdout);
  browser = await chromium.launch({ channel: "msedge", headless: true,
    args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream", "--autoplay-policy=no-user-gesture-required"] });
  stage = "join";
  for (const user of fixture.users) {
    const context = await browser.newContext({ permissions: ["camera", "microphone"] });
    await context.addCookies([{ name: "access_token", value: user.token, url: origin }]);
    const page = await context.newPage();
    await page.goto(`${origin}/consultation/${fixture.roomId}`);
    pages.push(page);
  }
  await Promise.all(pages.map(page => page.getByRole("button", { name: "Start Consultation", exact: true }).waitFor({ timeout: 30000 })));
  stage = "video negotiation";
  await Promise.all(pages.map(page => page.getByRole("button", { name: "Start Consultation", exact: true }).click()));
  for (const page of pages) {
    await page.getByRole("button", { name: "End Call", exact: true }).waitFor({ timeout: 30000 });
    await page.waitForFunction(() => [...document.querySelectorAll("video")].every(video => video.srcObject && video.readyState >= 2 && video.videoWidth > 0));
  }
  console.log("two_browser_video_connected=True");
  await pages[0].getByRole("button", { name: "Mute", exact: true }).click();
  assert.equal(await pages[0].locator("video").last().evaluate(video => video.srcObject.getAudioTracks()[0].enabled), false);
  await pages[0].getByRole("button", { name: "Turn camera off", exact: true }).click();
  assert.equal(await pages[0].locator("video").last().evaluate(video => video.srcObject.getVideoTracks()[0].enabled), false);
  console.log("mute_and_camera_controls_verified=True");
  await pages[0].getByRole("textbox", { name: "Message your consultation partner" }).fill("Synthetic call QA message");
  await pages[0].getByRole("button", { name: "Send message" }).click();
  await pages[1].getByText("Synthetic call QA message", { exact: true }).waitFor({ timeout: 10000 });
  console.log("chat_delivery_verified=True");
  await pages[0].getByRole("button", { name: "End Call", exact: true }).click();
  await pages[1].getByText("Your consultation partner ended the call.", { exact: true }).waitFor({ timeout: 10000 });
  console.log("remote_end_call_verified=True");
})().catch(async error => {
  // Avoid emitting browser headers, cookies, request bodies, or raw fixture output.
  console.error("video_browser_verification_failed=" + stage + ": " + error.name + ": " + error.message.split("\n")[0]);
  for (const page of pages) {
    console.log("test_page_path=" + new URL(page.url()).pathname);
    console.log("test_page_alert=" + await page.getByRole("alert").allTextContents());
    console.log("test_page_buttons=" + await page.getByRole("button").allTextContents());
  }
  process.exitCode = 1;
}).finally(async () => {
  if (browser) await browser.close();
  if (fixture) {
    const cleanup = spawnSync("python", ["-B", "-m", "backend.tests.consultation_fixture", "cleanup"], {
      cwd: path.resolve(__dirname, ".."), encoding: "utf8", input: JSON.stringify(fixture),
    });
    console.log("synthetic_fixture_cleanup=" + (cleanup.status === 0));
  }
});
