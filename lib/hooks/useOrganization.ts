// Hook to get current organization from URL/context
"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getOrganizationBySlug, Organization, DEFAULT_ORGANIZATION } from "@/lib/organizations";

/**
 * Custom hook to get the current organization from the URL path
 * Currently uses path-based routing (e.g., /org-slug/submit)
 * 
 * For now, we default to the demo organization
 * In the future, we can extract organization from URL segments
 */
export function useOrganization(): Organization {
  const pathname = usePathname();
  
  return useMemo(() => {
    // For now, always return the default/demo organization
    // In the future, we can parse the pathname to extract organization slug
    // Example: /acme-corp/submit -> organization slug = "acme-corp"
    // Example: /submit -> default organization (demo)
    
    // TODO: Implement path-based organization detection when ready
    // const pathSegments = pathname.split('/').filter(Boolean);
    // if (pathSegments.length > 0) {
    //   const potentialSlug = pathSegments[0];
    //   const org = getOrganizationBySlug(potentialSlug);
    //   if (org) {
    //     return org;
    //   }
    // }
    
    return DEFAULT_ORGANIZATION;
  }, [pathname]);
}
