"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { accessCodeToReportId, isValidAccessCode, normalizeAccessCode } from "@/lib/utils";
import { clearTrackCode, useTrackCode } from "@/lib/trackSession";
import { getEvidenceUrls, isPdfUrl } from "@/lib/evidence";
import { Report, Message } from "@/types";
import { AlertCircle, Send, Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import Button from "../../components/Button";
import HeartbeatMonitor from "../../components/HeartbeatMonitor";

export default function ReportDetailPage() {
  const router = useRouter();
  // The access code comes from sessionStorage, never from the URL
  const storedCode = useTrackCode();
  const code = normalizeAccessCode(storedCode ?? "");
  const codeIsValid = isValidAccessCode(code);

  const [report, setReport] = useState<Report | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loading = storedCode === undefined || storedCode === null || (codeIsValid && !loaded);
  const error = codeIsValid ? loadError : "Report not found. Please check your access code.";
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  // No code in this tab (opened directly, new tab, or tab was closed): ask for it again
  useEffect(() => {
    if (storedCode === null) router.replace("/track");
  }, [storedCode, router]);

  useEffect(() => {
    if (!codeIsValid) return;

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    // Reports are stored under the hash of their access code, so the
    // reporter reads exactly one document and never queries the collection
    accessCodeToReportId(code).then((reportId) => {
      if (cancelled) return;
      unsubscribe = onSnapshot(
        doc(db, "reports", reportId),
        (snapshot) => {
          if (snapshot.exists()) {
            setReport({ id: snapshot.id, ...snapshot.data() } as Report);
            setLoadError(null);
          } else {
            setReport(null);
            setLoadError("Report not found. Please check your access code.");
          }
          setLoaded(true);
        },
        (err) => {
          console.error("Error fetching report:", err);
          setLoadError("Failed to load report. Please try again.");
          setLoaded(true);
        }
      );
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [code, codeIsValid]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !report?.id) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX
    
    try {
      const reportRef = doc(db, "reports", report.id);
      const newMessageObj: Message = {
        sender: "reporter",
        text: messageText,
        timestamp: Date.now(),
      };

      // arrayUnion appends server-side, so concurrent messages are not overwritten
      await updateDoc(reportRef, {
        messages: arrayUnion(newMessageObj),
        lastUpdated: Date.now(),
      });

      toast.success("Message sent!");
    } catch (err) {
      console.error("Error sending message:", err);
      // Restore the message text if send failed
      setNewMessage(messageText);
      
      // Show more specific error message
      const code = (err as { code?: string }).code;
      if (code === 'permission-denied') {
        toast.error("Permission denied. Please refresh the page and try again.");
      } else if (code === 'failed-precondition') {
        toast.error("The report was updated. Please refresh and try again.");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-red-100 text-red-800 border-red-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-[#e6f4f8] text-[#116aae]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#e6f4f8] to-[#d9eaf5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#116aae] mx-auto mb-4" />
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#e6f4f8] to-[#d9eaf5] flex flex-col">
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
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <Card variant="elevated" className="max-w-md w-full p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The report you're looking for doesn't exist."}</p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  clearTrackCode();
                  router.push("/track");
                }}
                className="w-full"
              >
                Try Another Code
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full"
              >
                Go Home
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#e6f4f8] to-[#d9eaf5] flex flex-col relative overflow-hidden">
      {/* Heartbeat Monitor Background Animation */}
      <HeartbeatMonitor 
        messagesCount={report.messages?.length || 0} 
        isActive={report.status !== "Resolved"}
      />
      <header className="w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40 relative">
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
              <Link href="/track">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Track</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 py-4 md:py-6 lg:py-8 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Report Details */}
          <div className="mb-4 md:mb-5 lg:mb-6">
            <Card variant="elevated" className="p-6">
              <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Details</h1>
                <p className="text-sm text-gray-500">Access Code: <span className="font-mono font-semibold">{report.accessCode}</span></p>
              </div>
              <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(report.status)}`}>
                {report.status}
              </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <p className="font-medium text-gray-900">{report.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Urgency</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(report.urgency)}`}>
                  {report.urgency}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Submitted</p>
                <p className="font-medium text-gray-900">{formatDate(report.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="font-medium text-gray-900">{formatDate(report.lastUpdated)}</p>
              </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-900 whitespace-pre-wrap">{report.description}</p>
              </div>

              {getEvidenceUrls(report.evidenceUrl).length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Evidence</p>
                  <div className="space-y-4">
                    {getEvidenceUrls(report.evidenceUrl).map((url, idx, urls) => (
                      <div key={url}>
                        {isPdfUrl(url) ? (
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-[#116aae] hover:text-[#224092]"
                            >
                              <ImageIcon className="w-5 h-5" />
                              <span>View PDF Evidence {urls.length > 1 ? `(${idx + 1})` : ''}</span>
                            </a>
                          </div>
                        ) : (
                          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <Image
                              src={url}
                              alt={`Evidence ${idx + 1}`}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Chat Section */}
          <Card variant="elevated" className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Messages</h2>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
            {report.messages && report.messages.length > 0 ? (
              report.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === "admin" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-4 ${
                      message.sender === "admin"
                        ? "bg-gray-100 text-gray-900"
                        : "bg-gradient-to-r from-[#116aae] to-[#0da2cb] text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-bold ${
                        message.sender === "admin" ? "text-gray-600" : "text-white/90"
                      }`}>
                        {message.sender === "admin" ? "Administrator" : "You"}
                      </span>
                      <span className={`text-xs ${
                        message.sender === "admin" ? "text-gray-500" : "text-white/70"
                      }`}>
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm whitespace-pre-wrap leading-relaxed ${
                      message.sender === "admin" ? "text-gray-900" : "text-white"
                    }`}>
                      {message.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No messages yet.</p>
            )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2 items-stretch">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              maxLength={5000}
              className="flex-1 px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none text-base min-w-0"
              disabled={sending}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || sending}
              isLoading={sending}
              size="md"
              className="flex items-center gap-1 md:gap-2 shrink-0 px-3 md:px-4"
            >
              {!sending && (
                <>
                  <Send className="w-4 h-4 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </Button>
            </form>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

