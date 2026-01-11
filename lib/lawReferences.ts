/**
 * Law reference information for Philippine laws used in AI compliance checks
 */

export interface LawReference {
  code: string; // e.g., "RA 11058"
  fullName: string; // e.g., "Occupational Safety and Health (OSH) Standards"
  fullDisplayName: string; // e.g., "Occupational Safety and Health (OSH) Standards (Republic Act No. 11058)"
  readMoreInfo: string; // Information about where to read/find the law
}

export const LAW_REFERENCES: Record<string, LawReference> = {
  "RA 11058": {
    code: "RA 11058",
    fullName: "Occupational Safety and Health (OSH) Standards",
    fullDisplayName: "Occupational Safety and Health (OSH) Standards (Republic Act No. 11058)",
    readMoreInfo: "Read this law at the official website of the Department of Labor and Employment (DOLE) at www.dole.gov.ph, or visit the Occupational Safety and Health (OSH) Standards office of the Philippines in your city/region.",
  },
  "RA 11313": {
    code: "RA 11313",
    fullName: "Safe Spaces Act",
    fullDisplayName: "Safe Spaces Act (Republic Act No. 11313)",
    readMoreInfo: "Read this law at the official website of the Philippine Commission on Women (PCW) at www.pcw.gov.ph/republic-act-11313-safe-spaces-act, or visit the Safe Spaces Act implementing office in your city/region.",
  },
  "RA 10627": {
    code: "RA 10627",
    fullName: "Anti-Bullying Act of 2013",
    fullDisplayName: "Anti-Bullying Act of 2013 (Republic Act No. 10627)",
    readMoreInfo: "Read this law at the official website of the Department of Education (DepEd) at www.deped.gov.ph/deped-policies-and-child-protection-related-laws, or visit the Anti-Bullying Act implementing office in your city/region.",
  },
  "RA 10173": {
    code: "RA 10173",
    fullName: "Data Privacy Act of 2012",
    fullDisplayName: "Data Privacy Act of 2012 (Republic Act No. 10173)",
    readMoreInfo: "Read this law at the official website of the National Privacy Commission (NPC) at www.privacy.gov.ph/data-privacy-act, or visit the Data Privacy Act implementing office in your city/region.",
  },
  "RA 11232": {
    code: "RA 11232",
    fullName: "Revised Corporation Code",
    fullDisplayName: "Revised Corporation Code (Republic Act No. 11232)",
    readMoreInfo: "Read this law at the official website of the Securities and Exchange Commission (SEC) at www.sec.gov.ph, or visit the Revised Corporation Code implementing office in your city/region.",
  },
};

/**
 * Get law reference information by law code
 * @param lawCode - The law code (e.g., "RA 11058")
 * @returns Law reference information or null if not found
 */
export function getLawReference(lawCode: string | null | undefined): LawReference | null {
  if (!lawCode || lawCode === "None") {
    return null;
  }
  return LAW_REFERENCES[lawCode] || null;
}

/**
 * Format law code to full display name
 * @param lawCode - The law code (e.g., "RA 11058")
 * @returns Full display name or the original code if not found
 */
export function formatLawDisplayName(lawCode: string | null | undefined): string {
  const reference = getLawReference(lawCode);
  return reference?.fullDisplayName || lawCode || "None";
}
