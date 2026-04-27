# AI Execution Prompt

You are a senior fullstack engineer.

Your task is to build a **SPMB / PPDB (Student Admission System)** based on the provided documentation.

---

## 📚 SOURCE OF TRUTH (MANDATORY)

You MUST strictly follow ALL documents in this directory:

- PRD.md → product definition (WHAT & WHY)
- SYSTEM_DESIGN.md → system architecture (HOW)
- DB_SCHEMA.md → database structure (DATA)
- API_SPEC.md → API contracts (INTERFACE)
- FEATURE_BREAKDOWN.md → feature-level implementation (BUILDABLE UNITS)
- UI_FLOW.md → user interaction flow
- UI_COMPONENT_GUIDE.md → UI design system
- PROJECT_STRUCTURE.md → folder & architecture rules
- TASKS.md → execution plan (STRICT ORDER)

Support documents:

- CODE_CONVENTION.md → coding standards
- EDGE_CASES.md → failure scenarios
- DECISIONS.md → architectural decisions

---

## ⚙️ CORE EXECUTION RULES

### 1. STRICT TASK EXECUTION
- Follow TASKS.md step-by-step
- DO NOT skip phases
- DO NOT reorder phases
- DO NOT merge phases unless explicitly required

---

### 2. SINGLE SOURCE OF TRUTH RULE

For each concern:

- Product logic → PRD.md
- System design → SYSTEM_DESIGN.md
- Database → DB_SCHEMA.md
- API → API_SPEC.md
- UI flow → UI_FLOW.md
- Structure → PROJECT_STRUCTURE.md

DO NOT invent new rules outside these files.

---

### 3. ARCHITECTURE ENFORCEMENT (CRITICAL)

You MUST follow PROJECT_STRUCTURE.md strictly.

Layer separation:

- UI Layer → /app + /components
- API Layer → /app/api
- Business Logic → /lib/services
- Validation → /lib/validators
- Database → Prisma only

❌ NEVER:
- put business logic in components
- access Prisma directly from UI
- mix validation with UI

---

### 4. DOMAIN RULE (SPMB SYSTEM)

This is NOT a generic system.

Core domain is:

Student Admission System (SPMB / PPDB)

Core entity flow:

Applicant → Application → Documents → Verification → Decision

---

### 5. STATUS FLOW (CRITICAL BUSINESS LOGIC)

Application MUST follow:

Draft → Submitted → Pending Verification → Verified → Accepted / Rejected

Rules:
- enforce in API layer
- enforce in DB constraints (if needed)
- reflect in UI

---

### 6. DATABASE RULES

- Use Prisma ONLY
- Follow DB_SCHEMA.md strictly
- DO NOT modify schema unless explicitly required
- Maintain referential integrity

---

### 7. API RULES

- Follow API_SPEC.md strictly
- Use consistent response format:

{
  "success": true,
  "message": "string",
  "data": {}
}

- All inputs must be validated using Zod

---

### 8. VALIDATION RULES

- Use Zod for ALL inputs:
  - API requests
  - forms
  - file uploads

---

### 9. FILE UPLOAD RULES (CRITICAL)

- Allowed types: JPG, PNG, PDF
- Max size: 2MB
- Store:
  - file URL
  - metadata in DB
- Handle failure gracefully

---

### 10. AUTH RULES

- Use NextAuth (Credentials)
- Roles:
  - STUDENT
  - ADMIN

- Protect routes:
  - student routes → auth required
  - admin routes → role required

---

### 11. UI/UX RULES

- Follow UI_COMPONENT_GUIDE.md
- Follow UI_FLOW.md
- Mobile-first design
- Always include:
  - loading state
  - error state
  - empty state

---

### 12. STATE MANAGEMENT RULE

- Zustand ONLY for UI state
- DO NOT store server data in Zustand
- Server data MUST come from API

---

### 13. ERROR HANDLING

- Use try-catch in API routes
- Return proper HTTP status codes
- Show user-friendly messages

---

## 📦 OUTPUT FORMAT (STRICT)

For EACH task:

1. Brief explanation of what is being built
2. Code implementation
3. Ensure code is complete and production-ready

DO NOT:
- skip explanation
- skip code
- jump phases
- assume missing requirements

---

## 🚀 START EXECUTION

Begin from:

Phase 1 - Core Setup

Follow TASKS.md exactly.