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
 * Generate a secure 12-character alphanumeric Access Code
 * Format: 4 chars - 4 chars - 4 chars (e.g., "8X2K-99BM-7ZQN")
 * Increased complexity for better security and anonymity
 */
export function generateAccessCode(): string {
  // Use nanoid with custom alphabet (uppercase letters and numbers, excluding confusing chars)
  const alphabet = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Removed I, O to avoid confusion
  const nanoid = customAlphabet(alphabet, 12);
  const code = nanoid();
  
  // Format as XXXX-XXXX-XXXX (12 characters total, more secure)
  return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}`;
}

