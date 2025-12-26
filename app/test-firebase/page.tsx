"use client";

import { useEffect, useState } from "react";
import { db, storage, auth } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function TestFirebasePage() {
  const [status, setStatus] = useState<{
    firebase: "checking" | "success" | "error";
    firestore: "checking" | "success" | "error";
    storage: "checking" | "success" | "error";
    auth: "checking" | "success" | "error";
  }>({
    firebase: "checking",
    firestore: "checking",
    storage: "checking",
    auth: "checking",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test Firebase initialization
        if (db && storage && auth) {
          setStatus((prev) => ({ ...prev, firebase: "success" }));
        } else {
          throw new Error("Firebase services not initialized");
        }

        // Test Firestore connection
        try {
          await getDocs(collection(db, "reports"));
          setStatus((prev) => ({ ...prev, firestore: "success" }));
        } catch (err: any) {
          setStatus((prev) => ({ ...prev, firestore: "error" }));
          throw new Error(`Firestore: ${err.message}`);
        }

        // Test Storage connection (just check if it's initialized)
        if (storage) {
          setStatus((prev) => ({ ...prev, storage: "success" }));
        } else {
          throw new Error("Storage not initialized");
        }

        // Test Auth connection
        if (auth) {
          setStatus((prev) => ({ ...prev, auth: "success" }));
        } else {
          throw new Error("Auth not initialized");
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
        console.error("Firebase connection error:", err);
      }
    };

    testConnection();
  }, []);

  const StatusIcon = ({
    status,
  }: {
    status: "checking" | "success" | "error";
  }) => {
    if (status === "checking") {
      return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
    }
    if (status === "success") {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const allSuccess =
    status.firebase === "success" &&
    status.firestore === "success" &&
    status.storage === "success" &&
    status.auth === "success";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Firebase Connection Test
        </h1>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">Firebase App</span>
            <StatusIcon status={status.firebase} />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">Firestore Database</span>
            <StatusIcon status={status.firestore} />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">Firebase Storage</span>
            <StatusIcon status={status.storage} />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">Firebase Auth</span>
            <StatusIcon status={status.auth} />
          </div>
        </div>

        {allSuccess ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-green-800 mb-2">
              ✅ Firebase Connected Successfully!
            </h2>
            <p className="text-green-700">
              All services are initialized and ready to use.
            </p>
            <a
              href="/"
              className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Home
            </a>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">
              ❌ Connection Error
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="bg-white rounded p-4 text-sm text-gray-700">
              <p className="font-semibold mb-2">Common fixes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check that <code className="bg-gray-100 px-1 rounded">.env.local</code> exists in project root</li>
                <li>Verify all <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_</code> variables are set</li>
                <li>Restart dev server after creating/updating .env.local</li>
                <li>Check Firebase Console - ensure services are enabled</li>
              </ul>
            </div>
            <a
              href="/"
              className="inline-block mt-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to Home
            </a>
          </div>
        ) : (
          <div className="text-center text-gray-600">
            Testing connection...
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Need help? Check <code className="bg-gray-100 px-1 rounded">FIREBASE_SETUP.md</code> for detailed instructions.
          </p>
        </div>
      </div>
    </div>
  );
}

