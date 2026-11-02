# Multi-Tenant Architecture Design

## Overview

OpenLine is designed as a **third-party reporting service** that supports multiple organizations (tenants) while maintaining complete data isolation and anonymity.

## Business Model

### Third-Party Service Model
- **OpenLine Staff (Admins)**: Handle all reports, manage the system, and communicate with reporters
- **Institution Clients**: Do NOT have admin access to the system
- **Report Delivery**: Reports are sent to institutions via email/API for verification (institutions don't access the system directly)
- **Anonymity Guarantee**: Since OpenLine admins don't work in the client organization, they cannot identify reporters

### Multi-Tenant Architecture
- **Multiple Organizations**: Each organization gets its own isolated environment
- **Separate URLs**: Each organization has a unique URL (e.g., `openline.com/acme-corp` or `acme-corp.openline.com`)
- **Data Isolation**: Each organization has separate database collections and storage folders
- **Current State**: Single demo/testing site for general use (default organization)
- **Future State**: Multiple organizations, but not activated yet

## Architecture Design

### 1. Organization Configuration

Each organization is defined with:
- **ID**: Unique identifier (e.g., "demo", "acme-corp")
- **Name**: Display name (e.g., "Demo Organization", "ACME Corporation")
- **Slug**: URL-friendly identifier (e.g., "demo", "acme-corp")
- **Collection Prefix**: Firestore collection name (e.g., "reports" for demo, "reports-acme" for ACME)
- **Storage Prefix**: Firebase Storage folder (e.g., "evidence" for demo, "evidence-acme" for ACME)
- **Contact Email**: Email address for sending reports to the institution
- **Status**: Active/Inactive flag

### 2. URL Routing Strategy

**Current Implementation (Path-Based)**:
- Demo/Default: `/submit`, `/track`, `/admin`
- Organization-specific: `/org-slug/submit`, `/org-slug/track`, `/org-slug/admin` (future)

**Alternative (Subdomain-Based)**:
- Demo/Default: `openline.com/submit`
- Organization-specific: `acme-corp.openline.com/submit` (requires DNS configuration)

For now, we're using **path-based routing** with the demo organization as default.

### 3. Data Isolation

#### Firestore Collections
- **Demo Organization**: `reports` collection
- **ACME Organization**: `reports-acme` collection
- **Each organization**: Separate collection = Complete data isolation

#### Firebase Storage
- **Demo Organization**: `evidence/` folder
- **ACME Organization**: `evidence-acme/` folder
- **Each organization**: Separate folder = Complete file isolation

### 4. Implementation Status

#### ✅ Completed (Foundation)
- Organization configuration system (`lib/organizations.ts`)
- Organization hook (`lib/hooks/useOrganization.ts`)
- Architecture documentation (this file)

#### 🔄 To Be Implemented (When Needed)
- URL-based organization detection (currently defaults to demo)
- Update all database queries to use organization-specific collections
- Update all storage operations to use organization-specific paths
- Firestore rules updated for multi-tenant collections
- Organization management UI (admin panel for managing organizations)
- Email delivery system for sending reports to institutions

#### 📋 Current State
- **Active**: Demo organization only
- **All queries**: Use default "reports" collection
- **All storage**: Use default "evidence" folder
- **All URLs**: Use root paths (`/submit`, `/track`, `/admin`)
- **Ready for**: Multi-tenant expansion when needed

## File Structure

```
lib/
  ├── organizations.ts          # Organization configuration
  ├── hooks/
  │   └── useOrganization.ts    # Hook to get current organization
  └── ...

app/
  ├── submit/
  │   └── page.tsx              # Will use organization-specific collection
  ├── track/
  │   └── [code]/
  │       └── page.tsx          # Will use organization-specific collection
  └── admin/
      └── dashboard/
          └── page.tsx          # Will use organization-specific collection
```

## Database Structure

### Firestore Collections

```
reports/                          # Demo organization (default)
  ├── report1
  ├── report2
  └── ...

reports-acme/                     # ACME organization (future)
  ├── report1
  ├── report2
  └── ...

reports-xyz/                      # XYZ organization (future)
  ├── report1
  └── ...
```

### Firebase Storage

```
evidence/                         # Demo organization (default)
  ├── image1.jpg
  ├── image2.jpg
  └── ...

evidence-acme/                    # ACME organization (future)
  ├── image1.jpg
  └── ...

evidence-xyz/                     # XYZ organization (future)
  ├── image1.jpg
  └── ...
```

## Implementation Guide

### Adding a New Organization

1. **Add to `lib/organizations.ts`**:
```typescript
{
  id: "acme-corp",
  name: "ACME Corporation",
  slug: "acme-corp",
  isActive: true, // Set to true when ready
  collectionPrefix: "reports-acme",
  storagePrefix: "evidence-acme",
  contactEmail: "reports@acme-corp.com",
  createdAt: Date.now(),
  description: "ACME Corporation reporting portal",
}
```

2. **Update Firestore Rules** (if needed):
   - Add rules for `reports-acme` collection
   - Copy rules from `reports` collection

3. **Configure Routing** (future):
   - Set up path-based routing: `/acme-corp/submit`
   - Or subdomain routing: `acme-corp.openline.com`

4. **Update Email Delivery** (future):
   - Configure email template for ACME
   - Set up email sending to `reports@acme-corp.com`

### Migrating to Multi-Tenant

When ready to activate multi-tenant support:

1. **Update `useOrganization` hook**:
   - Extract organization slug from URL pathname
   - Return appropriate organization based on URL

2. **Update all database queries**:
   - Replace `collection(db, "reports")` with `collection(db, getReportsCollection(organization))`
   - Update in: `app/submit/page.tsx`, `app/track/[code]/page.tsx`, `app/admin/dashboard/page.tsx`, `app/admin/reports/[id]/page.tsx`

3. **Update all storage operations**:
   - Replace `ref(storage, "evidence/...")` with `ref(storage, getStoragePath(organization, filename))`
   - Update in: `app/submit/page.tsx`

4. **Update Firestore Rules**:
   - Add rules for each organization collection
   - Or use wildcard patterns with organization validation

5. **Test thoroughly**:
   - Verify data isolation between organizations
   - Verify URL routing works correctly
   - Verify storage isolation

## Security Considerations

1. **Data Isolation**: Critical - Organizations must never see each other's data
2. **Access Control**: Only OpenLine admins can access the admin panel
3. **URL Validation**: Validate organization slugs to prevent unauthorized access
4. **Collection Validation**: Ensure queries always use the correct organization's collection
5. **Storage Validation**: Ensure file uploads always go to the correct organization's folder

## Future Enhancements

1. **Dynamic Organization Management**: Move organization config from code to Firestore database
2. **Organization Dashboard**: Admin UI to manage organizations
3. **Custom Branding**: Each organization can have custom logo/colors
4. **API Integration**: REST API for institutions to receive reports programmatically
5. **Webhook Support**: Send reports to institutions via webhooks
6. **Analytics per Organization**: Separate analytics for each organization

## Notes

- **Current State**: Foundation is ready, but all queries still use default "reports" collection
- **Activation**: Multi-tenant features are ready but not activated (defaults to demo)
- **Testing**: All testing should be done on the demo organization
- **Production**: When ready, simply update `useOrganization` hook and enable organizations
