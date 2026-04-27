# 📄 UI_FLOW.md — SPMB / PPDB System (MVP)

## 1. 🎯 Purpose

This document describes the user interface flow and navigation of the SPMB system, including:

* Landing page (marketing)
* Student flow (application process)
* Admin flow (management)

---

## 2. 🌐 Global Navigation

### Public (Not Logged In)

* Landing Page (`/`)
* Register (`/register`)
* Login (`/login`)

### Student (Authenticated)

* Dashboard (`/dashboard`)
* Application Form (`/application`)
* Documents (`/documents`)
* Status (`/status`)

### Admin

* Admin Dashboard (`/admin`)
* Applicants (`/admin/applicants`)
* Applicant Detail (`/admin/applicants/:id`)

---

## 3. 🧭 Landing Page Flow

```
Landing Page (/)
   ↓
[Click "Register"] → /register
   ↓
[Click "Login"] → /login
```

---

## 4. 🧑‍🎓 Student Flow (End-to-End)

### 4.1 Registration Flow

```
Register Page (/register)
   ↓
Input:
- Email
- Password
- Confirm Password
   ↓
[Submit]
   ↓
Redirect → Dashboard
```

---

### 4.2 Login Flow

```
Login Page (/login)
   ↓
Input:
- Email
- Password
   ↓
[Login]
   ↓
Redirect → Dashboard
```

---

### 4.3 Dashboard Flow

```
Dashboard (/dashboard)
   ↓
Display:
- Application Status
- Completion Progress
   ↓
Actions:
[Complete Application] → /application
[Upload Documents] → /documents
[View Status] → /status
```

---

### 4.4 Application Form Flow

```
Application Page (/application)
   ↓
Sections:
1. Personal Data
2. Address
3. School Origin
4. Parent Data
   ↓
Actions:
[Save Draft]
[Next Section]
[Submit Final]
   ↓
If Submit:
→ Status = "Pending Verification"
→ Redirect to /status
```

---

### 4.5 Document Upload Flow

```
Documents Page (/documents)
   ↓
Upload:
- Family Card
- Birth Certificate
- Report Card
- Photo
   ↓
Validation:
- File type
- File size
   ↓
[Save]
   ↓
Status updated
```

---

### 4.6 Status Page Flow

```
Status Page (/status)
   ↓
Display:
- Draft
- Pending Verification
- Accepted
- Rejected
   ↓
Optional:
[Back to Dashboard]
```

---

## 5. 🧑‍💻 Admin Flow

### 5.1 Admin Login

```
Login Page (/login)
   ↓
(Admin credentials)
   ↓
Redirect → /admin
```

---

### 5.2 Admin Dashboard

```
Admin Dashboard (/admin)
   ↓
Display:
- Total applicants
- Pending verification
- Accepted / Rejected stats
   ↓
[View Applicants] → /admin/applicants
```

---

### 5.3 Applicants List

```
Applicants Page (/admin/applicants)
   ↓
Features:
- Table list
- Search
- Filter (status)
   ↓
[Click Applicant]
   ↓
→ /admin/applicants/:id
```

---

### 5.4 Applicant Detail

```
Applicant Detail (/admin/applicants/:id)
   ↓
Display:
- Personal data
- Documents preview
   ↓
Actions:
[Approve]
[Reject]
   ↓
Set status:
- Verified / Not Verified
   ↓
Final Decision:
[Accept]
[Reject]
```

---

## 6. 🔄 Status Flow (Core Logic)

```
Draft
   ↓
Submitted
   ↓
Pending Verification
   ↓
Verified
   ↓
Accepted / Rejected
```

---

## 7. ⚠️ Edge Cases

### 7.1 Incomplete Data

* User cannot submit final form
* Show validation messages

---

### 7.2 Missing Documents

* Status remains "Draft" or "Incomplete"

---

### 7.3 Admin Rejects Application

* Status → Rejected
* Optional: Add rejection note

---

### 7.4 Session Expired

* Redirect user to login page

---

## 8. 📱 UX Notes (Important)

* Use **step-by-step forms** (avoid long single-page forms)
* Always show:

  * Progress bar
  * Save draft option
* Clear CTA buttons:

  * “Next”
  * “Submit”
* Use simple, parent-friendly language

---

## 9. 🎯 MVP Simplification Rules

* No complex branching flows
* No advanced workflow engine
* Keep navigation simple and flat

---

## 10. 🚀 Future Enhancements (Not in MVP)

* Online test flow
* Payment flow
* Notification system
* Real-time updates

---

## 11. 💡 Developer Notes

* Protect routes:

  * Student routes → require authentication
  * Admin routes → require role-based access
* Use consistent status enums
* Centralize validation logic