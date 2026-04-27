# 📄 FEATURE_BREAKDOWN.md — SPMB / PPDB System (MVP)

## 1. 🎯 Purpose

Break down all features into **implementable units** for development.

---

## 2. 🌐 Landing Page Features

### LP-01: Hero Section

* Display school name
* Display tagline
* CTA buttons:

  * Register
  * Login

---

### LP-02: School Advantages

* Static content (3–5 points)

---

### LP-03: Registration Flow Section

* Visual steps (static)

---

### LP-04: Admission Schedule

* Static date display

---

### LP-05: Contact Section

* Display:

  * Address
  * WhatsApp
  * Map embed

---

## 3. 🔐 Authentication Features

### AUTH-01: User Registration

* Input:

  * Email
  * Password
  * Confirm password
* Validation:

  * Email format
  * Password match
* Save user to database
* Redirect to dashboard

---

### AUTH-02: User Login

* Input:

  * Email
  * Password
* Validate credentials
* Create session

---

### AUTH-03: Role Handling

* Assign role:

  * Student (default)
  * Admin (manual)

---

### AUTH-04: Route Protection

* Protect:

  * `/dashboard`
  * `/application`
  * `/documents`
* Admin-only routes:

  * `/admin/*`

---

## 4. 📝 Application Features

### APP-01: Create Application (Draft)

* Auto-create when user first opens form

---

### APP-02: Update Application

* Save:

  * Personal data
  * Address
  * School origin
  * Parent data

---

### APP-03: Form Validation

* Required fields
* Format validation

---

### APP-04: Submit Application

* Change status:

  * Draft → Submitted

---

## 5. 📂 Document Features

### DOC-01: Upload Document

* Upload:

  * Family Card
  * Birth Certificate
  * Report Card
  * Photo

---

### DOC-02: File Validation

* Type: JPG / PDF
* Size limit

---

### DOC-03: Store Metadata

* File URL
* File type
* Uploaded time

---

### DOC-04: Replace Document

* Allow re-upload

---

## 6. 📊 Student Dashboard Features

### DASH-01: Show Application Status

* Display current status

---

### DASH-02: Show Completion Progress

* Percentage of completed data

---

### DASH-03: Navigation Shortcuts

* Go to:

  * Application
  * Documents
  * Status

---

## 7. 🧑‍💻 Admin Features

### ADM-01: View Applicants List

* Table view
* Pagination

---

### ADM-02: Search & Filter

* By:

  * Name
  * Status

---

### ADM-03: View Applicant Detail

* Show:

  * Personal data
  * Documents

---

### ADM-04: Verify Application

* Approve / Reject verification
* Change status:

  * Submitted → Pending Verification → Verified

---

### ADM-05: Final Decision

* Accept / Reject
* Update status

---

## 8. 🔄 Status Management Features

### STAT-01: Status Enum

* Draft
* Submitted
* Pending Verification
* Verified
* Accepted
* Rejected

---

### STAT-02: Status Transition Rules

* Only allow valid transitions
* Prevent invalid state changes

---

## 9. 📥 Export Features

### EXP-01: Export Applicants Data

* Export to Excel
* Include:

  * Personal data
  * Status

---

## 10. ⚠️ System Features

### SYS-01: Error Handling

* Standard API response

---

### SYS-02: Loading State

* Show loading indicator

---

### SYS-03: Empty State

* “No data available”

---

## 11. 🚀 MVP Priority

### 🔥 Must Have

* Authentication
* Application form
* Document upload
* Admin verification
* Status tracking

---

### ⚡ Nice to Have

* Export data
* Search & filter
* Progress bar

---

## 12. 🧭 Development Strategy

Recommended order:

1. Auth
2. Application
3. Documents
4. Admin verification
5. Status system
6. Landing page (can be parallel)