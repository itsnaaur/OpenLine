"use server";

import { checkCompliance } from "@/lib/ai";

export async function runAiCheck(
  description: string,
  category: string,
  urgency: string
) {
  try {
    const result = await checkCompliance(description, category, urgency);
    return result;
  } catch (error) {
    console.error("Error running AI check:", error);
    return null;
  }
}

