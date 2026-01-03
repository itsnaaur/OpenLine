"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/hooks/useAuth";
import Card from "../../components/Card";

export default function AdminDebugPage() {
  const { user, loading, isAdmin } = useAuth();
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    const checkToken = async () => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true);
          setTokenInfo({
            claims: idTokenResult.claims,
            admin: idTokenResult.claims.admin,
            expirationTime: idTokenResult.expirationTime,
          });
        } catch (error) {
          console.error("Error getting token:", error);
        }
      }
    };
    checkToken();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card variant="elevated" className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Debug Info</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Auth State</h2>
            <p>Loading: {loading ? "Yes" : "No"}</p>
            <p>User: {user ? user.email : "Not logged in"}</p>
            <p>Is Admin (from hook): {isAdmin ? "Yes" : "No"}</p>
          </div>

          {tokenInfo && (
            <div>
              <h2 className="font-semibold">Token Info</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(tokenInfo, null, 2)}
              </pre>
            </div>
          )}

          {user && (
            <div>
              <h2 className="font-semibold">User Info</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                {JSON.stringify({
                  uid: user.uid,
                  email: user.email,
                  emailVerified: user.emailVerified,
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

