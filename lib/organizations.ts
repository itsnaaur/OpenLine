// Organization configuration and management
// This file manages multi-tenant organization setup

export interface Organization {
  id: string; // Unique organization identifier (e.g., "demo", "acme-corp")
  name: string; // Display name (e.g., "Demo Organization", "ACME Corporation")
  slug: string; // URL slug (e.g., "demo", "acme-corp")
  isActive: boolean; // Whether this organization is active
  collectionPrefix: string; // Firestore collection prefix (e.g., "reports" for demo, "reports-acme" for acme)
  storagePrefix: string; // Firebase Storage prefix (e.g., "evidence" for demo, "evidence-acme" for acme)
  contactEmail?: string; // Contact email for sending reports to the institution
  createdAt: number;
  description?: string; // Optional description
}

// Default/Demo organization configuration
export const DEFAULT_ORGANIZATION: Organization = {
  id: "demo",
  name: "Demo Organization",
  slug: "demo",
  isActive: true,
  collectionPrefix: "reports", // Uses default "reports" collection
  storagePrefix: "evidence", // Uses default "evidence" folder
  createdAt: Date.now(),
  description: "Default demo and testing organization",
};

// Organization registry
// In the future, this can be moved to Firestore for dynamic management
// For now, we'll use a static configuration that can be easily extended
const ORGANIZATIONS: Organization[] = [
  DEFAULT_ORGANIZATION,
  // Future organizations will be added here:
  // {
  //   id: "acme-corp",
  //   name: "ACME Corporation",
  //   slug: "acme-corp",
  //   isActive: false, // Set to true when ready to activate
  //   collectionPrefix: "reports-acme",
  //   storagePrefix: "evidence-acme",
  //   contactEmail: "reports@acme-corp.com",
  //   createdAt: Date.now(),
  //   description: "ACME Corporation reporting portal",
  // },
];

/**
 * Get organization by slug
 * @param slug - Organization slug from URL
 * @returns Organization or null if not found
 */
export function getOrganizationBySlug(slug: string | null | undefined): Organization | null {
  if (!slug) return DEFAULT_ORGANIZATION;
  
  const org = ORGANIZATIONS.find((o) => o.slug === slug && o.isActive);
  return org || null;
}

/**
 * Get organization by ID
 * @param id - Organization ID
 * @returns Organization or null if not found
 */
export function getOrganizationById(id: string): Organization | null {
  const org = ORGANIZATIONS.find((o) => o.id === id);
  return org || null;
}

/**
 * Get all active organizations
 * @returns Array of active organizations
 */
export function getActiveOrganizations(): Organization[] {
  return ORGANIZATIONS.filter((o) => o.isActive);
}

/**
 * Get the Firestore collection name for an organization
 * @param organization - Organization object
 * @returns Collection name (e.g., "reports" or "reports-acme")
 */
export function getReportsCollection(organization: Organization): string {
  return organization.collectionPrefix;
}

/**
 * Get the Firebase Storage path prefix for an organization
 * @param organization - Organization object
 * @returns Storage path prefix (e.g., "evidence" or "evidence-acme")
 */
export function getStoragePath(organization: Organization, filename: string): string {
  return `${organization.storagePrefix}/${filename}`;
}

/**
 * Validate organization slug format
 * @param slug - Slug to validate
 * @returns true if valid, false otherwise
 */
export function isValidOrganizationSlug(slug: string): boolean {
  // Allow alphanumeric, hyphens, and underscores
  // Must be 2-50 characters
  return /^[a-z0-9_-]{2,50}$/.test(slug);
}
