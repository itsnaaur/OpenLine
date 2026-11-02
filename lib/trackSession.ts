// The access code is kept in sessionStorage instead of the URL, so it doesn't
// end up in browser history, bookmarks, or server and analytics logs.
// sessionStorage is per tab and is cleared when the tab is closed.
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "openline:trackCode";
const listeners = new Set<() => void>();

function readCode(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setTrackCode(code: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Storage blocked (e.g. strict privacy mode); the view page will send the user back to /track
  }
  listeners.forEach((listener) => listener());
}

export function clearTrackCode() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Returns the stored access code, `null` if there is none, or `undefined`
 * during server rendering and hydration (before sessionStorage can be read).
 */
export function useTrackCode(): string | null | undefined {
  return useSyncExternalStore(subscribe, readCode, () => undefined);
}
