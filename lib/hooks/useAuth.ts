"use client";

import { useState, useEffect } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthUser extends User {
  customClaims?: {
    admin?: boolean;
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get ID token to access custom claims
        try {
          // Force token refresh to get latest claims
          const idTokenResult = await user.getIdTokenResult(true);
          const adminClaim = idTokenResult.claims.admin === true;
          
          console.log("Auth check:", {
            email: user.email,
            adminClaim: adminClaim,
            allClaims: idTokenResult.claims
          });
          
          setUser({
            ...user,
            customClaims: { admin: adminClaim },
          } as AuthUser);
          setIsAdmin(adminClaim);
        } catch (error) {
          console.error("Error getting ID token:", error);
          setUser(user as AuthUser);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setIsAdmin(false);
  };

  return { user, loading, signOut, isAdmin };
}

