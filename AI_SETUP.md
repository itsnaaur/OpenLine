# AI Compliance Verification Setup

## Overview

Phase 6 adds AI-powered compliance verification using Google Gemini AI. The system analyzes user-submitted reports against Philippine Corporate Laws to validate urgency levels and flag discrepancies.

## Getting Your Gemini API Key

1. **Visit Google AI Studio**
   - Go to [https://aistudio.google.com/](https://aistudio.google.com/)
   - Sign in with your Google account

2. **Create API Key**
   - Click "Get API Key" or navigate to "API Keys" in the sidebar
   - Click "Create API Key"
   - Select "Create API key in new project" or choose an existing project
   - Copy the generated API key

3. **Add to Environment Variables**
   - Open your `.env.local` file
   - Add the following line:
     ```env
     GEMINI_API_KEY=your_api_key_here
     ```
   - Replace `your_api_key_here` with the key you copied

4. **Restart Development Server**
   - Stop your current dev server (Ctrl+C)
   - Run `npm run dev` again

## How It Works

### For Administrators

1. **View a Report**
   - Navigate to Admin Dashboard
   - Click on any report to view details

2. **Run AI Compliance Check**
   - In the report detail view, you'll see the "AI Compliance Verification" card
   - Click the "🤖 Run AI Compliance Check" button
   - The AI will analyze the report description against Philippine laws

3. **Review Results**
   - **Match = True**: User's urgency assessment aligns with AI's analysis
   - **Match = False**: Discrepancy detected (shown with red border and warning)
   - **Law Cited**: Shows which Philippine law is relevant (RA 11058, RA 11313, or RA 11232)
   - **Reason**: AI's explanation for the assessment

### Philippine Laws Referenced

- **RA 11058 (OSH Law)**: Occupational Safety and Health Standards
  - High urgency for imminent danger situations (exposed chemicals, electrical hazards, fire risks)

- **RA 11313 (Safe Spaces Act)**: Gender-Based Sexual Harassment
  - High urgency for harassment, discrimination, or workplace abuse

- **RA 11232 (Corp Code)**: Revised Corporation Code
  - High urgency for fraud, financial crime, bribery, or falsifying records

## Testing the Feature

### Test Case 1: Overstated Urgency
1. Submit a report: "The printer is jammed" with **High Urgency**
2. As admin, view the report and run AI check
3. **Expected**: AI should assess as **Low** or **Medium**, flagging a discrepancy

### Test Case 2: Understated Urgency
1. Submit a report: "Exposed electrical wiring in the cafeteria, sparks visible" with **Low Urgency**
2. As admin, view the report and run AI check
3. **Expected**: AI should assess as **High**, citing RA 11058 (OSH Law)

### Test Case 3: Accurate Assessment
1. Submit a report: "Sexual harassment incident in office" with **High Urgency**
2. As admin, view the report and run AI check
3. **Expected**: AI should assess as **High**, match = true, citing RA 11313

## Troubleshooting

### "AI analysis failed"
- Check that `GEMINI_API_KEY` is set in `.env.local`
- Verify the API key is valid and not expired
- Check browser console for detailed error messages
- Ensure you have internet connection

### API Key Not Working
- Make sure you copied the entire key (no extra spaces)
- Restart the dev server after adding the key
- Check Google AI Studio to ensure the key is active

### Build Errors
- Run `npm install` to ensure `@google/generative-ai` is installed
- Check that all TypeScript types are correct
- Verify `lib/ai.ts` and `app/actions.ts` are in place

## Notes

- The AI analysis is saved to the report document after first run (no need to pay for re-analysis)
- The feature uses Gemini 1.5 Flash model (free tier)
- Analysis is performed server-side for security
- Results are cached in Firestore to avoid redundant API calls

