"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { generateAccessCode } from "@/lib/utils";
import { Report, ReportCategory, UrgencyLevel } from "@/types";
import { Upload, CheckCircle2, Copy, Loader2 } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Report Submitted!
            </h1>
            <p className="text-gray-600">
              Your report has been submitted anonymously. Save this access code to track your report.
            </p>
          </div>

          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Access Code</p>
            <p className="text-4xl font-mono font-bold text-indigo-700 mb-4">
              {accessCode}
            </p>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Code
            </button>
          </div>

          <div className="space-y-3">
            <a
              href={`/track/${accessCode}`}
              className="block w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Track Your Report
            </a>
            <button
              onClick={() => {
                setAccessCode(null);
                setFormData({ category: "", urgency: "", description: "" });
                setFile(null);
              }}
              className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Submit Another Report
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Keep this code safe. You&apos;ll need it to view updates and replies.
          </p>
        </div>
      </div>
    );
  }

  // Form View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Submit Anonymous Report
            </h1>
            <p className="text-gray-600">
              Report safety hazards, misconduct, facility issues, or suggestions. Your identity will remain completely anonymous.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(["Low", "Medium", "High"] as UrgencyLevel[]).map((level) => (
                  <label
                    key={level}
                    className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.urgency === level
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 hover:border-gray-300"
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="Provide details about the issue, including location, time, and any relevant information..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-2">
                Evidence (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
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
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

