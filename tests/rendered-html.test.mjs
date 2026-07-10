import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Storm Atlas landing page with real app screenshots", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Storm Atlas \| Your run\. Under control\.<\/title>/i);
  assert.match(html, /Real Storm Atlas app screenshots/);
  assert.match(html, /\/screenshots\/items\.png/);
  assert.match(html, /\/screenshots\/build\.png/);
  assert.match(html, /\/screenshots\/reference\.png/);
  assert.doesNotMatch(html, /Current run|Railgunner|Based on 14 tracked items/);
});

test("ships each release screenshot used by the hero", async () => {
  await Promise.all([
    access(new URL("../public/screenshots/items.png", import.meta.url)),
    access(new URL("../public/screenshots/build.png", import.meta.url)),
    access(new URL("../public/screenshots/reference.png", import.meta.url)),
  ]);
});
