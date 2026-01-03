"use client";

import Link from "next/link";
import Image from "next/image";
import { FileText, Search, Shield, Lock, ArrowRight, Heart, Users, Eye, CheckCircle2, Sparkles } from "lucide-react";
import Header from "./components/Header";
import Card from "./components/Card";
import Button from "./components/Button";

export default function Home() {

  const reasonsToReport = [
    {
      icon: Shield,
      title: "Your Safety Matters",
      description: "Reporting unsafe conditions protects you and others from harm.",
    },
    {
      icon: Heart,
      title: "Mental Health Support",
      description: "Your voice matters in creating a supportive and healthy environment.",
    },
    {
      icon: Users,
      title: "Protect Your Community",
      description: "Your report can prevent others from experiencing the same issues.",
    },
    {
      icon: Eye,
      title: "Anonymous & Secure",
      description: "Your identity is completely protected. Report without fear.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f0f9fc] to-[#e6f4f8] relative overflow-hidden">
      <Header showNav={true} />
      
      {/* Welcome/Safety-themed background for hero section - more detailed and welcoming */}
      <div className="absolute top-0 left-0 right-0 h-[900px] overflow-hidden pointer-events-none">
        {/* Soft flowing waves/organic shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 900" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0dc7e4" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#116aae" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0da2cb" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#116aae" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#0da2cb" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0dc7e4" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <path d="M0,400 Q300,300 600,400 T1200,400 L1200,900 L0,900 Z" fill="url(#waveGradient1)" />
            <path d="M0,600 Q400,500 800,600 T1200,600 L1200,900 L0,900 Z" fill="url(#waveGradient2)" opacity="0.7" />
          </svg>
        </div>

        {/* Large elegant gradient orbs */}
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#0dc7e4]/20 via-[#116aae]/15 to-[#0da2cb]/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-40 left-10 w-[450px] h-[450px] bg-gradient-to-br from-[#116aae]/18 via-[#0da2cb]/15 to-[#0dc7e4]/18 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-[#0da2cb]/16 via-[#0dc7e4]/14 to-[#116aae]/16 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>

        {/* Decorative geometric shapes - shields and protection symbols */}
        <div className="absolute top-1/4 left-1/4 opacity-10">
          <svg width="120" height="140" viewBox="0 0 120 140">
            <path d="M60,10 L100,35 L100,85 Q100,115 60,130 Q20,115 20,85 L20,35 Z" fill="none" stroke="#116aae" strokeWidth="2" />
            <circle cx="60" cy="70" r="15" fill="none" stroke="#0dc7e4" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-8 transform rotate-12">
          <svg width="100" height="120" viewBox="0 0 100 120">
            <path d="M50,8 L85,30 L85,75 Q85,100 50,112 Q15,100 15,75 L15,30 Z" fill="none" stroke="#0da2cb" strokeWidth="2" />
          </svg>
        </div>
        <div className="absolute bottom-1/4 right-1/3 opacity-10 transform -rotate-6">
          <svg width="110" height="130" viewBox="0 0 110 130">
            <path d="M55,12 L90,35 L90,80 Q90,105 55,118 Q20,105 20,80 L20,35 Z" fill="none" stroke="#0dc7e4" strokeWidth="2" />
            <circle cx="55" cy="65" r="12" fill="none" stroke="#116aae" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Gentle light rays/beams */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#0dc7e4]/20 via-transparent to-transparent transform -skew-x-12"></div>
        </div>
        <div className="absolute top-0 right-1/3 w-px h-full">
          <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-[#116aae]/18 via-transparent to-transparent transform skew-x-12"></div>
        </div>
        <div className="absolute top-0 left-1/3 w-px h-full">
          <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-[#0da2cb]/15 via-transparent to-transparent transform -skew-x-6"></div>
        </div>

        {/* Floating particles/sparkles */}
        <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-[#0dc7e4]/40 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 bg-[#116aae]/45 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 left-2/5 w-2 h-2 bg-[#0da2cb]/35 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-[#0dc7e4]/40 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#116aae]/38 rounded-full animate-ping" style={{ animationDuration: '4.5s', animationDelay: '2s' }}></div>

        {/* Subtle connecting dots pattern (more organic than tracking lines) */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#0dc7e4]/30 rounded-full"></div>
        <div className="absolute top-1/3 left-2/5 w-2 h-2 bg-[#116aae]/25 rounded-full"></div>
        <div className="absolute top-2/5 right-1/3 w-2.5 h-2.5 bg-[#0da2cb]/28 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/5 w-2 h-2 bg-[#0dc7e4]/25 rounded-full"></div>
        <div className="absolute bottom-1/4 right-2/5 w-3 h-3 bg-[#116aae]/30 rounded-full"></div>

        {/* Soft mesh gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5"></div>
      </div>

        {/* Admin Login Button */}
      <Link
        href="/admin/login"
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl border border-gray-200/50 transition-all hover:scale-110 active:scale-95 group z-50 touch-manipulation"
        title="Admin Login"
        aria-label="Admin Login"
      >
          <Lock className="w-6 h-6 md:w-5 md:h-5 text-gray-500/70 group-hover:text-[#116aae] transition-colors" />
      </Link>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        {/* Hero Section */}
          <div className="text-center mb-16 max-w-4xl mx-auto relative z-10 pb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0dc7e4]/15 backdrop-blur-sm rounded-full text-[#116aae] text-sm font-semibold mb-6 border border-[#0da2cb]/30 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>100% Anonymous & Secure Reporting</span>
            </div>
            
            <div className="flex justify-center mb-8">
              <Image
                src="/OpenLine (Icon and Word Logo).png"
                alt="OpenLine"
                width={320}
                height={110}
                className="h-20 md:h-28 w-auto"
                priority
              />
          </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Your Voice Matters
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#116aae] to-[#0da2cb] mt-2">
                Speak Up Safely
              </span>
          </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-4 max-w-2xl mx-auto leading-relaxed">
              Report issues, concerns, or suggestions anonymously. Your identity is protected, your safety is our priority.
            </p>

            <p className="text-base text-gray-600 max-w-xl mx-auto mb-8">
              Don&apos;t let fear silence you. Every report makes a difference in creating a safer, healthier environment for everyone.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/submit">
                <Button size="lg" className="w-full sm:w-auto">
                  Submit a Report
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/track">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Track Your Report
                </Button>
              </Link>
            </div>
        </div>

          {/* Sections with grid background */}
          <div className="background-grid relative z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
            {/* Why Report Section */}
            <div className="mb-16 mt-12 md:mt-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Why You Should Report
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Your report is powerful. It creates change, protects others, and helps build a better environment for everyone.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {reasonsToReport.map((reason, index) => (
                  <Card key={index} variant="elevated" hover className="p-6 text-center">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#116aae] to-[#0da2cb] rounded-xl mb-4 mx-auto shadow-lg">
                      <reason.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{reason.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{reason.description}</p>
                  </Card>
                ))}
              </div>
            </div>

          {/* Encouragement Section */}
          <Card variant="elevated" className="p-8 md:p-12 bg-gradient-to-br from-[#116aae] to-[#0da2cb] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                You&apos;re Not Alone
              </h2>
              <p className="text-lg md:text-xl mb-6 opacity-95 leading-relaxed">
                Every report is handled with care and confidentiality. Your courage to speak up can prevent harm, 
                protect others, and create positive change. We&apos;re here to listen, support, and take action.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>100% Anonymous</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span>Supportive Environment</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="mt-16 grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <Card variant="elevated" hover className="p-8 relative overflow-hidden h-full flex flex-col">
              {/* Background Visualization */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#116aae]/10 to-[#0da2cb]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#0dc7e4]/8 to-transparent rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Large Visualization - Document/Report */}
                <div className="mb-4 shrink-0">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#116aae] to-[#0da2cb] rounded-2xl flex items-center justify-center shadow-xl">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#0dc7e4] rounded-full border-2 border-white"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#116aae] rounded-full border-2 border-white"></div>
                    </div>
                  </div>
                  
                  {/* SVG Illustration - Document with lines */}
                  <div className="hidden md:block relative h-20 mb-3">
                    <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Document background */}
                      <rect x="40" y="20" width="120" height="80" rx="4" fill="white" stroke="#116aae" strokeWidth="2" opacity="0.9"/>
                      <rect x="40" y="20" width="120" height="20" rx="4" fill="url(#docGradient1)"/>
                      
                      {/* Document lines */}
                      <line x1="50" y1="50" x2="140" y2="50" stroke="#0da2cb" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="50" y1="60" x2="130" y2="60" stroke="#0da2cb" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
                      <line x1="50" y1="70" x2="145" y2="70" stroke="#0da2cb" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
                      <line x1="50" y1="80" x2="125" y2="80" stroke="#0da2cb" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                      
                      {/* Shield overlay */}
                      <circle cx="100" cy="50" r="25" fill="none" stroke="#0dc7e4" strokeWidth="1.5" opacity="0.3"/>
                      <path d="M100,35 L110,45 L105,45 L105,65 L95,65 L95,45 L90,45 Z" fill="#0dc7e4" opacity="0.2"/>
                      
                      <defs>
                        <linearGradient id="docGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#116aae" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#0da2cb" stopOpacity="0.2"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                <div className="mb-4 grow">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Ready to Report?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">Share your concern safely and anonymously. Your voice matters and can make a real difference.</p>

                  {/* Visual indicators */}
                  <div className="flex items-center gap-4 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#116aae]" />
                      <span className="text-xs text-gray-600 font-medium">100% Anonymous</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#0da2cb]" />
                      <span className="text-xs text-gray-600 font-medium">Secure</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link href="/submit">
                    <Button size="md" className="w-full">
                      Submit a Report
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card variant="elevated" hover className="p-8 relative overflow-hidden h-full flex flex-col">
              {/* Background Visualization */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#0d87bc]/10 to-[#0dc7e4]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#116aae]/8 to-transparent rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Large Visualization - Tracking/Search */}
                <div className="mb-4 shrink-0">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#0d87bc] to-[#0dc7e4] rounded-2xl flex items-center justify-center shadow-xl">
                        <Search className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#0dc7e4] rounded-full border-2 border-white"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#0d87bc] rounded-full border-2 border-white"></div>
                    </div>
                  </div>
                  
                  {/* SVG Illustration - Tracking/Radar visualization */}
                  <div className="hidden md:block relative h-20 mb-3">
                    <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Radar circles */}
                      <circle cx="100" cy="60" r="35" stroke="#0d87bc" strokeWidth="2" opacity="0.3"/>
                      <circle cx="100" cy="60" r="25" stroke="#0dc7e4" strokeWidth="2" opacity="0.4"/>
                      <circle cx="100" cy="60" r="15" stroke="#0d87bc" strokeWidth="2" opacity="0.5"/>
                      
                      {/* Scanning line */}
                      <line x1="100" y1="60" x2="135" y2="45" stroke="#0dc7e4" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                      
                      {/* Tracking dots */}
                      <circle cx="120" cy="50" r="4" fill="#0dc7e4"/>
                      <circle cx="110" cy="70" r="3" fill="#0d87bc" opacity="0.8"/>
                      <circle cx="90" cy="45" r="3" fill="#116aae" opacity="0.7"/>
                      
                      {/* Search icon overlay */}
                      <g transform="translate(100, 60)">
                        <circle r="18" fill="none" stroke="#0dc7e4" strokeWidth="1.5" opacity="0.4"/>
                        <circle r="8" fill="#0dc7e4" opacity="0.2"/>
                        <path d="M 18 18 L 24 24" stroke="#0d87bc" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                      </g>
                      
                      {/* Connection lines */}
                      <path d="M 120,50 Q 130,55 135,45" stroke="#0dc7e4" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="3,3"/>
                      <path d="M 90,45 Q 85,50 100,60" stroke="#0d87bc" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="3,3"/>
                    </svg>
                  </div>
                </div>

                <div className="mb-4 grow">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Check Status</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">Track your report using your access code. Stay updated on the progress and receive responses.</p>

                  {/* Visual indicators */}
                  <div className="flex items-center gap-4 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#0d87bc]" />
                      <span className="text-xs text-gray-600 font-medium">Real-time Updates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0dc7e4]" />
                      <span className="text-xs text-gray-600 font-medium">Track Progress</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link href="/track">
                    <Button
                      variant="secondary"
                      size="md"
                      className="w-full"
                    >
                      Track Report
                      <Search className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
