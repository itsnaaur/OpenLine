"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if already on login page
    if (pathname === "/admin/login") {
      return;
    }

    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push("/admin/login");
      return;
    }

    // Redirect to login if authenticated but not admin
    if (!loading && user && !isAdmin) {
      console.log("Admin access denied in layout:", {
        email: user.email,
        isAdmin: isAdmin,
        loading: loading,
      });
      
      // Check token directly with detailed logging
      user.getIdTokenResult(true).then((result) => {
        console.log("Direct token check in layout:", {
          admin: result.claims.admin,
          allClaims: result.claims,
          email: user.email
        });
        
        // If still not admin after token refresh, sign out
        if (result.claims.admin !== true) {
          console.warn("User does not have admin claim. Signing out...");
          signOut(auth).then(() => {
            router.push("/admin/login");
          });
        } else {
          // Admin claim found! Force a re-render by updating state
          console.log("Admin claim found! User should have access.");
          // The useAuth hook should pick this up on next render
        }
      }).catch((error) => {
        console.error("Error checking token in layout:", error);
        signOut(auth).then(() => {
          router.push("/admin/login");
        });
      });
    }
  }, [user, loading, isAdmin, router, pathname]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#e6f4f8] to-[#d9eaf5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#116aae] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show protected content if not authenticated (unless on login page)
  if (!user && pathname !== "/admin/login") {
    return null;
  }

  return <>{children}</>;
}

