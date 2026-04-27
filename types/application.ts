/**
 * Application status flow (enforced in service layer):
 * DRAFT → SUBMITTED → PENDING_VERIFICATION → VERIFIED → ACCEPTED | REJECTED
 */
export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "ACCEPTED"
  | "REJECTED";

export type Gender = "MALE" | "FEMALE";

export type DocumentType =
  | "FAMILY_CARD"
  | "BIRTH_CERTIFICATE"
  | "REPORT_CARD"
  | "PHOTO";

export interface Applicant {
  id: string;
  userId: string;
  fullName: string;
  nisn?: string;
  birthPlace: string;
  birthDate: Date | string;
  gender: string;
  address: string;
  phone: string;
  createdAt: Date | string;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  type: DocumentType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: Date | string;
}

export interface Application {
  id: string;
  applicantId: string;
  status: ApplicationStatus;
  // Optional until user fills the form (DRAFT state)
  schoolOrigin?: string | null;
  parentName?: string | null;
  parentPhone?: string | null;
  // Set by admin actions
  verifiedAt?: Date | string | null;
  decidedAt?: Date | string | null;
  createdAt: Date | string;
  documents?: ApplicationDocument[];
}
