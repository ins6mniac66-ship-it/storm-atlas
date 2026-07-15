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

test("server-renders the interactive Storm Atlas app clone", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Storm Atlas \| Offline Run Companion<\/title>/i);
  assert.match(html, /Offline run companion/);
  assert.match(html, /Item catalog/);
  assert.match(html, /Active build/);
  assert.match(html, /Reference/);
  assert.doesNotMatch(html, /Explore the toolkit|Capabilities|View project/);
});

test("ships each release screenshot used by the hero", async () => {
  await Promise.all([
    access(new URL("../public/screenshots/items.png", import.meta.url)),
    access(new URL("../public/screenshots/build.png", import.meta.url)),
    access(new URL("../public/screenshots/reference.png", import.meta.url)),
  ]);
});

test("ships the offline app shell and content source", async () => {
  await Promise.all([
    access(new URL("../public/manifest.webmanifest", import.meta.url)),
    access(new URL("../public/sw.js", import.meta.url)),
    access(new URL("../src/data/items.json", import.meta.url)),
  ]);
});
