import { findItemById } from "@/src/lib/itemRepository";

export type RunStateV1 = { schemaVersion: 1; survivorId?: string; difficulty?: string; items: Record<string, number>; savedItemIds: string[]; checklistItemIds: string[] };
export const defaultRunState: RunStateV1 = { schemaVersion: 1, items: {}, savedItemIds: [], checklistItemIds: [] };
export const runStorageKey = "storm-atlas:active-run";
const validCount = (value: unknown): value is number => typeof value === "number" && Number.isInteger(value) && value > 0;
export function sanitizeRunState(value: unknown): RunStateV1 {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultRunState;
  const raw = value as Partial<RunStateV1>;
  const validIds = (value: unknown) => Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string" && !!findItemById(id)))] : [];
  const items = Object.fromEntries(Object.entries(raw.items ?? {}).filter(([id, count]) => !!findItemById(id) && validCount(count)));
  return { schemaVersion: 1, survivorId: typeof raw.survivorId === "string" ? raw.survivorId : undefined, difficulty: typeof raw.difficulty === "string" ? raw.difficulty : undefined, items, savedItemIds: validIds(raw.savedItemIds), checklistItemIds: validIds(raw.checklistItemIds) };
}
export function loadRunState(): RunStateV1 { try { return sanitizeRunState(JSON.parse(localStorage.getItem(runStorageKey) ?? "{}")); } catch { return defaultRunState; } }
export function saveRunState(state: RunStateV1) { localStorage.setItem(runStorageKey, JSON.stringify(state)); }
export function setItemCount(state: RunStateV1, id: string, count: number): RunStateV1 { if (!findItemById(id)) return state; const items = { ...state.items }; if (count > 0) items[id] = count; else delete items[id]; return { ...state, items }; }
