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
    Task: Compare the User's claimed Urgency vs. Actual Risk based on Philippine Laws.

    Report:
    - "${description}" (Category: ${category})
    - User Claimed: ${userUrgency}

    Reference Laws:
    1. RA 11058 (OSH Law): High Urgency if "Imminent Danger" to safety exists (e.g., exposed chemicals, unstable structures, electrical hazards, fire risks).
    2. RA 11313 (Safe Spaces Act): High Urgency for sexual harassment/abuse, gender-based violence, or workplace discrimination.
    3. RA 11232 (Corp Code): High Urgency for fraud, financial crime, bribery, theft, or falsifying records.

    Analyze the description and determine the actual urgency level based on these laws.
    If the situation poses immediate danger to life or health, it MUST be High.
    If it involves legal violations (harassment, fraud), it MUST be High.
    If it's a minor facility issue or suggestion, it should be Low or Medium.

    Output ONLY valid JSON (no markdown, no code blocks):
    {
      "aiAssessment": "Low" | "Medium" | "High",
      "match": boolean,
      "lawCited": "string (e.g., RA 11058, RA 11313, RA 11232, or 'None')",
      "reason": "Short explanation (1-2 sentences)."
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
          aiAssessment: parsed.aiAssessment || userUrgency,
          match: parsed.match !== undefined ? parsed.match : parsed.aiAssessment === userUrgency,
          lawCited: parsed.lawCited || "None",
          reason: parsed.reason || "Analysis completed.",
        };
      }
      
      // Fallback if JSON parsing fails
      return {
        aiAssessment: userUrgency,
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

