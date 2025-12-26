"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { generateAccessCode } from "@/lib/utils";
import { Report, ReportCategory, UrgencyLevel } from "@/types";
import { Upload, CheckCircle2, Copy, Loader2, Lock, Shield, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SubmitReportPage() {
  const [formData, setFormData] = useState({
    category: "" as ReportCategory | "",
    urgency: "" as UrgencyLevel | "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Please upload an image (JPEG, PNG) or PDF file");
        return;
      }
      
      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.category || !formData.urgency || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let evidenceUrl: string | undefined;

      // Step 1: Upload image if provided
      if (file) {
        toast.loading("Uploading evidence...", { id: "upload" });
        const fileName = `evidence/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, file);
        evidenceUrl = await getDownloadURL(storageRef);
        toast.success("Evidence uploaded!", { id: "upload" });
      }

      // Step 2: Generate Access Code
      const code = generateAccessCode();

      // Step 3: Create report object
      const now = Date.now();
      const reportData: Omit<Report, "id"> = {
        accessCode: code,
        category: formData.category as ReportCategory,
        urgency: formData.urgency as UrgencyLevel,
        description: formData.description.trim(),
        status: "New",
        ...(evidenceUrl && { evidenceUrl }), // Only include if evidenceUrl exists
        createdAt: now,
        lastUpdated: now,
        messages: [
          {
            sender: "reporter",
            text: formData.description.trim(),
            timestamp: now,
          },
        ],
      };

      // Step 4: Save to Firestore
      toast.loading("Submitting report...", { id: "submit" });
      await addDoc(collection(db, "reports"), reportData);
      toast.success("Report submitted successfully!", { id: "submit" });

      // Step 5: Show success with access code
      setAccessCode(code);
      
      // Reset form
      setFormData({ category: "", urgency: "", description: "" });
      setFile(null);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode);
      toast.success("Access code copied to clipboard!");
    }
  };

  // Success View
  if (accessCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 md:p-6 relative">
        {/* Background decorative elements - Hidden on mobile */}
        <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-green-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl"></div>
        </div>

        {/* Discrete Admin Login - Bottom Right Corner */}
        <Link
          href="/admin/login"
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 md:bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl border border-gray-200/50 transition-all hover:scale-110 group z-50"
          title="Admin Login"
          aria-label="Admin Login"
        >
          <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-500/70 group-hover:text-indigo-600 transition-colors" />
        </Link>

        <div className="w-full max-w-lg mx-auto bg-white md:bg-white/80 md:backdrop-blur-md rounded-lg md:rounded-2xl lg:rounded-3xl shadow-lg md:shadow-2xl p-5 md:p-6 lg:p-8 xl:p-10 text-center relative z-10 border-0 md:border border-gray-200/50 animate-fade-in px-2 md:px-0">
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Report Submitted!
            </h1>
            <p className="text-gray-600 text-lg">
              Your report has been submitted anonymously. Save this access code to track your report.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200/50 rounded-2xl p-8 mb-8 shadow-inner">
            <p className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">Your Access Code</p>
            <p className="text-5xl font-mono font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-6 tracking-wider">
              {accessCode}
            </p>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Copy className="w-5 h-5" />
              Copy Code
            </button>
          </div>

          <div className="space-y-3">
            <a
              href={`/track/${accessCode}`}
              className="block w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Track Your Report
            </a>
            <button
              onClick={() => {
                setAccessCode(null);
                setFormData({ category: "", urgency: "", description: "" });
                setFile(null);
              }}
              className="block w-full px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all font-medium"
            >
              Submit Another Report
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-200/50">
            <p className="text-xs text-gray-600">
              <strong className="text-gray-700">Important:</strong> Keep this code safe. You&apos;ll need it to view updates and replies from administrators.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Form View
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 md:py-8 lg:py-12 px-2 md:px-4 relative">
      {/* Background decorative elements - Hidden on mobile */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Discrete Admin Login - Bottom Right Corner */}
      <Link
        href="/admin/login"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 md:bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl border border-gray-200/50 transition-all hover:scale-110 group z-50"
        title="Admin Login"
        aria-label="Admin Login"
      >
        <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-500/70 group-hover:text-indigo-600 transition-colors" />
      </Link>

      <div className="w-full max-w-2xl mx-auto relative z-10 px-2 md:px-0">
        <div className="bg-white md:bg-white/80 md:backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg md:shadow-2xl p-4 md:p-5 lg:p-6 xl:p-7 border-0 md:border border-gray-200/50">
          {/* Back to Home Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 mb-4 text-xs md:text-sm transition-colors"
          >
            <Home className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="mb-6 md:mb-7">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 bg-indigo-100/80 backdrop-blur-sm rounded-full text-indigo-700 text-xs font-medium mb-3 md:mb-4 border border-indigo-200/50">
              <Shield className="w-3 h-3" />
              <span>100% Anonymous</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2 md:mb-3 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Submit Anonymous Report
            </h1>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              Report safety hazards, misconduct, facility issues, or suggestions. Your identity will remain completely anonymous.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 md:px-4 md:py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white hover:border-gray-300 text-sm"
              >
                <option value="">Select a category</option>
                <option value="Safety">Safety</option>
                <option value="Harassment">Harassment</option>
                <option value="Facility Issue">Facility Issue</option>
                <option value="Suggestion">Suggestion</option>
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">
                Urgency Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {(["Low", "Medium", "High"] as UrgencyLevel[]).map((level) => (
                  <label
                    key={level}
                    className={`flex items-center justify-center p-2.5 md:p-3 border-2 rounded-lg cursor-pointer transition-all font-medium text-xs md:text-sm ${
                      formData.urgency === level
                        ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700 shadow-md scale-105"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={level}
                      checked={formData.urgency === level}
                      onChange={handleInputChange}
                      className="sr-only"
                      required
                    />
                    <span className="font-medium">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Provide details about the issue, including location, time, and any relevant information..."
                className="w-full px-3 py-2 md:px-4 md:py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all bg-white hover:border-gray-300 text-sm"
              />
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="evidence" className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">
                Evidence <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="flex justify-center px-4 pt-4 pb-4 md:px-5 md:pt-5 md:pb-5 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-8 w-8 md:h-10 md:w-10 text-gray-400" />
                  <div className="flex text-xs md:text-sm text-gray-600">
                    <label
                      htmlFor="evidence"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="evidence"
                        name="evidence"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 5MB
                  </p>
                  {file && (
                    <p className="text-sm text-indigo-600 font-medium mt-2">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2.5 md:py-3 px-4 md:px-5 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Report
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

