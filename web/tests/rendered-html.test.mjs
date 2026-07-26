import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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

test("ships equipment, survivor, and build-aware Chef reference content", async () => {
  const source = await readFile(new URL("../src/data/referenceContent.ts", import.meta.url), "utf8");
  assert.match(source, /wiki-derived/);
  assert.equal((source.match(/"Base Game"/g) ?? []).length, 25);
  assert.doesNotMatch(source, /Survivors of the Void/);
  assert.match(source, /survivorGuides/);
  assert.match(source, /chefRecipes/);
  assert.match(source, /Predatory Instincts/);
  assert.match(source, /iconPath: `\/assets\/equipment\/\$\{id\}\.png`/);
});

test("ships the in-run Build decision flow", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /RUN READINESS/);
  assert.match(source, /TAKE NEXT/);
  assert.match(source, /WATCH FOR/);
  assert.match(source, /checklistItemIds: next\.checklistItemIds\.filter/);
  assert.match(source, /setSurvivor/);
  assert.match(source, /isCuratedPickup/);
  assert.match(source, /\["Common", "Uncommon", "Legendary"\]/);
});

test("shows catalog status chips only for items that need a provenance warning", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /item\.sourceStatus !== "verified"/);
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

test("ships the reconciled full item manifest with explicit expansion scopes", async () => {
  const catalog = JSON.parse(await readFile(new URL("../src/data/items.json", import.meta.url), "utf8"));
  assert.equal(catalog.items.length, 170);
  assert.deepEqual(new Set(catalog.items.map((item) => item.scope)), new Set(["Base Game", "Survivors of the Void", "Seekers of the Storm", "Alloyed Collective"]));
});
