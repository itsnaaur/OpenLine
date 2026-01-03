import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

// Initialize Firebase Admin
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

/**
 * Simple rate limiting middleware
 */
function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  const now = Date.now();
  
  const record = rateLimitMap.get(ip);
  
  if (record) {
    if (now > record.resetTime) {
      // Reset window
      record.count = 1;
      record.resetTime = now + RATE_LIMIT_WINDOW;
      next();
    } else if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
      // Rate limit exceeded
      res.status(429).json({
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later.",
      });
      return;
    } else {
      // Increment count
      record.count++;
      next();
    }
  } else {
    // First request from this IP
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    next();
  }
  
  // Clean up old entries (every 5 minutes)
  if (Math.random() < 0.01) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }
}

/**
 * Validate access code format
 */
function isValidAccessCode(code: string): boolean {
  // Format: XXX-XX-X (e.g., "8X2-99B")
  const pattern = /^[A-Z0-9]{3}-[A-Z0-9]{2}-[A-Z0-9]{1}$/;
  return pattern.test(code.toUpperCase());
}

/**
 * Get report by access code (secure endpoint)
 * This replaces direct Firestore queries to prevent enumeration attacks
 */
app.get("/report/:accessCode", rateLimit, async (req, res) => {
  try {
    const accessCode = req.params.accessCode?.toUpperCase().trim();
    
    // Validate access code format
    if (!accessCode || !isValidAccessCode(accessCode)) {
      res.status(400).json({
        error: "Invalid access code format",
        message: "Access code must be in format XXX-XX-X",
      });
      return;
    }
    
    // Query Firestore for report with matching access code
    const reportsRef = admin.firestore().collection("reports");
    const snapshot = await reportsRef
      .where("accessCode", "==", accessCode)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      // Return generic error to prevent enumeration
      res.status(404).json({
        error: "Report not found",
        message: "No report found with the provided access code.",
      });
      return;
    }
    
    // Get the report data
    const doc = snapshot.docs[0];
    const reportData = {
      id: doc.id,
      ...doc.data(),
    };
    
    // Remove sensitive fields if needed (currently none, but good practice)
    // Return the report
    res.json({
      success: true,
      report: reportData,
    });
  } catch (error: any) {
    console.error("Error fetching report:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch report. Please try again later.",
    });
  }
});

/**
 * Get signed URL for evidence file (secure endpoint)
 * This prevents direct public access to evidence files
 */
app.get("/evidence/:reportId", rateLimit, async (req, res) => {
  try {
    const reportId = req.params.reportId;
    
    if (!reportId) {
      res.status(400).json({
        error: "Invalid request",
        message: "Report ID is required",
      });
      return;
    }
    
    // Get report to verify it exists and get evidence URL
    const reportDoc = await admin.firestore().collection("reports").doc(reportId).get();
    
    if (!reportDoc.exists) {
      res.status(404).json({
        error: "Report not found",
        message: "Report does not exist",
      });
      return;
    }
    
    const reportData = reportDoc.data();
    
    if (!reportData?.evidenceUrl) {
      res.status(404).json({
        error: "Evidence not found",
        message: "This report does not have evidence attached",
      });
      return;
    }
    
    // For now, return the URL (in future, could generate signed URL)
    // Since we're restricting Storage reads, we'll need to handle this differently
    // Option: Generate signed URL with expiration
    const bucket = admin.storage().bucket();
    const fileName = reportData.evidenceUrl.split("/o/")[1]?.split("?")[0];
    
    if (fileName) {
      try {
        const file = bucket.file(decodeURIComponent(fileName));
        const [signedUrl] = await file.getSignedUrl({
          action: "read",
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        });
        
        res.json({
          success: true,
          url: signedUrl,
        });
      } catch (storageError: any) {
        console.error("Error generating signed URL:", storageError);
        // Fallback to direct URL if signed URL fails
        res.json({
          success: true,
          url: reportData.evidenceUrl,
        });
      }
    } else {
      // Fallback to direct URL
      res.json({
        success: true,
        url: reportData.evidenceUrl,
      });
    }
  } catch (error: any) {
    console.error("Error fetching evidence:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch evidence. Please try again later.",
    });
  }
});

// Export the Express app as a Cloud Function
export const api = functions.https.onRequest(app);

