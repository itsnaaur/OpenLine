"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function TrackReportPage() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean the access code (remove spaces, convert to uppercase)
    const cleanedCode = accessCode.trim().toUpperCase().replace(/\s/g, "");
    
    if (!cleanedCode) {
      toast.error("Please enter an access code");
      return;
    }

    // Validate format (should be like XXX-XX-X)
    if (!/^[A-Z0-9]{3}-[A-Z0-9]{2}-[A-Z0-9]{1}$/.test(cleanedCode)) {
      toast.error("Invalid access code format. Format should be: XXX-XX-X");
      return;
    }

    setIsLoading(true);
    // Navigate to the report detail page
    router.push(`/track/${cleanedCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Report
          </h1>
          <p className="text-gray-600">
            Enter your access code to view updates and communicate with administrators.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
              Access Code
            </label>
            <input
              id="accessCode"
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="XXX-XX-X"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-center text-2xl font-mono tracking-wider uppercase"
              maxLength={8}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Format: XXX-XX-X (e.g., 8X2-99B)
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Track Report"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Don't have an access code?</p>
              <p className="text-blue-700">
                You received this code when you submitted your report. Check your records or{" "}
                <a href="/submit" className="underline font-medium">
                  submit a new report
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

