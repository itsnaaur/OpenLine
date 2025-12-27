// Type definitions for OpenLine

export type ReportCategory = "Safety" | "Harassment" | "Facility Issue" | "Suggestion";
export type UrgencyLevel = "Low" | "Medium" | "High";
export type ReportStatus = "New" | "In Progress" | "Resolved";

export interface Message {
  sender: "reporter" | "admin";
  text: string;
  timestamp: number; // Unix timestamp
}

export interface Report {
  id?: string; // Firestore document ID (optional, added when fetched)
  accessCode: string; // 6-character alphanumeric code (e.g., "8X2-99B")
  subject?: string; // Optional subject line
  category: ReportCategory;
  urgency: UrgencyLevel;
  description: string;
  status: ReportStatus;
  evidenceUrl?: string; // Firebase Storage URL
  createdAt: number; // Unix timestamp
  lastUpdated: number; // Unix timestamp
  messages: Message[]; // Chat history array
  aiAnalysis?: {
    categoryAssessment: ReportCategory;
    categoryMatch: boolean;
    aiAssessment: UrgencyLevel;
    urgencyMatch: boolean;
    match: boolean; // Overall match (both category and urgency match)
    lawCited: string;
    reason: string;
  };
}

