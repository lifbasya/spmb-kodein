export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "ACCEPTED"
  | "REJECTED";

export interface Applicant {
  id: string;
  userId: string;
  fullName: string;
  nisn?: string;
  birthPlace: string;
  birthDate: Date;
  gender: string;
  address: string;
  phone: string;
  createdAt: Date;
}

export interface Application {
  id: string;
  applicantId: string;
  status: ApplicationStatus;
  schoolOrigin?: string;
  parentName?: string;
  parentPhone?: string;
  verifiedAt?: Date;
  decidedAt?: Date;
  createdAt: Date;
}
