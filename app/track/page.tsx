"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, AlertCircle, Lock, ArrowRight, Home } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 md:py-8 lg:py-12 px-2 md:px-4 relative">
      {/* Background decorative elements - Hidden on mobile */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Discrete Admin Login - Bottom Right Corner */}
      <Link
        href="/admin/login"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 md:bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl border border-gray-200/50 transition-all hover:scale-110 group z-50"
        title="Admin Login"
        aria-label="Admin Login"
      >
        <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-500/70 group-hover:text-indigo-600 transition-colors" />
      </Link>

      <div className="w-full max-w-md mx-auto relative z-10 px-2 md:px-0">
        <div className="bg-white md:bg-white/80 md:backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg md:shadow-2xl p-4 md:p-5 lg:p-6 xl:p-7 border-0 md:border border-gray-200/50">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 mb-4 text-xs md:text-sm transition-colors"
        >
          <Home className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="text-center mb-5 md:mb-6">
          <div className="mx-auto w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 shadow-lg">
            <Search className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Track Your Report
          </h1>
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
            Enter your access code to view updates and communicate with administrators.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <div>
            <label htmlFor="accessCode" className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Access Code
            </label>
            <input
              id="accessCode"
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="XXX-XX-X"
              className="w-full px-4 py-2.5 md:px-5 md:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-center text-xl md:text-2xl font-mono tracking-wider uppercase bg-white hover:border-gray-300 transition-all"
              maxLength={8}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Format: XXX-XX-X (e.g., 8X2-99B)
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 md:py-3 px-4 md:px-5 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none text-sm"
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                Track Report
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 md:mt-6 p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-lg">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs md:text-sm text-blue-800">
              <p className="font-semibold mb-1">Don't have an access code?</p>
              <p className="text-blue-700 leading-relaxed">
                You received this code when you submitted your report. Check your records or{" "}
                <Link href="/submit" className="underline font-medium hover:text-blue-900">
                  submit a new report
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
