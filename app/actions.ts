"use server";

import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { checkCompliance, REPORT_CATEGORIES, URGENCY_LEVELS } from "@/lib/ai";

// Verifying ID tokens only needs the project ID (Google's public keys are
// fetched automatically), so no service account is required here.
function getAdminAuth() {
  const app =
    getApps()[0] ??
    initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });
  return getAuth(app);
}

export async function runAiCheck(
  idToken: string,
  description: string,
  category: string,
  urgency: string
) {
  // Server actions are public HTTP endpoints, so check the caller is an admin
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    if (decoded.admin !== true) return null;
  } catch {
    return null;
  }

  const reportCategory = REPORT_CATEGORIES.find((c) => c === category);
  const urgencyLevel = URGENCY_LEVELS.find((u) => u === urgency);
  if (
    typeof description !== "string" ||
    description.length === 0 ||
    description.length > 5000 ||
    !reportCategory ||
    !urgencyLevel
  ) {
    return null;
  }

  try {
    return await checkCompliance(description, reportCategory, urgencyLevel);
  } catch (error) {
    console.error("Error running AI check:", error);
    return null;
  }
}
