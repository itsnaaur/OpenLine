"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../../components/Header";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Failed to login. Please check your credentials.";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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

        <div className="w-full max-w-md mx-auto relative z-10 px-2 md:px-0">
          <div className="bg-white md:bg-white/80 md:backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg md:shadow-2xl p-4 md:p-5 lg:p-6 xl:p-7 border-0 md:border border-gray-200/50">
            <div className="text-center mb-6 md:mb-7">
              <div className="mx-auto w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#116aae] to-[#0da2cb] rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-5 shadow-lg">
                <Lock className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-[#116aae] to-[#0da2cb] bg-clip-text text-transparent">
                Admin Login
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Sign in to access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none transition-all bg-white hover:border-gray-300 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none transition-all bg-white hover:border-gray-300 text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#116aae] to-[#0da2cb] text-white py-2.5 md:py-3 px-4 md:px-5 rounded-lg md:rounded-xl font-semibold hover:from-[#224092] hover:to-[#0d87bc] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-5 md:mt-6 p-3 md:p-4 bg-[#e6f4f8]/80 border border-[#0da2cb]/50 rounded-lg">
              <p className="text-xs md:text-sm text-[#224092]">
                <strong>Note:</strong> This is an admin-only area. You must have an admin account created in Firebase Authentication to access the dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

