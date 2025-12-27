import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function checkCompliance(
  description: string,
  category: string,
  userUrgency: string
) {
  // We'll try multiple model names in the loop below
  // This handles cases where different model names work for different API versions

  const prompt = `
    Role: Corporate Compliance Officer (Philippines).
    Task: Validate both the Category and Urgency of the report against Philippine Laws.

    Report Description: "${description}"
    User Claimed Category: ${category}
    User Claimed Urgency: ${userUrgency}

    Available Categories:
    - "Safety": Physical hazards, workplace safety issues, dangerous conditions
    - "Harassment": Sexual harassment, discrimination, abuse, bullying
    - "Facility Issue": Broken equipment, maintenance problems, non-dangerous facility problems
    - "Suggestion": Improvement ideas, recommendations, non-urgent feedback

    Reference Laws:
    1. RA 11058 (OSH Law): Applies to "Safety" category. High Urgency if "Imminent Danger" exists (exposed chemicals, unstable structures, electrical hazards, fire risks).
    2. RA 11313 (Safe Spaces Act): Applies to "Harassment" category. High Urgency for sexual harassment/abuse, gender-based violence, workplace discrimination.
    3. RA 11232 (Corp Code): Applies to fraud/financial crimes. High Urgency for fraud, financial crime, bribery, theft, falsifying records.

    Analyze the description and determine:
    1. The CORRECT category based on the content (Safety, Harassment, Facility Issue, or Suggestion)
    2. The CORRECT urgency level based on Philippine Laws (Low, Medium, or High)

    Rules:
    - If it poses immediate danger to life/health → Category: "Safety", Urgency: "High"
    - If it involves harassment/discrimination → Category: "Harassment", Urgency: "High"
    - If it's broken equipment (non-dangerous) → Category: "Facility Issue", Urgency: "Low" or "Medium"
    - If it's a suggestion/improvement → Category: "Suggestion", Urgency: "Low"

    Output ONLY valid JSON (no markdown, no code blocks):
    {
      "categoryAssessment": "Safety" | "Harassment" | "Facility Issue" | "Suggestion",
      "categoryMatch": boolean,
      "aiAssessment": "Low" | "Medium" | "High",
      "urgencyMatch": boolean,
      "lawCited": "string (e.g., RA 11058, RA 11313, RA 11232, or 'None')",
      "reason": "Short explanation (1-2 sentences) covering both category and urgency validation."
    }
  `;

  // Try multiple model names if the first one fails
  // gemini-2.5-flash is the correct model for free tier according to documentation
  const modelNames = [
    "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro", 
    "gemini-pro"
  ];

  for (const modelName of modelNames) {
    try {
      const testModel = genAI.getGenerativeModel({ model: modelName });
      const result = await testModel.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, "").trim();
      
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          categoryAssessment: parsed.categoryAssessment || category,
          categoryMatch: parsed.categoryMatch !== undefined ? parsed.categoryMatch : parsed.categoryAssessment === category,
          aiAssessment: parsed.aiAssessment || userUrgency,
          urgencyMatch: parsed.urgencyMatch !== undefined ? parsed.urgencyMatch : parsed.aiAssessment === userUrgency,
          match: (parsed.categoryMatch !== undefined ? parsed.categoryMatch : parsed.categoryAssessment === category) && 
                 (parsed.urgencyMatch !== undefined ? parsed.urgencyMatch : parsed.aiAssessment === userUrgency),
          lawCited: parsed.lawCited || "None",
          reason: parsed.reason || "Analysis completed.",
        };
      }
      
      // Fallback if JSON parsing fails
      return {
        categoryAssessment: category,
        categoryMatch: true,
        aiAssessment: userUrgency,
        urgencyMatch: true,
        match: true,
        lawCited: "None",
        reason: "AI analysis unavailable. Using user's assessment.",
      };
    } catch (error: any) {
      // If it's not a 404, it might be a different error - log and continue
      if (error?.status !== 404 && error?.statusText !== "Not Found") {
        console.error(`AI Compliance Check Error with ${modelName}:`, error);
      }
      // Try next model
      continue;
    }
  }

  // If all models failed
  console.error("AI Compliance Check Error: All model names failed");
  return null;
}

