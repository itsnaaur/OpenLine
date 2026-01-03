"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "./Modal";
import Button from "./Button";

interface TrackReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrackReportModal({ isOpen, onClose }: TrackReportModalProps) {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanedCode = accessCode.trim().toUpperCase().replace(/\s/g, "");
    
    if (!cleanedCode) {
      toast.error("Please enter an access code");
      return;
    }

    if (!/^[A-Z0-9]{3}-[A-Z0-9]{2}-[A-Z0-9]{1}$/.test(cleanedCode)) {
      toast.error("Invalid access code format. Format should be: XXX-XX-X");
      return;
    }

    setIsLoading(true);
    router.push(`/track/${cleanedCode}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Track Your Report" size="md">
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#0d87bc] to-[#0dc7e4] rounded-xl mb-4 mx-auto shadow-lg">
            <Search className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">
            Enter your access code to view updates and communicate with administrators.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="accessCode" className="block text-sm font-semibold text-gray-700 mb-2">
              Access Code
            </label>
            <input
              id="accessCode"
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="XXX-XX-X"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#116aae] focus:border-[#116aae] outline-none text-center text-xl font-mono tracking-wider uppercase bg-gray-50 hover:border-gray-300 transition-all"
              maxLength={8}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Format: XXX-XX-X (e.g., 8X2-99B)
            </p>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            {!isLoading && (
              <>
                Track Report
                <Search className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-[#e6f4f8]/80 rounded-lg border border-[#0da2cb]/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#116aae] mt-0.5 flex-shrink-0" />
            <div className="text-sm text-[#224092]">
              <p className="font-semibold mb-1">Don&apos;t have an access code?</p>
              <p className="text-[#116aae] leading-relaxed">
                You received this code when you submitted your report. Check your records or submit a new report.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

