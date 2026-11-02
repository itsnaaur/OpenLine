// Evidence file helpers (upload sanitizing and safe rendering)

export const MAX_EVIDENCE_FILES = 3;
export const MAX_EVIDENCE_SIZE = 5 * 1024 * 1024; // 5MB, keep in sync with storage.rules

const EXTENSION_BY_TYPE: Record<string, "jpg" | "png" | "pdf"> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf",
};

export function isAllowedEvidenceType(type: string): boolean {
  return type in EXTENSION_BY_TYPE;
}

/**
 * Re-encode images through a canvas. This drops EXIF metadata (GPS location,
 * device model, timestamps) that could identify an anonymous reporter.
 * PDFs are passed through unchanged.
 */
export async function sanitizeEvidenceFile(file: File): Promise<Blob> {
  if (file.type === "application/pdf") return file;

  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, file.type, 0.92)
  );
  if (!blob) throw new Error("Could not process image");
  return blob;
}

/**
 * Random storage path that does not include the original file name,
 * which could contain the reporter's name or other identifying details.
 */
export function evidenceStoragePath(type: string): string {
  const ext = EXTENSION_BY_TYPE[type];
  if (!ext) throw new Error("Unsupported file type");
  return `evidence/${crypto.randomUUID()}.${ext}`;
}

/**
 * Only render URLs that point at Firebase Storage over HTTPS.
 */
export function isTrustedEvidenceUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "firebasestorage.googleapis.com";
  } catch {
    return false;
  }
}

/**
 * Firebase download URLs end in "?alt=media&token=...", so check the path, not the full URL.
 */
export function isPdfUrl(url: string): boolean {
  try {
    return decodeURIComponent(new URL(url).pathname).toLowerCase().endsWith(".pdf");
  } catch {
    return false;
  }
}

/**
 * Normalize the stored evidence field (string for older reports, array for newer ones).
 */
export function getEvidenceUrls(evidenceUrl: string | string[] | undefined): string[] {
  if (!evidenceUrl) return [];
  const urls = Array.isArray(evidenceUrl) ? evidenceUrl : [evidenceUrl];
  return urls.filter(isTrustedEvidenceUrl);
}
