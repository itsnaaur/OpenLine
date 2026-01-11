# OpenLine - Flowcharts
## Anonymous Whistleblowing & Feedback Portal

This document contains 4 simplified flowcharts showing the main flows in the OpenLine system.

---

## Flowchart Symbol Legend

**Standard Flowchart Symbols:**
- **Oval/Ellipse** ╭───╮ - **Start/End/Terminal** (Beginning or end of process)
- **Rectangle** ┌───┐ - **Process/Action** (Action or operation)
- **Rhombus/Diamond** ◇ - **Decision/Condition** (Yes/No question or condition)
- **Parallelogram** ┌───┐ - **Input/Output** (Data input or output)
- **Cylinder** ╭───╮ - **Database** (Data storage)
- **Document** ┌───┐ - **Document/File** (Document or file operation)

---

## 1. General Website Flowchart (Surface Level)

```
        ╭───────────────────────────────╮
        │   USER VISITS WEBSITE         │  ← (OVAL) Start/Terminal
        └───────────────┬───────────────┘
                        │
                        ▼
                ┌───────────────┐
                │   HOME PAGE    │  ← (RECTANGLE) Process/Page
                │ (Landing Page) │
                └───────┬────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌───────────┐   ┌───────────┐   ┌───────────┐
│  Submit   │   │  Track    │   │  Admin    │  ← (RECTANGLE) Process/Page
│  Report   │   │  Report   │   │  Login    │
│   Page    │   │   Page    │   │   Page    │
└─────┬─────┘   └─────┬─────┘   └─────┬─────┘
      │               │               │
      │               │               │
      ▼               ▼               ▼
┌───────────┐   ┌───────────┐   ┌───────────┐
│  Success  │   │  Report  │   │  Admin    │  ← (RECTANGLE) Process/Page
│   Page    │   │  Detail   │   │ Dashboard │
│(Shows Code)│   │   Page    │   │           │
└─────┬─────┘   └─────┬─────┘   └─────┬─────┘
      │               │               │
      └───────────────┼───────────────┘
                      │
                      ▼
              ╭───────────────╮
              │   HOME PAGE    │  ← (OVAL) End/Terminal
              │ (Can Return)   │
              └───────────────┘
```

---

## 2. Reporter User Flowchart (Submitting a Report)

```
        ╭───────────────────────────────╮
        │  REPORTER OPENS WEBSITE        │  ← (OVAL) Start/Terminal
        └───────────────┬───────────────┘
                        │
                        ▼
                ┌───────────────┐
                │   HOME PAGE   │  ← (RECTANGLE) Process/Page
                └───────┬────────┘
                        │
                        │ Clicks "Submit Report"
                        ▼
                ┌───────────────┐
                │  SUBMIT PAGE  │  ← (RECTANGLE) Process/Page
                └───────┬────────┘
                        │
                        ▼
                ┌───────────────┐
                │ Select        │  ← (PARALLELOGRAM) Input/Selection
                │ Category      │
                │ (Dropdown)    │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ Select         │  ← (PARALLELOGRAM) Input/Selection
                │ Urgency Level  │
                │ (Radio Buttons)│
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ Enter          │  ← (PARALLELOGRAM) Input/Text
                │ Description    │
                │ (Text Area)    │
                └───────┬───────┘
                        │
                        ▼
                    ◇───────────◇
                    │  Upload    │  ← (RHOMBUS) Decision
                    │  Evidence? │
                    └───────┬────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
    ┌───────────────┐              ┌───────────────┐
    │ Upload File   │              │ Skip Upload   │  ← (RECTANGLE) Process
    │ (Max 5MB)     │              │               │
    └───────┬───────┘              └───────┬───────┘
            │                               │
            │                               │
            ▼                               │
    ┌───────────────┐                       │
    │ Validate File │                       │  ← (RECTANGLE) Process
    │ Type & Size   │                       │
    └───────┬───────┘                       │
            │                               │
            ▼                               │
        ◇───────────◇                       │
        │ File Valid?│                       │  ← (RHOMBUS) Decision
        └───────┬────┘                       │
                │                           │
        ┌───────┴───────┐                   │
        │               │                   │
        ▼               ▼                   │
    ┌────────┐    ┌────────┐               │
    │  Yes   │    │   No   │               │  ← (RECTANGLE) Process
    │        │    │(Error) │               │
    └───┬────┘    └───┬────┘               │
        │             │                    │
        │             └────────┬───────────┘
        │                      │
        └──────────┬───────────┘
                   │
                   ▼
           ┌───────────────┐
           │ Click Submit  │  ← (RECTANGLE) Process/Action
           │   Button      │
           └───────┬───────┘
                   │
                   ▼
           ┌───────────────┐
           │  Processing   │  ← (RECTANGLE) Process
           │  Uploading... │
           │  Saving...    │
           └───────┬───────┘
                   │
                   ▼
           ┌───────────────┐
           │ Generate      │  ← (RECTANGLE) Process
           │ Access Code   │
           │ Format:       │
           │ XXX-XX-X      │
           └───────┬───────┘
                   │
                   ▼
           ╭───────────────╮
           │   Database    │  ← (CYLINDER) Database Storage
           │   (Firestore) │
           └───────┬───────┘
                   │
                   ▼
               ◇───────────◇
               │  Success? │  ← (RHOMBUS) Decision
               └───────┬────┘
                       │
           ┌───────────┴───────────┐
           │                       │
           ▼                       ▼
       ┌────────┐            ┌────────┐
       │  Yes   │            │   No   │  ← (RECTANGLE) Process
       │        │            │(Error) │
       └───┬────┘            └───┬────┘
           │                    │
           │                    └───┐
           │                        │
           │                        ▼
           │                ┌───────────────┐
           │                │ Try Again      │  ← (RECTANGLE) Process
           │                └────────┬───────┘
           │                         │
           │                         └───┐
           │                             │
           ▼                             │
   ┌───────────────────────────────┐    │
   │      ✅ SUCCESS PAGE            │    │  ← (RECTANGLE) Process/Output
   │  ┌─────────────────────────┐  │    │
   │  │  Your Access Code:       │  │    │
   │  │  ┌───────────────────┐ │  │    │
   │  │  │   8X2-99B          │ │  │    │
   │  │  └───────────────────┘ │  │    │
   │  │                          │  │    │
   │  │  [Copy Code]             │  │    │
   │  │  [Track Report]          │  │    │
   │  │  [Submit Another]        │  │    │
   │  │  [Go Home]               │  │    │
   │  └─────────────────────────┘  │    │
   └───────────────────────────────┘    │
                                         │
                                         └───┐
                                             │
                                             ▼
                                     ┌───────────────┐
                                     │ Return to     │  ← (RECTANGLE) Process
                                     │ Form          │
                                     └───────────────┘
```

---

## 3. Reporter Tracking Feature Flowchart

```
        ╭───────────────────────────────╮
        │ REPORTER WANTS TO TRACK        │  ← (OVAL) Start/Terminal
        │      THEIR REPORT              │
        └───────────────┬───────────────┘
                        │
                        ▼
                ┌───────────────┐
                │  TRACK PAGE   │  ← (RECTANGLE) Process/Page
                └───────┬────────┘
                        │
                        ▼
                ┌───────────────┐
                │ Enter Access  │  ← (PARALLELOGRAM) Input
                │ Code          │
                │ [XXX-XX-X]    │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ Click Track   │  ← (RECTANGLE) Process/Action
                │ Button        │
                └───────┬───────┘
                        │
                        ▼
                    ◇───────────◇
                    │ Code      │  ← (RHOMBUS) Decision
                    │ Format    │
                    │ Valid?    │
                    └───────┬────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
    ┌───────────────┐              ┌───────────────┐
    │  Yes          │              │  No           │  ← (RECTANGLE) Process
    │               │              │ (Show Error)  │
    └───────┬───────┘              └───────┬───────┘
            │                               │
            │                               └───┐
            │                                   │
            │                                   ▼
            │                           ┌───────────────┐
            │                           │ Try Again     │  ← (RECTANGLE) Process
            │                           └────────┬──────┘
            │                                    │
            │                                    └───┐
            │                                        │
            ▼                                        │
    ┌───────────────┐                                │
    │ Search        │                                │  ← (RECTANGLE) Process
    │ Database      │                                │
    └───────┬───────┘                                │
            │                                        │
            ▼                                        │
        ╭───────────────╮                            │
        │   Database    │                            │  ← (CYLINDER) Database
        │   (Firestore) │                            │
        └───────┬───────┘                            │
                │                                    │
                ▼                                    │
            ◇───────────◇                            │
            │ Report   │                             │  ← (RHOMBUS) Decision
            │ Found?   │                             │
            └───────┬───┘                            │
                    │                               │
        ┌───────────┴───────────┐                    │
        │                       │                    │
        ▼                       ▼                    │
    ┌────────┐            ┌────────┐                 │
    │  Yes   │            │   No   │                 │  ← (RECTANGLE) Process
    │        │            │(Error) │                 │
    └───┬────┘            └───┬────┘                 │
        │                    │                       │
        │                    └────────┬──────────────┘
        │                             │
        │                             ▼
        │                     ┌───────────────┐
        │                     │ Try Again     │  ← (RECTANGLE) Process
        │                     └────────┬──────┘
        │                              │
        │                              └───┐
        │                                  │
        ▼                                  │
┌───────────────┐                          │
│ Load Report   │                          │  ← (RECTANGLE) Process
│ Details       │                          │
│ (From DB)     │                          │
└───────┬───────┘                          │
        │                                  │
        ▼                                  │
┌───────────────────────────────────────────┐
│      REPORT DETAIL PAGE                   │  ← (RECTANGLE) Process/Output
│  ┌────────────────────────────────────┐  │
│  │  Access Code: 8X2-99B              │  │
│  │  Status: [New] [In Progress]       │  │
│  │  Category: Safety                  │  │
│  │  Urgency: High                      │  │
│  │  Description: [Full text...]        │  │
│  │  Evidence: [View Image/PDF]        │  │
│  └────────────────────────────────────┘  │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │  MESSAGE THREAD                     │  │
│  │  ┌──────────────────────────────┐ │  │
│  │  │ Reporter: [Message 1]         │ │  │
│  │  │ Admin: [Response 1]            │ │  │
│  │  │ Reporter: [Message 2]         │ │  │
│  │  └──────────────────────────────┘ │  │
│  │                                    │  │
│  │  [Type message...] [Send]          │  │
│  └────────────────────────────────────┘  │
└───────────────┬───────────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ Setup Real-   │  ← (RECTANGLE) Process
        │ time Listener │
        │ (Auto-update) │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │  USER ACTIONS │  ← (RECTANGLE) Process
        └───────┬───────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐
│ Send   │ │ Wait   │ │ Back   │  ← (RECTANGLE) Process
│Message │ │Updates │ │to Track│
└───┬────┘ └───┬────┘ └───┬────┘
    │           │           │
    │           │           │
    ▼           ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐
│ Save   │ │ Auto   │ │ Track  │  ← (RECTANGLE) Process
│ to DB  │ │ Update │ │ Page   │
└────────┘ └────────┘ └────────┘
```

---

## 4. Admin Flowchart

```
        ╭───────────────────────────────╮
        │   ADMIN VISITS WEBSITE         │  ← (OVAL) Start/Terminal
        └───────────────┬───────────────┘
                        │
                        ▼
                ┌───────────────┐
                │   HOME PAGE   │  ← (RECTANGLE) Process/Page
                └───────┬────────┘
                        │
                        │ Clicks "Admin Login"
                        ▼
                ┌───────────────┐
                │  ADMIN LOGIN  │  ← (RECTANGLE) Process/Page
                │  ┌──────────┐ │
                │  │ Email:   │ │
                │  │ Password:│ │  ← (PARALLELOGRAM) Input
                │  │ [Sign In]│ │
                │  └──────────┘ │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │  Authenticate │  ← (RECTANGLE) Process
                │  (Firebase)   │
                └───────┬───────┘
                        │
                        ▼
                    ◇───────────◇
                    │ Admin     │  ← (RHOMBUS) Decision
                    │ Account?  │
                    └───────┬───┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
    ┌───────────────┐              ┌───────────────┐
    │  Yes          │              │  No          │  ← (RECTANGLE) Process
    │  (Success)    │              │  (Error)      │
    └───────┬───────┘              └───────┬─────┘
            │                               │
            │                               └───┐
            │                                   │
            │                                   ▼
            │                           ┌───────────────┐
            │                           │ Try Again     │  ← (RECTANGLE) Process
            │                           └────────┬──────┘
            │                                    │
            │                                    └───┐
            │                                        │
            ▼                                        │
    ┌────────────────────────┐                      │
    │   ADMIN DASHBOARD      │                      │  ← (RECTANGLE) Process/Page
    │  ┌──────────────────┐  │                      │
    │  │ Statistics:      │  │                      │
    │  │ • Total: 50      │  │                      │
    │  │ • New: 10        │  │                      │
    │  │ • In Progress: 5 │  │                      │
    │  │ • Resolved: 35   │  │                      │
    │  └──────────────────┘  │                      │
    │                        │                      │
    │  ┌──────────────────┐  │                      │
    │  │ Reports List:     │  │                      │
    │  │ [Filter Options]  │  │                      │
    │  │                   │  │                      │
    │  │ Report 1 [View]  │  │                      │
    │  │ Report 2 [View]  │  │                      │
    │  │ Report 3 [View]  │  │                      │
    │  │ ...               │  │                      │
    │  └──────────────────┘  │                      │
    └────────────┬───────────┘                      │
                 │                                   │
                 │                                   │
     ┌───────────┼───────────┐                      │
     │           │           │                      │
     ▼           ▼           ▼                      │
┌───────────┐ ┌───────────┐ ┌───────────┐          │
│ View     │ │ Filter    │ │ Sign Out  │          │  ← (RECTANGLE) Process
│ Report   │ │ Reports   │ │           │          │
└─────┬─────┘ └─────┬─────┘ └─────┬─────┘          │
      │             │             │                  │
      │             │             │                  │
      │             ▼             ▼                  │
      │     ┌───────────────┐ ┌──────────┐          │
      │     │ Update Filter │ │ Back to  │          │  ← (RECTANGLE) Process
      │     │ Display       │ │ Login    │          │
      │     └───────────────┘ └──────────┘          │
      │                                              │
      ▼                                              │
┌───────────────────────────────────────────┐        │
│      ADMIN REPORT DETAIL PAGE             │        │  ← (RECTANGLE) Process/Page
│  ┌────────────────────────────────────┐  │        │
│  │  Report Information:               │  │        │
│  │  • Access Code: 8X2-99B            │  │        │
│  │  • Category: Safety                │  │        │
│  │  • Urgency: High                   │  │        │
│  │  • Status: [New ▼] [Update]       │  │        │
│  │  • Description: [Full text...]      │  │        │
│  │  • Evidence: [View Image/PDF]      │  │        │
│  └────────────────────────────────────┘  │        │
│                                           │        │
│  ┌────────────────────────────────────┐  │        │
│  │  AI Compliance Verification:      │  │        │
│  │  [Run AI Check Button]             │  │        │
│  │                                     │  │        │
│  │  Results:                           │  │        │
│  │  • Category Match: ✓/✗             │  │        │
│  │  • Urgency Match: ✓/✗              │  │        │
│  │  • Law Cited: RA 11058              │  │        │
│  │  • Reason: [Explanation...]         │  │        │
│  │                                     │  │        │
│  │  [Update Category] [Update Urgency]│  │        │
│  └────────────────────────────────────┘  │        │
│                                           │        │
│  ┌────────────────────────────────────┐  │        │
│  │  MESSAGES:                          │  │        │
│  │  ┌──────────────────────────────┐   │  │        │
│  │  │ Reporter: [Message 1]        │   │  │        │
│  │  │ Admin: [Response 1]           │   │  │        │
│  │  │ Reporter: [Message 2]        │   │  │        │
│  │  └──────────────────────────────┘   │  │        │
│  │                                     │  │        │
│  │  [Type message...] [Send]           │  │        │
│  └────────────────────────────────────┘  │        │
└───────────────┬───────────────────────────┘        │
                │                                       │
                │                                       │
        ┌───────┴───────┐                               │
        │               │                               │
        ▼               ▼                               │
┌───────────────┐ ┌───────────────┐                    │
│ Update Status │ │ Run AI Check  │                    │  ← (RECTANGLE) Process
│               │ │               │                    │
│ • New         │ │ • Call Gemini │                    │
│ • In Progress │ │ • Analyze     │                    │
│ • Resolved    │ │ • Show Results│                    │
│               │ │ • Update if   │                    │
│ [Save]        │ │   needed      │                    │
└───────┬───────┘ └───────┬───────┘                    │
        │                 │                             │
        │                 │                             │
        ▼                 ▼                             │
┌───────────────┐ ┌───────────────┐                    │
│ Notify        │ │ Save AI       │                    │  ← (RECTANGLE) Process
│ Reporter      │ │ Results       │                    │
│ (Add Message) │ │               │                    │
└───────┬───────┘ └───────┬───────┘                    │
        │                 │                             │
        └─────────┬───────┘                             │
                  │                                     │
                  ▼                                     │
        ┌─────────────────┐                             │
        │ Update Display  │                             │  ← (RECTANGLE) Process
        │ (Real-time)     │                             │
        └─────────────────┘                             │
                  │                                     │
                  │                                     │
                  ▼                                     │
        ┌─────────────────┐                             │
        │ Back to          │                             │  ← (RECTANGLE) Process
        │ Dashboard        │                             │
        └─────────────────┘                             │
                                                         │
                                                         │
                                                         ▼
                                                 ┌───────────────┐
                                                 │ Return to     │  ← (RECTANGLE) Process
                                                 │ Dashboard     │
                                                 └───────────────┘
```

---

## Summary

**Flowchart 1:** General website structure showing all main pages and navigation paths.

**Flowchart 2:** Step-by-step reporter submission process with all form fields and validation steps.

**Flowchart 3:** Reporter tracking feature showing how to find and view reports, plus messaging.

**Flowchart 4:** Complete admin workflow including dashboard, report management, AI checks, and messaging.

---

## Symbol Usage Summary

- **Oval (╭───╮)**: Used for Start and End points
- **Rectangle (┌───┐)**: Used for all processes, actions, and pages
- **Rhombus/Diamond (◇)**: Used for all decision points (Yes/No questions)
- **Parallelogram**: Used for input fields (though shown as rectangles in ASCII)
- **Cylinder (╭───╮)**: Used for database operations

**Note:** In ASCII art, some symbols may appear similar, but the notes indicate the proper symbol type for each box.

---

**Last Updated:** Generated from codebase analysis  
**Version:** 3.0 - Proper Flowchart Symbols with Notes
