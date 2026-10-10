const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const compiled = ts.transpileModule(fs.readFileSync("src/lib/api-client.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;

function client(env = {}, fetch = async () => new Response("{}"), browser = true) {
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, process: { env }, fetch, URLSearchParams, AbortSignal, Error, TypeError,
    ...(browser ? { window: {} } : {}),
    require: (name) => {
      assert.equal(name, "js-cookie");
      return { get: () => undefined };
    },
  });
  return exports;
}

test("browser URL respects public configuration and defaults to Vercel routing", () => {
  assert.equal(client().getApiUrl(), "/api/v1");
  assert.equal(client({ NEXT_PUBLIC_API_URL: "https://api.example.com/api/v1/" }).getApiUrl(),
    "https://api.example.com/api/v1");
  assert.equal(client({ BACKEND_URL: "https://internal.example.com/" }, undefined, false).getApiUrl(),
    "https://internal.example.com/api/v1");
});

test("registration endpoint and login share the configured base", async () => {
  const calls = [];
  const { apiClient } = client({ NEXT_PUBLIC_API_URL: "https://api.example.com/api/v1" },
    async (url, options) => { calls.push({ url, options }); return new Response("{}"); });
  await apiClient.post("/auth/register", { name: "QA" });
  await apiClient.login("qa@example.com", "synthetic-password");
  assert.equal(calls[0].url, "https://api.example.com/api/v1/auth/register");
  assert.equal(calls[1].url, "https://api.example.com/api/v1/auth/login");
  assert.equal(calls[1].options.headers["Content-Type"], "application/x-www-form-urlencoded");
  assert.equal(new URLSearchParams(calls[1].options.body).get("username"), "qa@example.com");
});

test("404, validation and database errors provide safe actionable messages", () => {
  const { responseError } = client();
  assert.match(responseError(404).message, /could not be found/);
  const validation = responseError(422, [{ loc: ["body", "password"], input: "private-password",
    msg: "private input echoed by a server" }]);
  assert.match(validation.message, /password/);
  assert.doesNotMatch(validation.message, /private/);
  assert.match(responseError(503, "private database URI").message, /temporarily unavailable/);
  const failure = responseError(500, "private stack trace", "aabbcc123");
  assert.doesNotMatch(failure.message, /private/);
  assert.match(failure.message, /aabbcc123/);
});

test("non-JSON platform 500 and network failures are handled", async () => {
  const unavailable = client({}, async () => new Response("Vercel crash", { status: 500 }));
  await assert.rejects(unavailable.apiClient.post("/auth/register", {}), /service could not complete/);
  const offline = client({}, async () => { throw new TypeError("Failed to fetch"); });
  await assert.rejects(offline.apiClient.post("/auth/register", {}), /Check your connection/);
});
