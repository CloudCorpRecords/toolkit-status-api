import { test } from "node:test";
import assert from "node:assert/strict";
import health from "../api/health.ts";
import toolkit from "../api/toolkit.ts";
import github from "../api/github.ts";

test("health handler returns ok with the service name", async () => {
  const res = health(new Request("http://localhost/api/health"));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.equal(body.service, "toolkit-status-api");
  assert.equal(body.runtime, "vercel-edge");
});

test("toolkit handler maps npm packuments to latest versions", async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url: string | URL | Request) => {
    const u = String(url);
    assert.ok(u.startsWith("https://registry.npmjs.org/"));
    return new Response(
      JSON.stringify({
        name: "@reneturcios/greenlight",
        description: "fixture",
        "dist-tags": { latest: "0.3.9" },
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };
  try {
    const res = await toolkit(new Request("http://localhost/api/toolkit"));
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ok, true);
    assert.equal(body.packages.length, 4);
    assert.equal(body.packages[0].latest, "0.3.9");
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("github handler returns total and open PR counts", async () => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url: string | URL | Request) => {
    const u = String(url);
    const total = u.includes("state:open") || u.includes("state%3Aopen") ? 31 : 45;
    return new Response(JSON.stringify({ total_count: total }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  try {
    const res = await github(new Request("http://localhost/api/github"));
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ok, true);
    assert.equal(body.pullRequests.total, 45);
    assert.equal(body.pullRequests.open, 31);
  } finally {
    globalThis.fetch = realFetch;
  }
});
