"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, AlertCircle, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/Header";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#e6f4f8] to-[#d9eaf5] flex flex-col">
      <Header showBackButton={true} backHref="/" backLabel="Back to Home" />
      <div className="flex-1 py-4 md:py-8 lg:py-12 px-2 md:px-4 relative">
        {/* Background decorative elements - Hidden on mobile */}
        <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#0dc7e4]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#116aae]/20 rounded-full blur-3xl"></div>
        </div>

        {/* Discrete Admin Login - Bottom Right Corner */}
        <Link
          href="/admin/login"
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 md:bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl border border-gray-200/50 transition-all hover:scale-110 group z-50"
          title="Admin Login"
          aria-label="Admin Login"
        >
          <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-500/70 group-hover:text-[#116aae] transition-colors" />
        </Link>

        <div className="w-full max-w-md mx-auto relative z-10 px-2 md:px-0">
          <div className="bg-white md:bg-white/80 md:backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg md:shadow-2xl p-4 md:p-5 lg:p-6 xl:p-7 border-0 md:border border-gray-200/50">
            <div className="text-center mb-5 md:mb-6">
              <div className="mx-auto w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#0d87bc] to-[#0dc7e4] rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 shadow-lg">
                <Search className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-[#116aae] to-[#0da2cb] bg-clip-text text-transparent">
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
                  className="w-full px-4 py-2.5 md:px-5 md:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none text-center text-xl md:text-2xl font-mono tracking-wider uppercase bg-white hover:border-gray-300 transition-all"
                  maxLength={8}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Format: XXX-XX-X (e.g., 8X2-99B)
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#116aae] to-[#0da2cb] text-white py-2.5 md:py-3 px-4 md:px-5 rounded-lg font-semibold hover:from-[#224092] hover:to-[#0d87bc] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none text-sm"
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

            <div className="mt-5 md:mt-6 p-4 bg-[#e6f4f8]/80 backdrop-blur-sm border border-[#0da2cb]/50 rounded-lg">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-[#116aae] mt-0.5 flex-shrink-0" />
                <div className="text-xs md:text-sm text-[#224092]">
                  <p className="font-semibold mb-1">Don't have an access code?</p>
                  <p className="text-[#116aae] leading-relaxed">
                    You received this code when you submitted your report. Check your records or{" "}
                    <Link href="/submit" className="underline font-medium hover:text-[#224092]">
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
    </div>
  );
}
