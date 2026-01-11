# Figma AI Wireframe Generation - Single Comprehensive Prompt
## OpenLine - Anonymous Whistleblowing & Feedback Portal

---

## COMPLETE PROMPT FOR FIGMA AI

```
Create comprehensive wireframes for an anonymous whistleblowing portal called "OpenLine". Generate BOTH low-fidelity and medium-fidelity versions for ALL pages listed below. Create separate frames/pages for each wireframe type.

=== DESIGN SYSTEM ===

COLOR PALETTE:
- Primary Blue: #116aae
- Secondary Blue: #0da2cb
- Accent Blue: #0dc7e4
- Background Gradient: #f0f9fc to #e6f4f8
- Text Dark: #1f2937 (gray-900)
- Text Medium: #4b5563 (gray-600)
- Success Green: #10b981
- Warning Yellow: #f59e0b
- Error Red: #ef4444

TYPOGRAPHY:
- Headings: Bold, 24px-64px
- Body: Regular, 16px-18px
- Buttons: Semibold, 14px-16px
- Labels: Semibold, 12px-14px

SPACING:
- Container: 16px mobile, 24px tablet, 32px desktop
- Section gaps: 48px-96px
- Component gaps: 16px-24px
- Max width: 1280px (centered)

COMPONENTS:
- Header: Sticky, white background with transparency, logo left, nav/buttons right
- Footer: White background, centered copyright text
- Cards: White background, rounded corners (8px-12px), subtle shadow
- Buttons: Primary (blue gradient), Secondary (outlined), rounded (6px-8px)
- Inputs: White background, gray border, rounded (6px-8px), blue border on focus
- Badges: Rounded pills, colored backgrounds

=== PAGE 1: HOME PAGE ===

LOW-FIDELITY:
- Header: Logo (180x50px rectangle) left, two buttons right ("Submit Report", "Track Report")
- Hero Section (centered, large):
  * Badge pill: "100% Anonymous & Secure Reporting"
  * Logo placeholder (320x110px)
  * Heading: "Your Voice Matters"
  * Subheading: "Speak Up Safely"
  * Two paragraphs
  * Two CTA buttons side by side
- Why Report Section:
  * Centered heading: "Why You Should Report"
  * Subheading paragraph
  * Grid of 4 cards (2x2 mobile, 4 columns desktop):
    - Each: Icon circle, title, description
    - Titles: "Your Safety Matters", "Mental Health Support", "Protect Your Community", "Anonymous & Secure"
- Encouragement Section:
  * Full-width card with gradient background
  * Checkmark icon, heading "You're Not Alone", paragraph
  * Three badges: "100% Anonymous", "Secure & Private", "Supportive Environment"
- Quick Actions Section:
  * Two large cards side by side:
    - Left: "Ready to Report?" with document icon, description, badges, button
    - Right: "Check Status" with search icon, description, badges, button
- Footer: Centered copyright text

MEDIUM-FIDELITY:
- Same structure but with:
  * Light blue gradient background
  * White cards with shadows
  * Blue gradient buttons (#116aae to #0da2cb)
  * Proper colors, shadows, rounded corners
  * Decorative wave shapes in background (subtle)

=== PAGE 2: SUBMIT REPORT PAGE ===

LOW-FIDELITY:
- Header: Logo left, "Back to Home" button right
- Top Section (centered):
  * Badge: "100% Anonymous & Secure"
  * Heading: "Submit Your Report"
  * Two description paragraphs
- Two-column layout (2/3 + 1/3 on desktop, stacked on mobile):
  * LEFT: Form card
    - Category dropdown (Safety, Harassment, Facility Issue, Suggestion)
    - Urgency radio buttons (Low | Medium | High) in a row
    - Description textarea (6 rows)
    - Evidence upload: Dashed border box, upload icon, "Upload a file or drag and drop", "PNG, JPG, PDF up to 5MB"
    - Submit button (full width, large)
  * RIGHT: Sidebar card (gradient background)
    - Heart icon, heading "You're Doing the Right Thing"
    - 4 bullet points with checkmarks
    - Footer note with lock icon

MEDIUM-FIDELITY:
- Same structure with:
  * White form card with shadow
  * Blue gradient sidebar card (#116aae to #0da2cb), white text
  * Styled form inputs (blue border on focus)
  * Urgency pills (selected state highlighted)
  * File upload area (blue border on hover)

=== PAGE 3: SUBMIT SUCCESS PAGE ===

LOW-FIDELITY:
- Header: Logo left, "Back to Home" button right
- Centered card:
  * Success icon (large circle with checkmark)
  * Heading: "Report Submitted Successfully!"
  * Subheading paragraph
  * Access code box:
    - Label: "Your Access Code"
    - Large code display: "XXX-XX-X" format (monospace)
    - "Copy Access Code" button
  * Two buttons: "Track Your Report" (primary), "Submit Another Report" (secondary)
  * Important note box: "Important: Save this access code..."

MEDIUM-FIDELITY:
- Same structure with:
  * Blue gradient success icon circle
  * Light blue access code box (#e6f4f8) with blue border
  * Blue gradient code text
  * Styled buttons with proper colors

=== PAGE 4: TRACK REPORT PAGE ===

LOW-FIDELITY:
- Header: Logo left, "Back to Home" button right
- Centered card:
  * Search icon (large circle at top)
  * Heading: "Track Your Report"
  * Subheading: "Enter your access code to view updates"
  * Input field: Large, centered, monospace, placeholder "XXX-XX-X"
  * Format hint: "Format: XXX-XX-X (e.g., 8X2-99B)"
  * "Track Report" button (full width)
  * Info box: Shield icon, "Don't have an access code?" heading, text with link

MEDIUM-FIDELITY:
- Same structure with:
  * Blue gradient search icon circle
  * Styled input (blue border on focus)
  * Blue gradient button
  * Light blue info box with blue border

=== PAGE 5: REPORT DETAIL PAGE (REPORTER VIEW) ===

LOW-FIDELITY:
- Header: Logo left, "Back to Track" button right
- Two cards (stacked on mobile, side by side on desktop):
  * CARD 1: Report Details
    - Top: Heading "Report Details" + Status badge (New/In Progress/Resolved)
    - Access code: "Access Code: XXX-XX-X"
    - Info grid (2 columns): Category, Urgency, Submitted date, Last Updated date
    - Description section: Label + text block
    - Evidence section (if exists): Label + image placeholder or PDF link
  * CARD 2: Messages
    - Heading: "Messages"
    - Message thread (scrollable area):
      - Reporter messages: Right-aligned bubbles
      - Admin messages: Left-aligned bubbles
      - Each: Sender label, timestamp, message text
    - Input area: Text field + Send button

MEDIUM-FIDELITY:
- Same structure with:
  * Status badges (colored: red/yellow/green)
  * Reporter messages: Blue gradient bubbles, right-aligned, white text
  * Admin messages: Gray bubbles, left-aligned, dark text
  * Styled input and send button

=== PAGE 6: ADMIN LOGIN PAGE ===

LOW-FIDELITY:
- Header: Logo left, "Back to Home" button right
- Two equal-width columns (side by side on desktop, stacked on mobile):
  * LEFT: Login form card
    - Lock icon (circle at top)
    - Heading: "Admin Login"
    - Subheading: "Sign in to access the admin dashboard"
    - Email field (with mail icon on left)
    - Password field (with lock icon on left)
    - "Sign In" button (full width)
    - Info box: "Note: This is an admin-only area..."
  * RIGHT: Info card (gradient background)
    - Badge: "Administrative Access"
    - Heading: "Welcome to Admin Dashboard"
    - Description paragraph
    - Three feature cards: Icon, title, description each
    - Footer note with shield icon

MEDIUM-FIDELITY:
- Same structure with:
  * White login card with shadow
  * Blue gradient info card (#116aae to #0da2cb), white text
  * Styled form inputs (blue border on focus)
  * Blue gradient sign in button

=== PAGE 7: ADMIN DASHBOARD PAGE ===

LOW-FIDELITY:
- Header: Logo left, user email + "Sign Out" button right
- Stats Overview Card:
  * Grid of 4 stat boxes:
    - "Total Reports" (number)
    - "New" (number, red accent)
    - "In Progress" (number, yellow accent)
    - "Resolved" (number, green accent)
- Filters Card:
  * "Status" dropdown: All | New | In Progress | Resolved
  * "Urgency" dropdown: All | High | Medium | Low
  * "Clear" button (if filters active)
  * Results count: "Showing X of Y reports"
  * View toggle: List icon | Card icon
- Reports Display (show both views):
  * LIST VIEW: Table with columns - Access Code, Category, Urgency (badge), Status (badge), Created (date), Actions ("View" button)
  * CARD VIEW: Grid of cards (3 columns desktop) - Each card: Access code, Urgency badge, Category heading, Description preview, Status badge, Created date, "View" button

MEDIUM-FIDELITY:
- Same structure with:
  * Colored stat boxes (blue, red, yellow, green)
  * Styled table (alternating row colors, colored badges)
  * Card grid with shadows and hover effects
  * Active view toggle highlighted

=== PAGE 8: ADMIN REPORT DETAIL PAGE ===

LOW-FIDELITY:
- Header: Logo left, "Back to Dashboard" button right
- Two-column layout (wider left, narrower right):
  * LEFT COLUMN:
    - Report Details Card:
      * Heading "Report Details" + Status badge
      * Access code
      * Status update: Dropdown + "Update" button
      * Info grid (2 columns): Category, Urgency, Submitted, Last Updated
      * Description section
      * Evidence section
    - AI Compliance Card:
      * Heading "AI Compliance Verification" (with bot icon)
      * If not run: Description + "Run AI Compliance Check" button
      * If run: Match indicator, Category assessment, Urgency assessment, Discrepancy warning (if mismatch), Update sections (if mismatch), Law cited section
  * RIGHT COLUMN:
    - Messages Card:
      * Heading "Messages"
      * Message thread (scrollable)
      * Input: Text field + Send button

MEDIUM-FIDELITY:
- Same structure with:
  * Status badges (colored)
  * AI card border changes color (green if match, red if mismatch)
  * Warning boxes (red/yellow) for discrepancies
  * Update buttons (yellow/blue secondary style)
  * Message bubbles (admin: blue gradient right, reporter: gray left)
  * Law cited box (light blue with blue text)

=== INSTRUCTIONS FOR FIGMA AI ===

1. Create separate frames for LOW-FIDELITY and MEDIUM-FIDELITY versions
2. For LOW-FIDELITY: Use simple shapes (rectangles, circles, lines), grayscale only, label all elements clearly
3. For MEDIUM-FIDELITY: Add actual colors, shadows, rounded corners, proper typography, hover/focus states
4. Make all pages responsive (show mobile, tablet, desktop layouts if possible)
5. Use consistent component styling across all pages
6. Label all interactive elements (buttons, inputs, links)
7. Show proper spacing and visual hierarchy
8. Include placeholder text where needed
9. Make headers and footers consistent across all pages
10. Ensure proper contrast and readability

=== RESPONSIVE BREAKPOINTS ===
- Mobile: 375px-768px (single column, stacked elements)
- Tablet: 768px-1024px (two columns where appropriate)
- Desktop: 1024px+ (full multi-column layouts)

Generate all 8 pages in both low-fidelity and medium-fidelity versions. Create 16 total wireframes (8 low-fidelity + 8 medium-fidelity).
```

---

## How to Use This Prompt

1. **Copy the entire prompt** (everything between the triple backticks)
2. **Open Figma AI** (or your Figma AI tool)
3. **Paste the prompt** into the AI input field
4. **Specify**: "Create wireframes for all pages as described"
5. **Wait for generation** - Figma AI should create all 16 wireframes (8 pages × 2 fidelity levels)

## Tips for Best Results

- If Figma AI creates them one at a time, you can ask it to continue generating the remaining pages
- You can specify "Start with low-fidelity versions first" if you want to generate in stages
- If the output is too complex, you can break it into smaller chunks (e.g., "Generate only the user-facing pages first")
- Adjust colors or spacing in the prompt if you want different styling

---

**Last Updated:** Generated from codebase analysis  
**Version:** 2.0 - Single Comprehensive Prompt
