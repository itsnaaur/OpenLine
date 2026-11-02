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

    // Signed in but without the admin claim: sign out and return to login
    if (!loading && user && !isAdmin) {
      signOut(auth).finally(() => router.push("/admin/login"));
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

  // Only admins see protected pages (the login page is always shown)
  if (!isAdmin && pathname !== "/admin/login") {
    return null;
  }

  return <>{children}</>;
}

