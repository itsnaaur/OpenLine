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
 * Rebuild a PDF from its pages only. The new file has no document metadata
 * (author, creator app, title, dates, XMP), no earlier saved revisions, and no
 * attachments, scripts, bookmarks or form data. Comment author names are removed.
 * Encrypted or unreadable PDFs are rejected rather than uploaded unchanged.
 */
async function sanitizePdf(file: File): Promise<Blob> {
  // Loaded on demand so pages without PDF uploads don't ship the library
  const { PDFDocument, PDFDict, PDFName } = await import("pdf-lib");

  let source;
  try {
    source = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
  } catch {
    throw new Error(`${file.name} could not be processed. Password-protected or damaged PDFs aren't supported.`);
  }

  // Page-level metadata and comment authors would otherwise be copied with the pages
  for (const page of source.getPages()) {
    page.node.delete(PDFName.of("Metadata"));
    page.node.delete(PDFName.of("PieceInfo"));
    const annots = page.node.Annots();
    for (let i = 0; i < (annots?.size() ?? 0); i++) {
      const annot = annots!.lookupMaybe(i, PDFDict);
      annot?.delete(PDFName.of("T")); // comment author
      annot?.delete(PDFName.of("M")); // modification date
      annot?.delete(PDFName.of("Metadata"));
    }
  }

  // Copying pages into a new document leaves every unreferenced object behind
  const clean = await PDFDocument.create({ updateMetadata: false });
  const pages = await clean.copyPages(source, source.getPageIndices());
  pages.forEach((page) => clean.addPage(page));

  const bytes = await clean.save({ useObjectStreams: true });
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

/**
 * Remove identifying metadata before upload. Images are re-encoded through a
 * canvas, which drops EXIF (GPS location, device model, timestamps). PDFs are
 * rewritten without document metadata.
 */
export async function sanitizeEvidenceFile(file: File): Promise<Blob> {
  if (file.type === "application/pdf") return sanitizePdf(file);

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
    if (parsed.protocol === "https:" && parsed.hostname === "firebasestorage.googleapis.com") return true;
    // Local Storage emulator (development only)
    return process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" && parsed.origin === "http://127.0.0.1:9199";
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
