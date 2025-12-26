"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Report, ReportStatus, Message } from "@/types";
import { ArrowLeft, Send, Loader2, Image as ImageIcon, Save } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

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

        // Set up real-time listener
        const unsubscribe = onSnapshot(reportRef, (snapshot) => {
          if (snapshot.exists()) {
            const updatedData = {
              id: snapshot.id,
              ...snapshot.data(),
            } as Report;
            setReport(updatedData);
            setSelectedStatus(updatedData.status);
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
        return "bg-blue-100 text-blue-800";
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
          <p className="text-gray-600 mb-6">The report you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Details</h1>
                <p className="text-sm text-gray-500">
                  Access Code: <span className="font-mono font-semibold">{report.accessCode}</span>
                </p>
              </div>
              <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(report.status)}`}>
                {report.status}
              </div>
            </div>

            {/* Status Update Section */}
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <div className="flex items-center gap-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ReportStatus)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  disabled={updatingStatus}
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={selectedStatus === report.status || updatingStatus}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Update
                </button>
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

            {report.evidenceUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Evidence</p>
                {report.evidenceUrl.endsWith('.pdf') ? (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <a
                      href={report.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                    >
                      <ImageIcon className="w-5 h-5" />
                      <span>View PDF Evidence</span>
                    </a>
                  </div>
                ) : (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={report.evidenceUrl}
                      alt="Evidence"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {report.messages && report.messages.length > 0 ? (
              report.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.sender === "admin"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold ${
                        message.sender === "admin" ? "text-indigo-100" : "text-gray-600"
                      }`}>
                        {message.sender === "admin" ? "You (Admin)" : "Reporter"}
                      </span>
                      <span className={`text-xs ${
                        message.sender === "admin" ? "text-indigo-100" : "text-gray-500"
                      }`}>
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm whitespace-pre-wrap ${
                      message.sender === "admin" ? "text-white" : "text-gray-900"
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
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

