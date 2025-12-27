# OpenLine
Anonymous Whistleblowing & Feedback Portal

A secure, anonymous reporting system that allows employees/students to report issues without fear of retaliation.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase

**Important:** You must configure Firebase before running the app.

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database, Storage, and Authentication (Email/Password)
3. Get your Firebase config from Project Settings
4. Create `.env.local` in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini AI (for Phase 6: AI Compliance Verification)
GEMINI_API_KEY=your_gemini_api_key
```

**Getting Your Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" or go to "API Keys" in the sidebar
4. Create a new API key (it's free!)
5. Copy the key and add it to `.env.local` as `GEMINI_API_KEY`

📖 **Detailed Setup:** See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for step-by-step instructions.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Test Firebase Connection
Visit [http://localhost:3000/test-firebase](http://localhost:3000/test-firebase) to verify your Firebase setup.

### 5. Open the App
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Features

- ✅ **Anonymous Reporting** - Submit reports without creating an account
- 🔐 **Access Code System** - Track reports using unique codes
- 📸 **Evidence Upload** - Attach photos/PDFs to reports
- 💬 **Two-Way Communication** - Chat with administrators anonymously
- 📊 **Admin Dashboard** - Manage and respond to reports
- 🤖 **AI Compliance Verification** - AI-powered urgency validation against Philippine Corporate Laws
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS

## 🛠️ Tech Stack

- **Next.js 16** - React framework
- **React 19** - UI library
- **Firebase** - Backend (Firestore, Storage, Auth)
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## 📁 Project Structure

```
OpenLine/
├── app/              # Next.js app directory
│   ├── submit/       # Submit report page
│   ├── track/        # Track report pages
│   └── admin/        # Admin dashboard
├── lib/              # Utilities
│   ├── firebase.ts   # Firebase configuration
│   ├── utils.ts      # Helper functions
│   └── ai.ts         # AI compliance check (Gemini)
├── app/
│   └── actions.ts    # Server actions (AI check)
└── types.ts          # TypeScript definitions
```

## 🔒 Security

- All dependencies are up-to-date and secure
- Environment variables are not committed to git
- Firestore security rules configured (see `SECURITY.md`)
- Admin authentication via Firebase Auth
- Anonymous reporting with access code system

## 📚 Additional Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Detailed Firebase configuration
- [Security Guide](./SECURITY.md) - Security rules and best practices
- [Deployment Guide](./DEPLOYMENT.md) - How to deploy to production
- [Demo Data Guide](./scripts/create-demo-data.md) - Creating sample reports

## 📝 Development Phases

- ✅ **Phase 0:** Foundation & Setup
- ✅ **Phase 1:** Public Report Submission
- ✅ **Phase 2:** Report Tracking System
- ✅ **Phase 3:** Admin Dashboard
- ✅ **Phase 4:** Security & Polish
- ✅ **Phase 6:** AI Compliance Verification (Gemini AI)

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
