"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { generateAccessCode } from "@/lib/utils";
import { Report, ReportCategory, UrgencyLevel } from "@/types";
import { Upload, CheckCircle2, Copy, Lock, Shield, ArrowRight, Heart, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Button from "../components/Button";

export default function SubmitReportPage() {
  const [formData, setFormData] = useState({
    category: "" as ReportCategory | "",
    urgency: "" as UrgencyLevel | "",
    description: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const MAX_FILES = 3;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const validateAndAddFiles = (newFiles: File[]) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    
    // Check total file limit
    if (files.length + newFiles.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed. Please remove some files first.`);
      return false;
    }
    
    // Validate all files
    for (const file of newFiles) {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid file type. Please upload JPEG, PNG, or PDF files.`);
        return false;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large. File size must be less than 5MB.`);
        return false;
      }
    }
    
    // Add new files to existing ones
    setFiles(prev => [...prev, ...newFiles]);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      validateAndAddFiles(selectedFiles);
      
      // Reset the input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDropAreaClick = () => {
    document.getElementById('evidence')?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-[#0da2cb]', 'bg-[#e6f4f8]/50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-[#0da2cb]', 'bg-[#e6f4f8]/50');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-[#0da2cb]', 'bg-[#e6f4f8]/50');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      validateAndAddFiles(droppedFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.urgency || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let evidenceUrl: string | string[] | undefined;

      if (files.length > 0) {
        toast.loading(`Uploading ${files.length} file(s)...`, { id: "upload" });
        
        try {
          const uploadPromises = files.map(async (file, index) => {
            const fileName = `evidence/${Date.now()}_${index}_${file.name}`;
            const storageRef = ref(storage, fileName);
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
          });
          
          const uploadedUrls = await Promise.all(uploadPromises);
          evidenceUrl = uploadedUrls.length === 1 ? uploadedUrls[0] : uploadedUrls;
          toast.success(`${files.length} file(s) uploaded successfully!`, { id: "upload" });
        } catch (uploadError) {
          console.error("Error uploading files:", uploadError);
          toast.error("Failed to upload files. Please try again.", { id: "upload" });
          setIsSubmitting(false);
          return;
        }
      }

      const code = generateAccessCode();
      const now = Date.now();
      const reportData: Omit<Report, "id"> = {
        accessCode: code,
        category: formData.category as ReportCategory,
        urgency: formData.urgency as UrgencyLevel,
        description: formData.description.trim(),
        status: "New",
        ...(evidenceUrl && { evidenceUrl }),
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

      toast.loading("Submitting report...", { id: "submit" });
      await addDoc(collection(db, "reports"), reportData);
      toast.success("Report submitted successfully!", { id: "submit" });

      setAccessCode(code);
      setFormData({ category: "", urgency: "", description: "" });
      setFiles([]);
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
              
              <Link href="/">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Large animated gradient circles for subtle background */}
            <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-gradient-to-br from-[#0dc7e4]/15 via-[#116aae]/10 to-[#0da2cb]/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-gradient-to-br from-[#116aae]/12 via-[#0da2cb]/10 to-[#0dc7e4]/12 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
            
            {/* Encouraging words with fade in/out animation */}
            <div className="absolute top-1/5 left-1/6 text-[#116aae] font-bold text-lg md:text-xl opacity-0" style={{ animation: 'fadeInOut 8s ease-in-out infinite', animationDelay: '0s' }}>
              You're Brave
            </div>
            <div className="absolute top-1/4 right-1/5 text-[#0dc7e4] font-semibold text-base md:text-lg opacity-0" style={{ animation: 'fadeInOut 7s ease-in-out infinite', animationDelay: '1s' }}>
              Your Voice Matters
            </div>
            <div className="absolute top-1/3 left-1/4 text-[#0da2cb] font-bold text-lg md:text-xl opacity-0" style={{ animation: 'fadeInOut 9s ease-in-out infinite', animationDelay: '2s' }}>
              Stay Safe
            </div>
            <div className="absolute top-2/5 right-1/6 text-[#116aae] font-semibold text-base md:text-lg opacity-0" style={{ animation: 'fadeInOut 8s ease-in-out infinite', animationDelay: '3s' }}>
              Thank You
            </div>
            <div className="absolute top-1/2 left-1/5 text-[#0dc7e4] font-bold text-lg md:text-xl opacity-0" style={{ animation: 'fadeInOut 7.5s ease-in-out infinite', animationDelay: '4s' }}>
              Courage
            </div>
            <div className="absolute top-3/5 right-1/4 text-[#0da2cb] font-semibold text-base md:text-lg opacity-0" style={{ animation: 'fadeInOut 8.5s ease-in-out infinite', animationDelay: '5s' }}>
              You're Protected
            </div>
            <div className="absolute bottom-2/5 left-1/6 text-[#116aae] font-bold text-lg md:text-xl opacity-0" style={{ animation: 'fadeInOut 7s ease-in-out infinite', animationDelay: '6s' }}>
              Support
            </div>
            <div className="absolute bottom-1/3 right-1/5 text-[#0dc7e4] font-semibold text-base md:text-lg opacity-0" style={{ animation: 'fadeInOut 9s ease-in-out infinite', animationDelay: '7s' }}>
              Anonymous
            </div>
            <div className="absolute bottom-1/4 left-1/4 text-[#0da2cb] font-bold text-lg md:text-xl opacity-0" style={{ animation: 'fadeInOut 8s ease-in-out infinite', animationDelay: '8s' }}>
              You Matter
            </div>
            <div className="absolute bottom-1/5 right-1/6 text-[#116aae] font-semibold text-base md:text-lg opacity-0" style={{ animation: 'fadeInOut 7.5s ease-in-out infinite', animationDelay: '9s' }}>
              Secure
            </div>
            <div className="absolute top-2/3 left-1/3 text-[#0dc7e4] font-bold text-lg md:text-xl opacity-0" style={{ animation: 'fadeInOut 8.5s ease-in-out infinite', animationDelay: '10s' }}>
              Help is Here
            </div>
            <div className="absolute top-3/4 right-1/3 text-[#0da2cb] font-semibold text-base md:text-lg opacity-0" style={{ animation: 'fadeInOut 7s ease-in-out infinite', animationDelay: '11s' }}>
              We Care
            </div>
          </div>

          <Card variant="elevated" className="w-full max-w-md p-5 md:p-6 text-center relative z-10">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#0d87bc] to-[#0dc7e4] rounded-xl flex items-center justify-center mb-3 shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2">
              Report Submitted Successfully!
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              Thank you for your courage. Your report has been received.
            </p>

            {/* Access Code Card */}
            <Card variant="outlined" className="p-4 mb-4 bg-gradient-to-br from-[#e6f4f8] to-[#d9eaf5] border-[#0da2cb]/50">
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Your Access Code</p>
              <p className="text-2xl md:text-3xl font-mono font-bold bg-gradient-to-r from-[#116aae] to-[#0da2cb] bg-clip-text text-transparent mb-3 tracking-wider">
                {accessCode}
              </p>
              <Button onClick={copyToClipboard} size="md" className="w-full">
                <Copy className="w-4 h-4 mr-2" />
                Copy Access Code
              </Button>
            </Card>

            {/* Action Buttons with more spacing */}
            <div className="mb-4">
              <Link href={`/track/${accessCode}`}>
                <Button size="md" className="w-full mb-4">
                  Track Your Report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setAccessCode(null);
                  setFormData({ category: "", urgency: "", description: "" });
                  setFiles([]);
                }}
                className="w-full"
              >
                Submit Another Report
              </Button>
            </div>

            {/* Important Note - more compact */}
            <div className="p-3 bg-[#e6f4f8]/80 rounded-lg border border-[#0da2cb]/30">
              <p className="text-xs text-[#224092] leading-relaxed">
                <strong className="text-[#116aae]">Important:</strong> Save this access code to track your report.
              </p>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Form View
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
      <div className="flex-1 py-8 md:py-12 px-4 md:px-6 relative">
        <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#0dc7e4]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#116aae]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0dc7e4]/15 backdrop-blur-sm rounded-full text-[#116aae] text-sm font-semibold mb-6 border border-[#0da2cb]/30">
              <Shield className="w-4 h-4" />
              <span>100% Anonymous & Secure</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Submit Your Report
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-2 max-w-2xl mx-auto">
              Your voice matters. Report concerns safely and anonymously.
            </p>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              All information is confidential. Your identity will never be revealed.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card variant="elevated" className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none transition-all bg-white hover:border-gray-300 text-base"
                    >
                      <option value="">Select a category</option>
                      <option value="Workplace Safety & Health">Workplace Safety & Health</option>
                      <option value="Sexual Harassment & Gender-Based Violence">Sexual Harassment & Gender-Based Violence</option>
                      <option value="Bullying & Discrimination">Bullying & Discrimination</option>
                      <option value="Data Privacy Violation">Data Privacy Violation</option>
                      <option value="Financial Misconduct">Financial Misconduct</option>
                      <option value="Facility & Equipment Issue">Facility & Equipment Issue</option>
                      <option value="General Suggestion/Feedback">General Suggestion/Feedback</option>
                    </select>
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Urgency Level <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["Low", "Medium", "High"] as UrgencyLevel[]).map((level) => (
                        <label
                          key={level}
                          className={`flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all font-semibold text-sm ${
                            formData.urgency === level
                              ? "border-[#116aae] bg-gradient-to-br from-[#e6f4f8] to-[#d9eaf5] text-[#116aae] shadow-md scale-105"
                              : "border-gray-200 hover:border-[#0da2cb] hover:bg-gray-50 text-gray-700"
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
                          {level}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Provide details about the issue, including location, time, and any relevant information. Be as specific as possible to help us address your concern effectively."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none resize-none transition-all bg-white hover:border-gray-300 text-base"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label htmlFor="evidence" className="block text-sm font-semibold text-gray-900 mb-2">
                      Evidence <span className="text-gray-500 font-normal text-sm">(Optional, max {MAX_FILES} files)</span>
                    </label>
                    <div 
                      className="flex justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#0da2cb] hover:bg-[#e6f4f8]/30 transition-all cursor-pointer group"
                      onClick={handleDropAreaClick}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="space-y-2 text-center w-full">
                        <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-[#116aae] transition-colors" />
                        <div className="flex text-sm text-gray-600 justify-center items-center">
                          <label
                            htmlFor="evidence"
                            className="relative cursor-pointer rounded-md font-semibold text-[#116aae] hover:text-[#0da2cb]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Upload a file</span>
                            <input
                              id="evidence"
                              name="evidence"
                              type="file"
                              accept="image/jpeg,image/png,image/jpg,application/pdf"
                              onChange={handleFileChange}
                              multiple
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB each (Max {MAX_FILES} files)</p>
                        {files.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 px-3" onClick={(e) => e.stopPropagation()}>
                                <p className="text-sm text-[#116aae] font-medium truncate flex-1">
                                  {file.name}
                                </p>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700 text-sm font-semibold"
                                  aria-label={`Remove ${file.name}`}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {files.length >= MAX_FILES && (
                              <p className="text-xs text-amber-600 font-medium">Maximum {MAX_FILES} files reached</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    size="lg"
                    className="w-full"
                  >
                    {!isSubmitting && (
                      <>
                        Submit Report
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Sidebar - Encouragement */}
            <div className="lg:col-span-1">
              <Card variant="elevated" className="p-6 bg-gradient-to-br from-[#116aae] to-[#0da2cb] text-white sticky top-24">
                <Heart className="w-12 h-12 mb-4 opacity-90" />
                <h3 className="text-xl font-bold mb-4">You&apos;re Doing the Right Thing</h3>
                <ul className="space-y-3 text-sm opacity-95">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Your report is completely anonymous</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>You&apos;re helping protect others</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Your safety and privacy are guaranteed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Every report makes a difference</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center gap-2 text-xs opacity-90">
                    <Lock className="w-4 h-4" />
                    <span>End-to-end encrypted and secure</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
