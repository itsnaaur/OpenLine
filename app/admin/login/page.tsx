"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Lock, Mail, Shield, CheckCircle2, Eye, Sparkles, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import Button from "../../components/Button";
import Card from "../../components/Card";

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Force token refresh to get admin claim
      const idTokenResult = await userCredential.user.getIdTokenResult(true);
      const isAdmin = idTokenResult.claims.admin === true;
      
      console.log("Login - Admin check:", {
        email: userCredential.user.email,
        isAdmin: isAdmin,
        claims: idTokenResult.claims
      });
      
      if (isAdmin) {
        toast.success("Login successful!");
        // Small delay to ensure token is refreshed
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 500);
      } else {
        toast.error("Access denied. Admin privileges required. Please contact administrator.");
        await signOut(auth);
      }
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

  const features = [
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Enterprise-grade security to protect sensitive data",
    },
    {
      icon: Eye,
      title: "Full Report Visibility",
      description: "Access and manage all reports in one centralized dashboard",
    },
    {
      icon: CheckCircle2,
      title: "AI-Powered Insights",
      description: "Leverage AI compliance verification for accurate report analysis",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f0f9fc] to-[#e6f4f8] background-pattern background-grid flex flex-col">
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
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-0 items-stretch">
            {/* Left Side - Login Form */}
            <div className="flex">
              <Card variant="elevated" className="w-full p-6 flex flex-col rounded-xl lg:rounded-tl-xl lg:rounded-bl-xl lg:rounded-tr-none lg:rounded-br-none">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#116aae] to-[#0da2cb] rounded-lg mb-4 shadow-lg">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                    Admin Login
                  </h1>
                  <p className="text-sm text-gray-600">
                    Sign in to access the admin dashboard
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none transition-all bg-white hover:border-gray-300 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none transition-all bg-white hover:border-gray-300 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full"
                    size="md"
                  >
                    {!isLoading && "Sign In"}
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-[#e6f4f8]/80 rounded-lg border border-[#0da2cb]/30">
                  <p className="text-xs text-[#224092]">
                    <strong className="text-[#116aae]">Note:</strong> This is an admin-only area. You must have an admin account created in Firebase Authentication to access the dashboard.
                  </p>
                </div>
              </Card>
            </div>

            {/* Right Side - Design/Info */}
            <div className="flex">
              <Card variant="elevated" className="w-full p-6 bg-gradient-to-br from-[#116aae] via-[#0d87bc] to-[#0da2cb] text-white relative overflow-hidden flex flex-col rounded-xl lg:rounded-tr-xl lg:rounded-br-xl lg:rounded-tl-none lg:rounded-bl-none">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold mb-3 border border-white/30">
                      <Sparkles className="w-3 h-3" />
                      <span>Administrative Access</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 leading-tight">
                      Welcome to Admin Dashboard
                    </h2>
                    <p className="text-sm opacity-95 leading-relaxed">
                      Manage reports, verify compliance, and communicate with users through our comprehensive administrative platform.
                    </p>
                  </div>

                  <div className="flex-1 space-y-3 mb-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2.5 p-2.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <feature.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm mb-0.5">{feature.title}</h3>
                          <p className="text-xs opacity-90 leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/20 mt-auto">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5" />
                      <span className="text-xs opacity-90">Protected admin access with secure authentication</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
