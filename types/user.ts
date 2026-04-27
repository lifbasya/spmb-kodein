import type { Applicant } from "./application";

export type Role = "STUDENT" | "ADMIN";

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface UserWithApplicant extends User {
  applicant?: Applicant;
}
