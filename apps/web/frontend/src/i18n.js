// Tiny i18n helper: holds the active catalog (fetched from /api/i18n) and a t(key)
// lookup. The server is the source of truth for strings so EN/HI stay in one place
// (packages/nm_core/nm_core/i18n.py). Falls back to the key when a string is missing.
import { api } from "./api.js";

let strings = {};
let locale = "en";

export async function loadCatalog(loc) {
  locale = loc || "en";
  try {
    const r = await api.i18n(locale);
    strings = r.strings || {};
    locale = r.locale || locale;
  } catch {
    strings = {};
  }
  return strings;
}

export function t(key) {
  return strings[key] || key;
}

export function currentLocale() {
  return locale;
}
