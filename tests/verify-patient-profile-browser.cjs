const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const origin = process.env.PROFILE_TEST_ORIGIN || "http://localhost:3000";
const apiOrigin = process.env.PROFILE_TEST_API_ORIGIN || "http://localhost:8000";
let fixture, browser;
(async () => {
  const result = spawnSync("python", ["-B", "-m", "backend.tests.consultation_fixture", "create", apiOrigin], { encoding: "utf8" });
  assert.equal(result.status, 0, "Synthetic fixture creation failed; sensitive output suppressed");
  fixture = JSON.parse(result.stdout);
  browser = await chromium.launch({ headless: true, channel: "msedge" });
  const context = await browser.newContext();
  // Optional routing override forwards to another real local FastAPI process;
  // it does not mock API responses or database persistence.
  if (process.env.PROFILE_TEST_REWRITE_API_FROM) {
    await context.route(process.env.PROFILE_TEST_REWRITE_API_FROM + "/api/v1/**", route => {
      const url = new URL(route.request().url());
      return route.continue({ url: apiOrigin + url.pathname + url.search });
    });
  }
  await context.addCookies([{ name: "access_token", value: fixture.users[0].token, url: origin }]);
  const page = await context.newPage();
  await page.goto(origin + "/patient/profile");
  await page.locator('input[name="full_name"]').fill("Updated Profile Save QA");
  await page.locator('input[name="allergies"]').fill("Synthetic allergy QA");
  const response = page.waitForResponse(response => response.url().endsWith("/patients/me") && response.request().method() === "PUT");
  await page.getByRole("button", { name: "Save Profile", exact: true }).click();
  const saved = await response;
  console.log("profile_save_http_status=" + saved.status());
  assert.equal(saved.status(), 200);
  await page.getByText("Profile updated successfully!", { exact: true }).waitFor();
  assert.equal(await page.getByText("Profile updated successfully!", { exact: true }).evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return bounds.bottom > 0 && bounds.top < window.innerHeight;
  }), true, "Save confirmation must be visible beside the button");
  await page.reload();
  await page.waitForFunction(() => document.querySelector('input[name="full_name"]')?.value === "Updated Profile Save QA");
  assert.equal(await page.locator('input[name="allergies"]').inputValue(), "Synthetic allergy QA");
  console.log("profile_saved_and_reloaded=True");
  await page.goto(origin + "/patient/dashboard");
  await page.getByRole("heading", { name: /Updated/ }).waitFor();
  console.log("dashboard_uses_updated_profile_name=True");
  if (process.env.TEST_RECORD_CORRECTIONS === "1") {
    const response = await fetch(apiOrigin + "/api/v1/medical-records/", {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + fixture.users[1].token },
      body: JSON.stringify({ appointment_id: fixture.roomId, diagnosis: "Synthetic clinician finding",
        symptoms: "Synthetic test symptoms", notes: "Original synthetic clinician note" }),
    });
    assert.equal(response.status, 201);
    const record = await response.json();
    await page.goto(origin + "/patient/medical-records");
    await page.getByRole("button", { name: "Add correction notes" }).click();
    await page.getByRole("textbox", { name: "Correction or additional information" }).fill("Synthetic patient clarification");
    await page.getByRole("button", { name: "Save correction", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Correction saved successfully." }).waitFor();
    await page.reload();
    await page.getByText("Synthetic patient clarification", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Edit correction notes" }).click();
    await page.getByRole("textbox", { name: "Correction or additional information" }).fill("Updated synthetic clarification");
    await page.getByRole("button", { name: "Save correction", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Correction saved successfully." }).waitFor();
    const persisted = await fetch(apiOrigin + "/api/v1/medical-records/" + record.id, {
      headers: { "Authorization": "Bearer " + fixture.users[0].token },
    });
    assert.equal(persisted.status, 200);
    const updated = await persisted.json();
    assert.equal(updated.patient_note, "Updated synthetic clarification");
    assert.equal(updated.diagnosis, "Synthetic clinician finding");
    assert.equal(updated.notes, "Original synthetic clinician note");
    console.log("patient_correction_saved_reloaded_and_edited=True");
    console.log("clinician_record_preserved=True");
  }
})().catch(error => {
  console.error("profile_browser_test_failed=" + error.name + ": " + error.message.split("\n")[0]);
  process.exitCode = 1;
}).finally(async () => {
  if (browser) await browser.close();
  if (fixture) {
    const cleanup = spawnSync("python", ["-B", "-m", "backend.tests.consultation_fixture", "cleanup"], { encoding: "utf8", input: JSON.stringify(fixture) });
    console.log("synthetic_fixture_cleanup=" + (cleanup.status === 0));
  }
});
