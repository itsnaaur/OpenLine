import Link from "next/link";
import { FileText, Search, Shield, Lock, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden flex items-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Discrete Admin Login - Bottom Right Corner */}
      <Link
        href="/admin/login"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl border border-gray-200/50 transition-all hover:scale-110 group z-50"
        title="Admin Login"
        aria-label="Admin Login"
      >
        <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-500/70 group-hover:text-indigo-600 transition-colors" />
      </Link>

      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-10 lg:py-12 relative z-10 w-full max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 bg-indigo-100/80 backdrop-blur-sm rounded-full text-indigo-700 text-xs font-medium mb-3 md:mb-4 border border-indigo-200/50">
            <Shield className="w-3 h-3" />
            <span>100% Anonymous & Secure</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 md:mb-3 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent px-4">
            OpenLine
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-700 max-w-2xl mx-auto mb-2 font-medium px-4">
            Anonymous Whistleblowing & Feedback Portal
          </p>
          <p className="text-xs md:text-sm text-gray-600 max-w-xl mx-auto px-4">
            Report issues safely and anonymously. Your identity is protected.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-5 max-w-4xl mx-auto mb-5 md:mb-6">
          {/* Submit Report Card */}
          <Link
            href="/submit"
            className="group relative bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-5 md:p-6 border border-gray-200/50 hover:border-indigo-300/50 overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-blue-500/0 group-hover:from-indigo-500/5 group-hover:to-blue-500/5 transition-all duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg md:rounded-xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-indigo-500/50">
                <FileText className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Submit Report
              </h2>
              <p className="text-xs md:text-sm text-gray-600 mb-3 leading-relaxed">
                Report safety hazards, misconduct, facility issues, or suggestions completely anonymously.
              </p>
              <div className="flex items-center text-indigo-600 font-medium text-xs md:text-sm group-hover:gap-2 transition-all">
                <span>Get Started</span>
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Track Report Card */}
          <Link
            href="/track"
            className="group relative bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-5 md:p-6 border border-gray-200/50 hover:border-green-300/50 overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-green-500/50">
                <Search className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                Track Report
              </h2>
              <p className="text-xs md:text-sm text-gray-600 mb-3 leading-relaxed">
                Enter your access code to view updates and communicate with administrators.
              </p>
              <div className="flex items-center text-green-600 font-medium text-xs md:text-sm group-hover:gap-2 transition-all">
                <span>Track Now</span>
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section - Compact */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white/60 backdrop-blur-md rounded-xl md:rounded-2xl shadow-xl p-4 md:p-5 border border-gray-200/50">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1.5 md:mb-2">
                  Your Privacy is Protected
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  No login required. No personal information collected. Just your access code to track your report.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
