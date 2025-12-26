# Demo Data Creation Guide

This guide helps you create sample reports for demonstration purposes.

## Option 1: Manual Creation via UI

1. Go to `/submit` in your browser
2. Submit reports with the following sample data:

### Report 1: Safety Hazard
- **Category:** Safety
- **Urgency:** High
- **Description:** "Exposed electrical wiring in the cafeteria near the main entrance. This is a serious safety hazard that could cause electrical shock. Located on the left wall, approximately 2 feet from the ground."
- **Evidence:** (Optional - upload a relevant image if you have one)

### Report 2: Facility Issue
- **Category:** Facility Issue
- **Urgency:** Medium
- **Description:** "Air conditioning unit in Room 205 has been broken for 3 weeks. The room temperature reaches 85°F during afternoon classes, making it very uncomfortable for students and staff."
- **Evidence:** (Optional)

### Report 3: Harassment
- **Category:** Harassment
- **Urgency:** High
- **Description:** "I have witnessed inappropriate behavior from a supervisor towards junior staff members. This includes belittling comments and public criticism that creates a hostile work environment."
- **Evidence:** (Optional)

### Report 4: Suggestion
- **Category:** Suggestion
- **Urgency:** Low
- **Description:** "I suggest installing more water fountains on the third floor. Currently, there's only one fountain for the entire floor, which causes long lines during break times."
- **Evidence:** (Optional)

## Option 2: Firebase Console (Advanced)

You can also manually create documents in Firestore Console, but using the UI is recommended to ensure proper data structure.

## After Creating Demo Data

1. Log in as admin at `/admin/login`
2. Go to the dashboard to see all reports
3. Test filtering by Status and Urgency
4. Open individual reports and test:
   - Status updates
   - Sending replies
   - Viewing evidence

## Tips for Demo

- Create reports with different statuses (New, In Progress, Resolved)
- Create reports with different urgency levels
- Add some reports with evidence and some without
- As admin, update some statuses and send replies
- Test tracking reports using the access codes

