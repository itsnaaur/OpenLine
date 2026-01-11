# OpenLine - System Architecture Diagram
## Anonymous Whistleblowing & Feedback Portal

This document provides a comprehensive architecture diagram of the OpenLine system using standard architecture diagram symbols and conventions.

---

## Architecture Diagram Symbol Legend

**Standard Architecture Diagram Symbols:**
- **Rectangle** ┌───┐ - **Component/Service** (Application components, services, modules)
- **Cylinder** ╭───╮ - **Database** (Data storage systems)
- **Cloud** ╭───╮ - **External Service** (Third-party services, APIs)
- **Rounded Rectangle** ╭───╮ - **User/Client** (End users, browsers)
- **Arrow** → - **Data Flow** (Request/Response, data transfer)
- **Dashed Line** ─ ─ ─ - **Optional/Secondary Connection**
- **Layer Box** ┌───┐ - **Architecture Layer** (Presentation, Application, Data)

---

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                       │
│                         (Presentation Tier)                                   │
└─────────────────────────────────────────────────────────────────────────────┘

    ╭───────────────╮                    ╭───────────────╮
    │   Reporter    │                    │    Admin      │  ← (ROUNDED RECTANGLE) User
    │    User       │                    │    User       │
    │  (Browser)    │                    │  (Browser)    │
    └───────┬───────┘                    └───────┬───────┘
            │                                    │
            │  HTTP/HTTPS                        │  HTTP/HTTPS
            │                                    │
            └──────────────┬─────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                                     │
│                          (Business Logic Tier)                               │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌───────────────────────────────┐
                    │     Next.js 16 Application    │  ← (RECTANGLE) Application Component
                    │     (React 19 Frontend)       │
                    │                               │
                    │  ┌─────────────────────────┐ │
                    │  │   User Pages            │ │  ← (RECTANGLE) Component Module
                    │  │  • Home Page            │ │
                    │  │  • Submit Report        │ │
                    │  │  • Track Report         │ │
                    │  └─────────────────────────┘ │
                    │                               │
                    │  ┌─────────────────────────┐ │
                    │  │   Admin Pages           │ │  ← (RECTANGLE) Component Module
                    │  │  • Admin Login          │ │
                    │  │  • Admin Dashboard     │ │
                    │  │  • Report Detail        │ │
                    │  └─────────────────────────┘ │
                    │                               │
                    │  ┌─────────────────────────┐ │
                    │  │   Server Actions        │ │  ← (RECTANGLE) Component Module
                    │  │  • AI Compliance Check  │ │
                    │  │  • API Endpoints        │ │
                    │  └─────────────────────────┘ │
                    │                               │
                    │  ┌─────────────────────────┐ │
                    │  │   Client Libraries       │ │  ← (RECTANGLE) Component Module
                    │  │  • Firebase SDK         │ │
                    │  │  • AI SDK (Gemini)      │ │
                    │  │  • UI Components        │ │
                    │  └─────────────────────────┘ │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
│                        (Data Storage Tier)                                    │
└─────────────────────────────────────────────────────────────────────────────┘

        ╭───────────────────╮        ╭───────────────────╮        ╭───────────────────╮
        │  Firebase Auth     │        │  Cloud Firestore  │        │  Firebase Storage │  ← (CYLINDER) Database
        │  (Authentication)  │        │   (Database)     │        │   (File Storage)  │
        │                    │        │                   │        │                   │
        │  • User Accounts   │        │  • Reports        │        │  • Evidence Files │
        │  • Admin Claims    │        │  • Messages       │        │  • Images/PDFs    │
        │  • Session Mgmt    │        │  • Access Codes   │        │  • Secure URLs     │
        └─────────┬─────────┘        └─────────┬─────────┘        └─────────┬─────────┘
                  │                             │                             │
                  │                             │                             │
                  └─────────────────────────────┴─────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES LAYER                                 │
│                    (Third-Party Services Tier)                                │
└─────────────────────────────────────────────────────────────────────────────┘

                    ╭───────────────────────────────╮
                    │   Google Gemini AI API        │  ← (CLOUD) External Service
                    │   (AI Compliance Check)       │
                    │                               │
                    │  • Category Validation        │
                    │  • Urgency Assessment         │
                    │  • Law Compliance Check      │
                    │  • Philippine Laws Reference │
                    └───────────────┬───────────────┘
                                    │
                                    │ API Calls
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌───────────────────────┐      ┌───────────────────────┐
        │   Vercel Platform     │      │   Firebase Console     │  ← (CLOUD) External Service
        │   (Hosting/Deploy)    │      │   (Management)        │
        │                       │      │                       │
        │  • Next.js Hosting    │      │  • Project Config     │
        │  • Edge Functions     │      │  • Security Rules     │
        │  • CDN Distribution   │      │  • Monitoring         │
        └───────────────────────┘      └───────────────────────┘
```

---

## Detailed Component Architecture

### 1. Frontend Application Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Next.js 16 Application (Frontend)                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          Presentation Layer                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │   User Pages     │  │   Admin Pages    │  │  Shared Components│       │  ← (RECTANGLE) Page Components
│  │                  │  │                  │  │                  │       │
│  │ • Home           │  │ • Login          │  │ • Header         │       │
│  │ • Submit         │  │ • Dashboard     │  │ • Footer         │       │
│  │ • Track          │  │ • Report Detail  │  │ • Card           │       │
│  │ • Report Detail  │  │ • Debug         │  │ • Button         │       │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Business Logic Layer                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │   Client Hooks   │  │   Server Actions │  │   Utilities      │       │  ← (RECTANGLE) Logic Components
│  │                  │  │                  │  │                  │       │
│  │ • useAuth        │  │ • runAiCheck     │  │ • generateCode   │       │
│  │ • useReports     │  │ • validateReport │  │ • formatDate     │       │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Integration Layer                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │  Firebase SDK    │  │  Gemini AI SDK  │  │  API Client      │       │  ← (RECTANGLE) Integration Components
│  │                  │  │                  │  │                  │       │
│  │ • Firestore      │  │ • AI Check      │  │ • HTTP Client    │       │
│  │ • Storage        │  │ • Compliance    │  │ • Error Handling │       │
│  │ • Auth           │  │ • Analysis      │  │ • Retry Logic    │       │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2. Backend Services Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Firebase Backend Services                             │
└─────────────────────────────────────────────────────────────────────────────┘

        ┌──────────────────────────────────────────┐
        │      Firebase Authentication              │  ← (CYLINDER) Authentication Service
        │                                          │
        │  • Email/Password Auth                   │
        │  • Admin Custom Claims                  │
        │  • Session Management                   │
        │  • Token Validation                     │
        └──────────────┬───────────────────────────┘
                        │
                        │ Auth Tokens
                        │
        ┌───────────────┴───────────────────────────┐
        │                                            │
        ▼                                            ▼
┌───────────────────────┐              ┌───────────────────────┐
│   Cloud Firestore      │              │   Firebase Storage   │  ← (CYLINDER) Storage Services
│   (NoSQL Database)     │              │   (Object Storage)   │
│                        │              │                      │
│  Collections:         │              │  Buckets:           │
│  • reports             │              │  • evidence/        │
│    - accessCode        │              │    - images/        │
│    - category          │              │    - pdfs/          │
│    - urgency           │              │                      │
│    - description       │              │  Features:          │
│    - status            │              │  • File Upload      │
│    - messages[]        │              │  • Secure URLs      │
│    - evidenceUrl       │              │  • Access Control    │
│    - createdAt         │              │  • Size Limits       │
│    - aiAnalysis{}      │              │                      │
│                        │              │                      │
│  Security:             │              │  Security:          │
│  • Firestore Rules     │              │  • Storage Rules     │
│  • Admin-only Read     │              │  • Admin-only Access │
│  • Real-time Listeners│              │  • Signed URLs       │
│                        │              │                      │
└────────────────────────┘              └──────────────────────┘
        │                                            │
        │                                            │
        └────────────────┬───────────────────────────┘
                         │
                         │ (Optional)
                         ▼
        ┌──────────────────────────────────────────┐
        │      Cloud Functions                      │  ← (RECTANGLE) Serverless Functions
        │      (Serverless API)                    │
        │                                          │
        │  • Secure Report Access                  │
        │  • Rate Limiting                         │
        │  • Access Code Validation                │
        │  • Anti-enumeration Protection          │
        └──────────────────────────────────────────┘
```

### 3. External Services Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        External Services                                     │
└─────────────────────────────────────────────────────────────────────────────┘

        ╭───────────────────────────────────────────╮
        │      Google Gemini AI API                  │  ← (CLOUD) External AI Service
        │      (AI Compliance Verification)         │
        │                                            │
        │  Input:                                    │
        │  • Report Description                      │
        │  • User Category                          │
        │  • User Urgency                           │
        │                                            │
        │  Processing:                               │
        │  • Analyze against Philippine Laws        │
        │  • Validate Category                      │
        │  • Assess Urgency Level                    │
        │  • Cite Relevant Laws                      │
        │                                            │
        │  Output:                                   │
        │  • Category Assessment                     │
        │  • Urgency Assessment                      │
        │  • Match Status                           │
        │  • Law Cited                              │
        │  • Reason/Explanation                     │
        │                                            │
        │  Models Used:                              │
        │  • gemini-2.5-flash (Primary)             │
        │  • gemini-1.5-flash (Fallback)            │
        │  • gemini-1.5-pro (Fallback)               │
        │  • gemini-pro (Fallback)                   │
        └──────────────┬──────────────────────────────┘
                       │
                       │ API Key Authentication
                       │
        ┌──────────────┴──────────────────────────────┐
        │                                              │
        ▼                                              ▼
┌───────────────────────┐              ┌───────────────────────┐
│   Vercel Platform     │              │   Firebase Console    │  ← (CLOUD) Platform Services
│   (Hosting)           │              │   (Management)        │
│                       │              │                       │
│  • Next.js Deployment│              │  • Project Settings   │
│  • Edge Network      │              │  • Security Rules      │
│  • Environment Vars  │              │  • Monitoring         │
│  • Auto-scaling      │              │  • Analytics           │
│  • SSL/TLS           │              │  • Billing            │
└───────────────────────┘              └───────────────────────┘
```

---

## Data Flow Architecture

### 1. Report Submission Flow

```
╭───────────────╮
│  Reporter     │  ← (ROUNDED RECTANGLE) User
│  (Browser)    │
└───────┬───────┘
        │
        │ 1. Fill Form & Upload Evidence
        ▼
┌───────────────┐
│  Next.js App  │  ← (RECTANGLE) Application
│  (Frontend)   │
└───────┬───────┘
        │
        │ 2. Generate Access Code
        │ 3. Upload File to Storage
        │ 4. Save Report to Firestore
        │
        ├─────────────────┐
        │                 │
        ▼                 ▼
╭───────────────╮  ╭───────────────╮
│ Firebase      │  │ Firebase      │  ← (CYLINDER) Storage
│ Storage       │  │ Firestore     │
│ (Evidence)    │  │ (Report Data) │
└───────────────┘  └───────────────┘
        │                 │
        │                 │
        └────────┬────────┘
                 │
                 │ 5. Return Access Code
                 ▼
        ┌───────────────┐
        │  Success Page │  ← (RECTANGLE) UI Component
        │  (Show Code)  │
        └───────────────┘
```

### 2. Report Tracking Flow

```
╭───────────────╮
│  Reporter     │  ← (ROUNDED RECTANGLE) User
│  (Browser)    │
└───────┬───────┘
        │
        │ 1. Enter Access Code
        ▼
┌───────────────┐
│  Next.js App  │  ← (RECTANGLE) Application
│  (Frontend)   │
└───────┬───────┘
        │
        │ 2. Query Firestore by Access Code
        │    (via Cloud Functions - if enabled)
        ▼
╭───────────────╮
│ Cloud         │  ← (RECTANGLE) Serverless Function
│ Functions     │    (Optional - for security)
│ (API)         │
└───────┬───────┘
        │
        │ 3. Validate & Query
        ▼
╭───────────────╮
│ Firebase      │  ← (CYLINDER) Database
│ Firestore     │
└───────┬───────┘
        │
        │ 4. Return Report Data
        │ 5. Setup Real-time Listener
        ▼
┌───────────────┐
│  Report       │  ← (RECTANGLE) UI Component
│  Detail Page  │
│  (Live Updates)│
└───────────────┘
```

### 3. Admin Dashboard Flow

```
╭───────────────╮
│  Admin        │  ← (ROUNDED RECTANGLE) User
│  (Browser)    │
└───────┬───────┘
        │
        │ 1. Login with Email/Password
        ▼
┌───────────────┐
│  Next.js App  │  ← (RECTANGLE) Application
│  (Frontend)   │
└───────┬───────┘
        │
        │ 2. Authenticate
        ▼
╭───────────────╮
│ Firebase      │  ← (CYLINDER) Authentication
│ Auth          │
└───────┬───────┘
        │
        │ 3. Verify Admin Claim
        │ 4. Load All Reports
        ▼
╭───────────────╮
│ Firebase      │  ← (CYLINDER) Database
│ Firestore     │
└───────┬───────┘
        │
        │ 5. Return Reports Data
        ▼
┌───────────────┐
│  Admin        │  ← (RECTANGLE) UI Component
│  Dashboard    │
│  (Statistics) │
└───────────────┘
```

### 4. AI Compliance Check Flow

```
┌───────────────┐
│  Admin        │  ← (RECTANGLE) User Action
│  (Dashboard)  │
└───────┬───────┘
        │
        │ 1. Click "Run AI Check"
        ▼
┌───────────────┐
│  Next.js      │  ← (RECTANGLE) Application
│  Server Action│
└───────┬───────┘
        │
        │ 2. Prepare Report Data
        │ 3. Build AI Prompt
        │ 4. Call Gemini API
        ▼
╭───────────────╮
│ Google Gemini │  ← (CLOUD) External Service
│ AI API        │
└───────┬───────┘
        │
        │ 5. Analyze Report
        │ 6. Check Compliance
        │ 7. Return Analysis
        ▼
┌───────────────┐
│  Next.js      │  ← (RECTANGLE) Application
│  Server Action│
└───────┬───────┘
        │
        │ 8. Save Results
        ▼
╭───────────────╮
│ Firebase      │  ← (CYLINDER) Database
│ Firestore     │
│ (Save AI      │
│  Analysis)    │
└───────┬───────┘
        │
        │ 9. Update UI
        ▼
┌───────────────┐
│  Admin        │  ← (RECTANGLE) UI Component
│  Report Page  │
│  (Show Results)│
└───────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Security Layers                                      │
└─────────────────────────────────────────────────────────────────────────────┘

Layer 1: Client Security
┌─────────────────────────────────────────────────────────────────────────────┐
│  • HTTPS/TLS Encryption                                                    │
│  • Environment Variables (Client-side)                                     │
│  • No User Tracking                                                         │
│  • Anonymous Access                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
Layer 2: Application Security
┌─────────────────────────────────────────────────────────────────────────────┐
│  • Server Actions (Server-side)                                            │
│  • Input Validation                                                         │
│  • Access Code Generation (Secure Random)                                  │
│  • File Upload Validation                                                   │
│  • Rate Limiting (Cloud Functions)                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
Layer 3: Authentication Security
┌─────────────────────────────────────────────────────────────────────────────┐
│  • Firebase Authentication                                                  │
│  • Admin Custom Claims                                                      │
│  • Token Validation                                                         │
│  • Session Management                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
Layer 4: Database Security
┌─────────────────────────────────────────────────────────────────────────────┐
│  • Firestore Security Rules                                                 │
│    - Admin-only read access                                                 │
│    - Public write (anonymous reports)                                       │
│    - Field validation                                                       │
│  • Storage Security Rules                                                   │
│    - Admin-only read access                                                 │
│    - Authenticated write                                                    │
│    - File type/size validation                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
Layer 5: External Service Security
┌─────────────────────────────────────────────────────────────────────────────┐
│  • API Key Management (Environment Variables)                               │
│  • Secure API Calls (HTTPS)                                                 │
│  • Error Handling (No sensitive data exposure)                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack Summary

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **State Management**: React Hooks
- **Real-time Updates**: Firestore Listeners

### Backend Services
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore (NoSQL)
- **File Storage**: Firebase Storage
- **Serverless Functions**: Firebase Cloud Functions (Optional)
- **Hosting**: Vercel Platform

### External Services
- **AI Service**: Google Gemini AI API
- **Management**: Firebase Console

### Development Tools
- **Package Manager**: npm
- **Build Tool**: Next.js Build System
- **Linting**: ESLint
- **Version Control**: Git

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Deployment Flow                                      │
└─────────────────────────────────────────────────────────────────────────────┘

Development Environment
        │
        │ npm run build
        ▼
┌───────────────┐
│  Next.js      │  ← (RECTANGLE) Build Process
│  Build        │
└───────┬───────┘
        │
        │ Deploy
        ▼
╭───────────────╮
│  Vercel      │  ← (CLOUD) Hosting Platform
│  Platform    │
│              │
│  • Edge CDN  │
│  • Auto-scaling│
│  • SSL/TLS   │
└───────┬───────┘
        │
        │ Production URL
        ▼
┌───────────────┐
│  Users        │  ← (ROUNDED RECTANGLE) End Users
│  (Internet)   │
└───────────────┘

Firebase Services (Separate Deployment)
        │
        │ firebase deploy
        ▼
╭───────────────╮
│  Firebase     │  ← (CLOUD) Backend Platform
│  Services     │
│               │
│  • Firestore  │
│  • Storage    │
│  • Auth       │
│  • Functions  │
└───────────────┘
```

---

## Summary

**Architecture Type**: Serverless, Cloud-based, Full-stack Web Application

**Key Characteristics**:
- **Frontend**: Next.js React application hosted on Vercel
- **Backend**: Firebase BaaS (Backend as a Service)
- **Database**: NoSQL (Firestore) with real-time capabilities
- **Storage**: Object storage (Firebase Storage)
- **Authentication**: Firebase Auth with custom claims
- **AI Integration**: Google Gemini AI for compliance verification
- **Security**: Multi-layer security with rules and validation
- **Scalability**: Auto-scaling via Vercel and Firebase

**Data Flow Pattern**: Client → Next.js App → Firebase Services → External APIs

**Communication Pattern**: 
- Synchronous: HTTP/HTTPS requests
- Asynchronous: Real-time listeners (Firestore)
- Serverless: Cloud Functions (optional)

---

**Last Updated:** Generated from codebase analysis  
**Version:** 1.0 - System Architecture Diagram
