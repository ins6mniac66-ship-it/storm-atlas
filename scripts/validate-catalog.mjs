import fs from "node:fs";
import path from "node:path";
const file = path.resolve("src/data/items.json");
const catalog = JSON.parse(fs.readFileSync(file, "utf8"));
const allowed = { rarity: ["Common","Uncommon","Legendary","Boss","Lunar","Void"], scope: ["Base Game","Survivors of the Void"], sourceStatus: ["verified","wiki-derived","needs-review"], priority: ["core","useful","skip","scrap"] };
if (!catalog.version || !Array.isArray(catalog.items) || !catalog.items.length) throw new Error("Catalog needs a version and at least one item.");
const ids = new Set();
for (const item of catalog.items) {
  for (const key of ["id","name","effect","iconPath","sourceUrl","priorityReason"]) if (typeof item[key] !== "string" || !item[key].trim()) throw new Error(`Invalid ${key} on ${item.id ?? "unknown item"}`);
  if (ids.has(item.id)) throw new Error(`Duplicate item id: ${item.id}`); ids.add(item.id);
  for (const [key, values] of Object.entries(allowed)) if (!values.includes(item[key])) throw new Error(`Invalid ${key} on ${item.id}`);
  if (!Array.isArray(item.categories) || !item.categories.length || !Array.isArray(item.aliases) || item.aliases.some((value) => typeof value !== "string" || !value.trim())) throw new Error(`Invalid categories or aliases on ${item.id}`);
  if (!item.iconPath.startsWith("/") || !fs.existsSync(path.resolve("public", `.${item.iconPath}`))) throw new Error(`Missing icon for ${item.id}: ${item.iconPath}`);
}
console.log(`Validated ${catalog.items.length} items (${catalog.version}).`);
