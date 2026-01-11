"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Report, ReportStatus, Message, UrgencyLevel, ReportCategory } from "@/types";
import { Send, Loader2, Image as ImageIcon, Save, Bot, AlertTriangle, CheckCircle2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { runAiCheck } from "@/app/actions";
import Footer from "../../../components/Footer";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Link from "next/link";
import ImageZoomModal from "../../../components/ImageZoomModal";
import { formatLawDisplayName, getLawReference } from "@/lib/lawReferences";

export default function AdminReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>("New");
  const [runningAiCheck, setRunningAiCheck] = useState(false);
  const [updatingUrgency, setUpdatingUrgency] = useState(false);
  const [selectedUrgency, setSelectedUrgency] = useState<string>("");
  const [updatingCategory, setUpdatingCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [evidenceImages, setEvidenceImages] = useState<string[]>([]);

  useEffect(() => {
    if (!reportId) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        const reportRef = doc(db, "reports", reportId);
        const docSnapshot = await getDoc(reportRef);

        if (!docSnapshot.exists()) {
          toast.error("Report not found");
          router.push("/admin/dashboard");
          return;
        }

        const reportData = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        } as Report;

        setReport(reportData);
        setSelectedStatus(reportData.status);
        setSelectedUrgency(reportData.urgency);
        setSelectedCategory(reportData.category);

        // Set up real-time listener
        const unsubscribe = onSnapshot(reportRef, (snapshot) => {
          if (snapshot.exists()) {
            const updatedData = {
              id: snapshot.id,
              ...snapshot.data(),
            } as Report;
            setReport(updatedData);
            setSelectedStatus(updatedData.status);
            setSelectedCategory(updatedData.category);
            
            // Update evidence images
            if (updatedData.evidenceUrl) {
              const images: string[] = [];
              if (Array.isArray(updatedData.evidenceUrl)) {
                images.push(...updatedData.evidenceUrl.filter(url => !url.endsWith('.pdf')));
              } else if (typeof updatedData.evidenceUrl === 'string' && !updatedData.evidenceUrl.endsWith('.pdf')) {
                images.push(updatedData.evidenceUrl);
              }
              setEvidenceImages(images);
            }
            
            // If AI analysis exists and there's a mismatch, set selectedUrgency to AI's recommendation
            // Otherwise, use the current urgency
            if (updatedData.aiAnalysis && !updatedData.aiAnalysis.urgencyMatch) {
              setSelectedUrgency(updatedData.aiAnalysis.aiAssessment);
            } else {
              setSelectedUrgency(updatedData.urgency);
            }
          }
        });

        setLoading(false);
        return () => unsubscribe();
      } catch (error: any) {
        console.error("Error fetching report:", error);
        toast.error("Failed to load report");
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, router]);

  const handleStatusUpdate = async () => {
    if (!report || selectedStatus === report.status) return;

    setUpdatingStatus(true);
    try {
      const reportRef = doc(db, "reports", report.id!);
      await updateDoc(reportRef, {
        status: selectedStatus,
        lastUpdated: Date.now(),
      });
      toast.success("Status updated successfully!");
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !report?.id) return;

    setSending(true);
    try {
      const reportRef = doc(db, "reports", report.id);
      const newMessageObj: Message = {
        sender: "admin",
        text: newMessage.trim(),
        timestamp: Date.now(),
      };

      await updateDoc(reportRef, {
        messages: [...(report.messages || []), newMessageObj],
        lastUpdated: Date.now(),
      });

      setNewMessage("");
      toast.success("Message sent!");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: ReportStatus) => {
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

  const handleRunAiCheck = async () => {
    if (!report?.id) return;

    setRunningAiCheck(true);
    try {
      toast.loading("Running AI compliance check...", { id: "ai-check" });
      
      // Call server action to get AI result (no Firestore update here)
      const result = await runAiCheck(
        report.description,
        report.category,
        report.urgency
      );

      if (result) {
        // Save to Firestore on client side (with admin auth context)
        const reportRef = doc(db, "reports", report.id);
        await updateDoc(reportRef, {
          aiAnalysis: result,
          lastUpdated: Date.now(),
        });
        
        // If there's a discrepancy, set the selected values to AI's assessment
        if (!result.categoryMatch && result.categoryAssessment) {
          setSelectedCategory(result.categoryAssessment);
        }
        if (!result.urgencyMatch && result.aiAssessment) {
          setSelectedUrgency(result.aiAssessment);
        }
        
        toast.success("AI analysis completed!", { id: "ai-check" });
        // The report will be updated via real-time listener
      } else {
        toast.error("AI analysis failed. Please try again.", { id: "ai-check" });
      }
    } catch (error: any) {
      console.error("Error running AI check:", error);
      toast.error("Failed to run AI check. Please try again.", { id: "ai-check" });
    } finally {
      setRunningAiCheck(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!report?.id || !report.aiAnalysis || selectedCategory === report.category) return;

    setUpdatingCategory(true);
    try {
      const reportRef = doc(db, "reports", report.id);
      const now = Date.now();
      
      // Create a message explaining the category change with law cited
      const lawDisplayName = formatLawDisplayName(report.aiAnalysis.lawCited);
      const categoryChangeMessage: Message = {
        sender: "admin",
        text: `📋 Category Updated\n\nYour report's category has been updated from "${report.category}" to "${selectedCategory}" based on AI compliance verification.\n\n📋 Law Cited: ${lawDisplayName}\n\nReason: ${report.aiAnalysis.reason}\n\nThis change ensures proper classification for compliance with Philippine Corporate Laws.`,
        timestamp: now,
      };

      // Update category and add message
      await updateDoc(reportRef, {
        category: selectedCategory as ReportCategory,
        messages: [...(report.messages || []), categoryChangeMessage],
        lastUpdated: now,
      });

      // Preserve selectedUrgency to AI's recommendation if there's still a mismatch
      // This ensures the urgency update button remains enabled
      if (report.aiAnalysis && !report.aiAnalysis.urgencyMatch && report.aiAnalysis.aiAssessment) {
        setSelectedUrgency(report.aiAnalysis.aiAssessment);
      }

      toast.success("Category updated and reporter notified!");
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setUpdatingCategory(false);
    }
  };

  const handleUpdateUrgency = async () => {
    if (!report?.id || !report.aiAnalysis || selectedUrgency === report.urgency) return;

    setUpdatingUrgency(true);
    try {
      const reportRef = doc(db, "reports", report.id);
      const now = Date.now();
      
      // Create a message explaining the urgency change with law cited
      const lawDisplayName = formatLawDisplayName(report.aiAnalysis.lawCited);
      const urgencyChangeMessage: Message = {
        sender: "admin",
        text: `⚠️ Urgency Level Updated\n\nYour report's urgency has been updated from "${report.urgency}" to "${selectedUrgency}" based on AI compliance verification.\n\n📋 Law Cited: ${lawDisplayName}\n\nReason: ${report.aiAnalysis.reason}\n\nThis change ensures compliance with Philippine Corporate Laws.`,
        timestamp: now,
      };

      // Update urgency and add message
      await updateDoc(reportRef, {
        urgency: selectedUrgency as UrgencyLevel,
        messages: [...(report.messages || []), urgencyChangeMessage],
        lastUpdated: now,
      });

      toast.success("Urgency updated and reporter notified!");
    } catch (error: any) {
      console.error("Error updating urgency:", error);
      toast.error("Failed to update urgency");
    } finally {
      setUpdatingUrgency(false);
    }
  };

  const getAiAssessmentColor = (assessment: string) => {
    switch (assessment) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f0f9fc] to-[#e6f4f8] background-pattern background-grid flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#116aae] mx-auto mb-4" />
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f0f9fc] to-[#e6f4f8] background-pattern background-grid flex items-center justify-center p-4">
        <Card variant="elevated" className="max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
          <p className="text-gray-600 mb-6">The report you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push("/admin/dashboard")} className="w-full">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

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
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
        <div className="grid lg:grid-cols-2 gap-6 h-full">
          {/* Left Side - Report Details & AI Compliance */}
          <div className="flex flex-col gap-6 min-w-0">
            {/* Report Header */}
            <Card variant="elevated" className="p-4 md:p-6 overflow-x-hidden">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Report Details</h1>
                  <p className="text-sm text-gray-600">
                    Access Code: <span className="font-mono font-semibold text-[#116aae]">{report.accessCode}</span>
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg border-2 font-semibold text-sm ${getStatusColor(report.status)}`}>
                  {report.status}
                </div>
              </div>

              {/* Status Update Section */}
              <div className="mb-6 p-4 bg-[#e6f4f8]/80 rounded-lg border border-[#0da2cb]/30">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Update Status
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as ReportStatus)}
                    className="flex-1 px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none text-sm md:text-base"
                    disabled={updatingStatus}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={selectedStatus === report.status || updatingStatus}
                    isLoading={updatingStatus}
                    className="flex items-center gap-2"
                  >
                    {!updatingStatus && <Save className="w-4 h-4" />}
                    Update
                  </Button>
                </div>
              </div>

              {/* Report Info Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1.5">Category</p>
                  <p className="font-semibold text-gray-900 text-lg">{report.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1.5">Urgency</p>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${getUrgencyColor(report.urgency)}`}>
                    {report.urgency}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1.5">Submitted</p>
                  <p className="font-semibold text-gray-900">{formatDate(report.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1.5">Last Updated</p>
                  <p className="font-semibold text-gray-900">{formatDate(report.lastUpdated)}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed break-words">{report.description}</p>
                </div>
              </div>

              {/* Evidence */}
              {report.evidenceUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">Evidence</p>
                  {Array.isArray(report.evidenceUrl) ? (
                    <div className="space-y-4">
                      {report.evidenceUrl.map((url, idx) => (
                        <div key={idx}>
                          {url.endsWith('.pdf') ? (
                            <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-[#116aae] hover:text-[#224092] font-medium"
                              >
                                <ImageIcon className="w-5 h-5" />
                                <span>View PDF Evidence {report.evidenceUrl && report.evidenceUrl.length > 1 ? `(${idx + 1})` : ''}</span>
                              </a>
                            </div>
                          ) : (
                            <div 
                              className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-[#116aae] transition-colors"
                              onClick={() => {
                                // Find the image index (excluding PDFs)
                                const imageUrls = report.evidenceUrl && Array.isArray(report.evidenceUrl) 
                                  ? report.evidenceUrl.filter(u => !u.endsWith('.pdf'))
                                  : (typeof report.evidenceUrl === 'string' && !report.evidenceUrl.endsWith('.pdf') 
                                    ? [report.evidenceUrl] 
                                    : []);
                                const imageIndex = imageUrls.indexOf(url);
                                if (imageIndex !== -1) {
                                  setSelectedImageIndex(imageIndex);
                                  setImageZoomOpen(true);
                                }
                              }}
                            >
                              <Image
                                src={url}
                                alt={`Evidence ${idx + 1}`}
                                fill
                                className="object-contain bg-gray-50"
                                unoptimized
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    typeof report.evidenceUrl === 'string' && report.evidenceUrl.endsWith('.pdf') ? (
                      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                        <a
                          href={report.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#116aae] hover:text-[#224092] font-medium"
                        >
                          <ImageIcon className="w-5 h-5" />
                          <span>View PDF Evidence</span>
                        </a>
                      </div>
                    ) : (
                      typeof report.evidenceUrl === 'string' && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={report.evidenceUrl}
                            alt="Evidence"
                            fill
                            className="object-contain bg-gray-50"
                            unoptimized
                          />
                        </div>
                      )
                    )
                  )}
                </div>
              )}
            </Card>

            {/* AI Compliance Card */}
            <Card 
              variant="elevated" 
              className={`p-4 md:p-6 overflow-x-hidden ${
                report.aiAnalysis && !report.aiAnalysis.match
                  ? "border-2 border-red-300"
                  : report.aiAnalysis && report.aiAnalysis.match
                  ? "border-2 border-green-300"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Bot className="w-6 h-6 text-[#116aae]" />
                <h2 className="text-xl font-bold text-gray-900">AI Compliance Verification</h2>
              </div>

              {report.aiAnalysis ? (
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    {report.aiAnalysis.match ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 space-y-3">
                      {/* Category Assessment */}
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-semibold">Category:</span>{" "}
                          <span className="text-gray-900">{report.category}</span>
                          {!report.aiAnalysis.categoryMatch && (
                            <>
                              {" → "}
                              <span className="font-semibold text-red-600">{report.aiAnalysis.categoryAssessment}</span>
                            </>
                          )}
                        </p>
                      </div>
                      {/* Urgency Assessment */}
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-semibold">Urgency:</span>{" "}
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getUrgencyColor(report.urgency)}`}>
                            {report.urgency}
                          </span>
                          {!report.aiAnalysis.urgencyMatch && (
                            <>
                              {" → "}
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getAiAssessmentColor(report.aiAnalysis.aiAssessment)}`}>
                                {report.aiAnalysis.aiAssessment}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!report.aiAnalysis.match && (
                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-red-800 mb-1">
                          ⚠️ Discrepancy Detected
                        </p>
                        <p className="text-sm text-red-700">
                          {!report.aiAnalysis.categoryMatch && !report.aiAnalysis.urgencyMatch
                            ? "Category and urgency do not match AI's compliance-based analysis."
                            : !report.aiAnalysis.categoryMatch
                            ? "Category does not match AI's compliance-based analysis."
                            : "Urgency does not match AI's compliance-based analysis."}
                        </p>
                      </div>

                      {/* Update Category Section (if mismatch) */}
                      {!report.aiAnalysis.categoryMatch && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm font-semibold text-yellow-900 mb-3">
                            Update Category to Match AI Assessment
                          </p>
                          <div className="flex items-center gap-3">
                            <select
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="flex-1 px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none text-sm md:text-base"
                              disabled={updatingCategory}
                            >
                              <option value="Workplace Safety & Health">Workplace Safety & Health</option>
                              <option value="Sexual Harassment & Gender-Based Violence">Sexual Harassment & Gender-Based Violence</option>
                              <option value="Bullying & Discrimination">Bullying & Discrimination</option>
                              <option value="Data Privacy Violation">Data Privacy Violation</option>
                              <option value="Financial Misconduct">Financial Misconduct</option>
                              <option value="Facility & Equipment Issue">Facility & Equipment Issue</option>
                              <option value="General Suggestion/Feedback">General Suggestion/Feedback</option>
                            </select>
                            <Button
                              onClick={handleUpdateCategory}
                              disabled={selectedCategory === report.category || updatingCategory}
                              isLoading={updatingCategory}
                              variant="secondary"
                              className="flex items-center gap-2"
                            >
                              {!updatingCategory && <Save className="w-4 h-4" />}
                              Update Category
                            </Button>
                          </div>
                          <p className="text-xs text-yellow-800 mt-2">
                            This will notify the reporter about the change with the law cited.
                          </p>
                        </div>
                      )}

                      {/* Update Urgency Section (if mismatch) */}
                      {!report.aiAnalysis.urgencyMatch && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm font-semibold text-yellow-900 mb-3">
                            Update Urgency to Match AI Assessment
                          </p>
                          <div className="flex items-center gap-3">
                            <select
                              value={selectedUrgency}
                              onChange={(e) => setSelectedUrgency(e.target.value)}
                              className="flex-1 px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none text-sm md:text-base"
                              disabled={updatingUrgency}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                            <Button
                              onClick={handleUpdateUrgency}
                              disabled={selectedUrgency === report.urgency || updatingUrgency}
                              isLoading={updatingUrgency}
                              variant="secondary"
                              className="flex items-center gap-2"
                            >
                              {!updatingUrgency && <Save className="w-4 h-4" />}
                              Update Urgency
                            </Button>
                          </div>
                          <p className="text-xs text-yellow-800 mt-2">
                            This will notify the reporter about the change with the law cited.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-[#e6f4f8]/80 border border-[#0da2cb]/30 rounded-lg p-4 overflow-x-auto space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-[#116aae] mb-1 break-words">
                        Law Cited:
                      </p>
                      <p className="text-sm font-bold text-[#224092] break-words">
                        {formatLawDisplayName(report.aiAnalysis.lawCited)}
                      </p>
                    </div>
                    {getLawReference(report.aiAnalysis.lawCited) && (
                      <div>
                        <p className="text-xs text-gray-600 italic break-words">
                          {getLawReference(report.aiAnalysis.lawCited)?.readMoreInfo}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-[#116aae] mb-1 break-words">
                        Explanation:
                      </p>
                      <p className="text-sm text-[#224092] leading-relaxed break-words">
                        {report.aiAnalysis.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Run AI compliance check to verify urgency against Philippine Corporate Laws
                  </p>
                  <Button
                    onClick={handleRunAiCheck}
                    disabled={runningAiCheck}
                    isLoading={runningAiCheck}
                    className="flex items-center gap-2 mx-auto"
                  >
                    {!runningAiCheck && <Bot className="w-5 h-5" />}
                    Run AI Compliance Check
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Right Side - Messages */}
          <div className="flex flex-col min-w-0">
            <Card variant="elevated" className="p-4 md:p-6 flex flex-col h-full overflow-x-hidden">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Messages</h2>

              <div className="flex-1 space-y-4 mb-6 overflow-y-auto pr-2">
                {report.messages && report.messages.length > 0 ? (
                  report.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-3 md:p-4 overflow-x-auto ${
                          message.sender === "admin"
                            ? "bg-gradient-to-r from-[#116aae] to-[#0da2cb] text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-xs font-bold ${
                            message.sender === "admin" ? "text-white/90" : "text-gray-600"
                          }`}>
                            {message.sender === "admin" ? "You (Admin)" : "Reporter"}
                          </span>
                          <span className={`text-xs ${
                            message.sender === "admin" ? "text-white/70" : "text-gray-500"
                          }`}>
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className={`text-sm whitespace-pre-wrap leading-relaxed break-words ${
                          message.sender === "admin" ? "text-white" : "text-gray-900"
                        }`}>
                          {message.text}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No messages yet.</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-3 mt-auto items-stretch">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-4 py-3 md:py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none text-base min-w-0"
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
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Send</span>
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Image Zoom Modal */}
      {evidenceImages.length > 0 && (
        <ImageZoomModal
          isOpen={imageZoomOpen}
          onClose={() => setImageZoomOpen(false)}
          images={evidenceImages}
          initialIndex={selectedImageIndex}
        />
      )}
    </div>
  );
}
