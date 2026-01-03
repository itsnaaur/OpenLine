"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Button from "../components/Button";

export default function TrackReportPage() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanedCode = accessCode.trim().toUpperCase().replace(/\s/g, "");
    
    if (!cleanedCode) {
      toast.error("Please enter an access code");
      return;
    }

    if (!/^[A-Z0-9]{3}-[A-Z0-9]{2}-[A-Z0-9]{1}$/.test(cleanedCode)) {
      toast.error("Invalid access code format. Format should be: XXX-XX-X");
      return;
    }

    setIsLoading(true);
    router.push(`/track/${cleanedCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f0f9fc] to-[#e6f4f8] flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
              <Image
                src="/OpenLine (Icon and Word Logo).png"
                alt="OpenLine Logo"
                width={180}
                height={50}
                className="h-8 md:h-10 w-auto"
                priority
              />
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Tracking-themed background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Radar/scanning circles - larger */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-2 border-[#0dc7e4]/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-[#116aae]/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-2 border-[#0da2cb]/30 rounded-full"></div>
        
        {/* Search/scanning lines - larger and longer */}
        <div className="absolute top-1/4 right-1/4 w-1 h-96 bg-gradient-to-b from-transparent via-[#0dc7e4]/30 to-transparent transform rotate-12"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1 h-96 bg-gradient-to-b from-transparent via-[#116aae]/30 to-transparent transform -rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-80 bg-gradient-to-b from-transparent via-[#0da2cb]/25 to-transparent transform rotate-45"></div>
        
        {/* Tracking dots/points - larger */}
        <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-[#0dc7e4]/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-[#116aae]/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#0da2cb]/50 rounded-full"></div>
        <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-[#0dc7e4]/40 rounded-full animate-ping" style={{ animationDelay: '0.7s' }}></div>
        
        {/* Gradient blurs - larger */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0dc7e4]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#116aae]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0da2cb]/3 rounded-full blur-3xl"></div>
        
        {/* Connection lines (tracking paths) - larger and more visible */}
        <svg className="absolute inset-0 w-full h-full opacity-25" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0dc7e4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#116aae" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path d="M 100 150 Q 300 100 500 150 T 900 150" stroke="url(#lineGradient)" strokeWidth="3" fill="none" strokeDasharray="8,8" />
          <path d="M 200 350 Q 400 300 600 350 T 1000 350" stroke="url(#lineGradient)" strokeWidth="3" fill="none" strokeDasharray="8,8" />
          <path d="M 50 550 Q 250 500 450 550 T 850 550" stroke="url(#lineGradient)" strokeWidth="3" fill="none" strokeDasharray="8,8" />
          <path d="M 150 750 Q 350 700 550 750 T 950 750" stroke="url(#lineGradient)" strokeWidth="3" fill="none" strokeDasharray="8,8" />
        </svg>
      </div>

      <div className="flex-1 flex items-center justify-center py-4 px-4 md:px-6 relative z-10">
        <div className="max-w-md mx-auto w-full">
          <Card variant="elevated" className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#116aae] to-[#0da2cb] rounded-xl mb-4 shadow-lg">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                Track Your Report
              </h1>
              <p className="text-sm text-gray-600">
                Enter your access code to view updates
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="accessCode" className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Access Code
                </label>
                <input
                  id="accessCode"
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="XXX-XX-X"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none text-center text-xl font-mono tracking-wider uppercase bg-gray-50 hover:border-gray-300 transition-all"
                  maxLength={8}
                />
                <p className="text-xs text-gray-500 mt-1.5 text-center">
                  Format: XXX-XX-X (e.g., 8X2-99B)
                </p>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="md"
              >
                {!isLoading && (
                  <>
                    Track Report
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-[#e6f4f8]/80 rounded-lg border border-[#0da2cb]/30">
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-[#116aae] mt-0.5 flex-shrink-0" />
                <div className="text-xs text-[#224092]">
                  <p className="font-semibold mb-0.5">Don&apos;t have an access code?</p>
                  <p className="text-[#116aae]">
                    You received this code when you submitted your report. Check your records or{" "}
                    <Link href="/submit" className="underline font-medium hover:text-[#224092]">
                      submit a new report
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
