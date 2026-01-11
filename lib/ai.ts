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
    - "Workplace Safety & Health": Physical hazards, workplace safety issues, dangerous conditions, imminent danger situations
    - "Sexual Harassment & Gender-Based Violence": Sexual harassment, catcalling, unwanted sexual remarks, gender-based violence, online harassment
    - "Bullying & Discrimination": Bullying in schools/workplaces, discrimination, peer conflicts that meet bullying criteria
    - "Data Privacy Violation": Unauthorized collection/sharing of personal information, privacy breaches, data misuse
    - "Financial Misconduct": Fraud, financial crimes, bribery, theft, falsifying records, embezzlement
    - "Facility & Equipment Issue": Broken equipment, maintenance problems, non-dangerous facility problems
    - "General Suggestion/Feedback": Improvement ideas, recommendations, non-urgent feedback

    Reference Laws (Philippines):
    1. RA 11058 (Occupational Safety and Health Standards Law - OSH Law): Applies to "Workplace Safety & Health" category. High Urgency if "Imminent Danger" exists (exposed chemicals, unstable structures, electrical hazards, fire risks, hazardous work conditions per Department Order No. 252, 2025 OSH guidelines). Supports "Right to Refuse Unsafe Work".
    2. RA 11313 (Safe Spaces Act): Applies to "Sexual Harassment & Gender-Based Violence" category. High Urgency for gender-based sexual harassment in streets, public spaces, online, workplaces, and educational institutions. Keywords: "catcalling," "unwanted sexual remarks," "online harassment".
    3. RA 10627 (Anti-Bullying Act of 2013): Applies to "Bullying & Discrimination" category (especially for school portal version). High Urgency for acts of bullying in elementary and secondary schools as defined by this law. Distinguish between common peer conflicts and actual "Bullying" as legally defined. Aligns with 2025 DepEd mandate for stricter reporting.
    4. RA 10173 (Data Privacy Act of 2012): Applies to "Data Privacy Violation" category. High Urgency for unauthorized collection, processing, or sharing of Personally Identifiable Information (PII). Protects individual personal information in information and communications systems. This law mandates the "No-Login" architecture to protect whistleblowers.
    5. RA 11232 (Revised Corporation Code): Applies to "Financial Misconduct" category. High Urgency for fraud, financial crime, bribery, theft, falsifying records, corporate misconduct.

    Analyze the description and determine:
    1. The CORRECT category based on the content (choose from the 7 categories above)
    2. The CORRECT urgency level based on Philippine Laws (Low, Medium, or High)

    Rules:
    - If it poses immediate danger to life/health → Category: "Workplace Safety & Health", Urgency: "High"
    - If it involves sexual harassment, catcalling, unwanted sexual remarks, gender-based violence → Category: "Sexual Harassment & Gender-Based Violence", Urgency: "High"
    - If it involves bullying (as legally defined) or discrimination → Category: "Bullying & Discrimination", Urgency: "High"
    - If it involves unauthorized data collection/privacy breach → Category: "Data Privacy Violation", Urgency: "High"
    - If it involves financial crimes, fraud, bribery → Category: "Financial Misconduct", Urgency: "High"
    - If it's broken equipment (non-dangerous) → Category: "Facility & Equipment Issue", Urgency: "Low" or "Medium"
    - If it's a suggestion/improvement → Category: "General Suggestion/Feedback", Urgency: "Low"

    Output ONLY valid JSON (no markdown, no code blocks):
    {
      "categoryAssessment": "Workplace Safety & Health" | "Sexual Harassment & Gender-Based Violence" | "Bullying & Discrimination" | "Data Privacy Violation" | "Financial Misconduct" | "Facility & Equipment Issue" | "General Suggestion/Feedback",
      "categoryMatch": boolean,
      "aiAssessment": "Low" | "Medium" | "High",
      "urgencyMatch": boolean,
      "lawCited": "string (e.g., RA 11058, RA 11313, RA 10627, RA 10173, RA 11232, or 'None')",
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

