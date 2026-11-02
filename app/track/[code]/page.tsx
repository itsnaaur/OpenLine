"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { setTrackCode } from "@/lib/trackSession";

// Old links put the access code in the URL (/track/XXXX-XXXX-XXXX). Move the
// code into sessionStorage and replace the history entry so it isn't kept.
export default function LegacyTrackRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    setTrackCode(decodeURIComponent((params.code as string) ?? ""));
    router.replace("/track/view");
  }, [params.code, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#e6f4f8] to-[#d9eaf5] flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#116aae]" />
    </div>
  );
}
