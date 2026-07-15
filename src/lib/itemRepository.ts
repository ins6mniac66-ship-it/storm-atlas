import catalog from "@/src/data/items.json";

export type Rarity = "Common" | "Uncommon" | "Legendary" | "Boss" | "Lunar" | "Void";
export type ContentScope = "Base Game" | "Survivors of the Void";
export type SourceStatus = "verified" | "wiki-derived" | "needs-review";
export type Priority = "core" | "useful" | "skip" | "scrap";
export type ItemRecord = { id: string; name: string; rarity: Rarity; scope: ContentScope; categories: string[]; aliases: string[]; effect: string; iconPath: string; sourceUrl: string; sourceStatus: SourceStatus; priority: Priority; priorityReason: string; stackFormula?: string };

export const contentVersion = catalog.version;
export const items = catalog.items as ItemRecord[];
export const rarities: Rarity[] = ["Common", "Uncommon", "Legendary", "Boss", "Lunar", "Void"];
export const itemById = new Map(items.map((item) => [item.id, item]));
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");
export const findItemById = (id: string) => itemById.get(id) ?? null;
export function searchItems(query = "", rarity: Rarity | "All" = "All", scope: "all" | "base" | "expansion" = "all") {
  const needle = normalize(query);
  return items.filter((item) => {
    const text = normalize([item.name, item.effect, ...item.aliases, ...item.categories].join(" "));
    return (!needle || text.includes(needle)) && (rarity === "All" || item.rarity === rarity) && (scope === "all" || (scope === "base" ? item.scope === "Base Game" : item.scope !== "Base Game"));
  });
}
export const relatedItems = (item: ItemRecord) => items.filter((candidate) => candidate.id !== item.id && candidate.categories.some((tag) => item.categories.includes(tag))).slice(0, 4);
