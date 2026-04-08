const STORAGE_KEY = 'wall-calendar-notes';

/**
 * Load all notes from localStorage.
 * Returns a Map-like object: { "yyyy-MM-dd": "note text", ... }
 */
export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Validate it's a plain object
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch (err) {
    console.warn('[Calendar] Failed to load notes from localStorage:', err);
    return {};
  }
}

/**
 * Save ALL notes to localStorage.
 * This is the single source of truth — always saves the entire notes map.
 */
export function saveNotes(notes) {
  try {
    const serialized = JSON.stringify(notes);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('[Calendar] Failed to save notes to localStorage:', err);
  }
}

/**
 * Clear all notes from localStorage.
 */
export function clearAllNotes() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[Calendar] Failed to clear notes:', err);
  }
}
