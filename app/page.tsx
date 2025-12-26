import Link from "next/link";
import { FileText, Search, Shield, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Discrete Admin Login - Bottom Right Corner */}
      <Link
        href="/admin/login"
        className="fixed bottom-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200/30 hover:bg-gray-300/50 backdrop-blur-sm transition-all hover:scale-110 group"
        title="Admin Login"
        aria-label="Admin Login"
      >
        <Lock className="w-4 h-4 text-gray-500/60 group-hover:text-gray-600/80" />
      </Link>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            OpenLine
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Anonymous Whistleblowing & Feedback Portal
          </p>
          <p className="text-gray-500 mt-4">
            Report issues safely and anonymously. Your identity is protected.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Submit Report Card */}
          <Link
            href="/submit"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6 group-hover:bg-indigo-200 transition-colors">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Submit Report
            </h2>
            <p className="text-gray-600">
              Report safety hazards, misconduct, facility issues, or suggestions completely anonymously.
            </p>
          </Link>

          {/* Track Report Card */}
          <Link
            href="/track"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 group-hover:bg-green-200 transition-colors">
              <Search className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Track Report
            </h2>
            <p className="text-gray-600">
              Enter your access code to view updates and communicate with administrators.
            </p>
          </Link>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Privacy is Protected
                </h3>
                <p className="text-gray-600 text-sm">
                  OpenLine uses advanced encryption to ensure your identity remains completely anonymous. 
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
