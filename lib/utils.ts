// Utility functions
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Uppercase letters and numbers, excluding I and O to avoid confusion with 1 and 0.
// Keep in sync with the access code pattern in firestore.rules.
const ACCESS_CODE_ALPHABET = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const ACCESS_CODE_PATTERN = /^[0-9A-HJ-NP-Z]{4}-[0-9A-HJ-NP-Z]{4}-[0-9A-HJ-NP-Z]{4}$/;

/**
 * Generate a secure 12-character Access Code (~61 bits of entropy)
 * Format: XXXX-XXXX-XXXX (e.g., "8X2K-99BM-7ZQN")
 */
export function generateAccessCode(): string {
  const code = customAlphabet(ACCESS_CODE_ALPHABET, 12)();
  return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}`;
}

/**
 * Normalize user input (trim, uppercase, strip whitespace)
 */
export function normalizeAccessCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s/g, "");
}

export function isValidAccessCode(code: string): boolean {
  return ACCESS_CODE_PATTERN.test(code);
}

/**
 * Report documents are stored under the SHA-256 hash of their access code.
 * Reporters can only fetch a report whose code they know; listing reports
 * is restricted to admins in firestore.rules.
 */
export async function accessCodeToReportId(code: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
