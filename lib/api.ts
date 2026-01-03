/**
 * API client for Cloud Functions
 * This provides secure server-side access code validation
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_FUNCTIONS_URL || 
  process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 
  'https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api';

/**
 * Get report by access code (secure endpoint)
 */
export async function getReportByAccessCode(accessCode: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/report/${encodeURIComponent(accessCode)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.message || 'Failed to fetch report');
    }

    const data = await response.json();
    return data.report;
  } catch (error: any) {
    console.error('Error fetching report:', error);
    throw error;
  }
}

/**
 * Get signed URL for evidence file
 */
export async function getEvidenceUrl(reportId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/evidence/${encodeURIComponent(reportId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.message || 'Failed to fetch evidence');
    }

    const data = await response.json();
    return data.url;
  } catch (error: any) {
    console.error('Error fetching evidence:', error);
    throw error;
  }
}

