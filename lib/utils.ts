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

/**
 * Generate a 6-character alphanumeric Access Code
 * Format: 3 chars - 2 chars - 1 char (e.g., "8X2-99B")
 */
export function generateAccessCode(): string {
  // Use nanoid with custom alphabet (uppercase letters and numbers, excluding confusing chars)
  const alphabet = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Removed I, O to avoid confusion
  const nanoid = customAlphabet(alphabet, 6);
  const code = nanoid();
  
  // Format as XXX-XX-X
  return `${code.slice(0, 3)}-${code.slice(3, 5)}-${code.slice(5, 6)}`;
}

