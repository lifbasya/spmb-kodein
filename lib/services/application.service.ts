import prisma from "@/lib/prisma";
import { UpdateApplicationInput } from "@/lib/validators/application.schema";

/**
 * Valid status transitions — enforced at service layer.
 * SYSTEM_DESIGN.md §5: Draft → Submitted → Pending Verification → Verified → Accepted / Rejected
 */
const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["SUBMITTED"],
  SUBMITTED: ["PENDING_VERIFICATION"],
  PENDING_VERIFICATION: ["VERIFIED"],
  VERIFIED: ["ACCEPTED", "REJECTED"],
  ACCEPTED: [],
  REJECTED: [],
};

export function canTransition(from: string, to: string): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export const applicationService = {
  /**
   * GET — Read only. Returns the applicant profile which now contains status.
   */
  async getApplication(userId: string) {
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: {
        documents: true,
      },
    });

    return applicant ?? null;
  },

  /**
   * POST — Idempotent get or create placeholder applicant if missing.
   * Note: This is usually handled by the register API, but kept here for safety.
   */
  async getOrCreateApplication(userId: string) {
    let applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: { documents: true },
    });

    if (!applicant) {
      applicant = await prisma.applicant.create({
        data: {
          userId,
          fullName: "",
          birthPlace: "",
          birthDate: new Date(0),
          gender: "",
          religion: "",
          phoneNumber: "",
          address: "",
          status: "DRAFT",
        },
        include: { documents: true },
      });
    }

    return applicant;
  },

  /**
   * PUT — Update applicant data (incorporates what was Application).
   * Only allowed in DRAFT status.
   */
  async updateApplication(userId: string, data: UpdateApplicationInput) {
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
    });

    if (!applicant) {
      throw new Error("Applicant not found");
    }

    // Business rule: only DRAFT can be updated
    if (applicant.status !== "DRAFT") {
      throw new Error(
        `Cannot update application in status: ${applicant.status}`,
      );
    }

    // Build update payload
    const updatePayload: any = {};
    
    // Identity fields
    if (data.fullName !== undefined) updatePayload.fullName = data.fullName;
    if (data.nisn !== undefined) updatePayload.nisn = data.nisn;
    if (data.birthPlace !== undefined) updatePayload.birthPlace = data.birthPlace;
    if (data.birthDate !== undefined) updatePayload.birthDate = new Date(data.birthDate);
    if (data.gender !== undefined) updatePayload.gender = data.gender;
    if (data.religion !== undefined) updatePayload.religion = data.religion;
    if (data.phoneNumber !== undefined) updatePayload.phoneNumber = data.phoneNumber;
    if (data.address !== undefined) updatePayload.address = data.address;
    
    // School/Legacy Application fields
    if (data.schoolOrigin !== undefined) updatePayload.schoolOrigin = data.schoolOrigin;
    if (data.parentName !== undefined) updatePayload.parentName = data.parentName;
    if (data.parentPhone !== undefined) updatePayload.parentPhone = data.parentPhone;

    if (Object.keys(updatePayload).length > 0) {
      return await prisma.applicant.update({
        where: { id: applicant.id },
        data: updatePayload,
        include: { documents: true },
      });
    }

    return applicant;
  },

  /**
   * POST /submit — Transitions DRAFT → SUBMITTED.
   */
  async submitApplication(userId: string) {
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: { documents: true },
    });

    if (!applicant) {
      throw new Error("Applicant not found");
    }

    // Enforce status transition
    if (!canTransition(applicant.status, "SUBMITTED")) {
      throw new Error(`Cannot submit application in status: ${applicant.status}`);
    }

    // Validate required fields
    if (
      !applicant.fullName ||
      !applicant.birthPlace ||
      !applicant.gender ||
      !applicant.address ||
      !applicant.phoneNumber ||
      !applicant.schoolOrigin ||
      !applicant.parentName ||
      !applicant.parentPhone
    ) {
      throw new Error("Harap lengkapi semua data pendaftaran sebelum submit");
    }

    // Validate mandatory documents
    const hasFamilyCard = applicant.documents.some(d => d.type === "FAMILY_CARD");
    const hasBirthCert = applicant.documents.some(d => d.type === "BIRTH_CERTIFICATE");

    if (!hasFamilyCard || !hasBirthCert) {
      throw new Error("Harap upload Kartu Keluarga dan Akta Kelahiran sebelum submit");
    }

    return await prisma.applicant.update({
      where: { id: applicant.id },
      data: { status: "SUBMITTED" },
    });
  },

  /**
   * Compute completion percentage for student dashboard.
   * Total fields: 10
   */
  async getCompletionStatus(userId: string) {
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: { documents: true },
    });

    if (!applicant) {
      return { percentage: 0, completed: 0, total: 10 };
    }

    let completed = 0;
    const total = 10;

    // Core fields
    if (applicant.fullName) completed++;
    if (applicant.birthPlace) completed++;
    if (applicant.gender) completed++;
    if (applicant.address) completed++;
    if (applicant.phoneNumber) completed++;
    if (applicant.religion) completed++;
    
    // Application fields
    if (applicant.schoolOrigin) completed++;
    if (applicant.parentName) completed++;
    if (applicant.parentPhone) completed++;

    // Documents
    if (applicant.documents.length > 0) completed++;

    return {
      percentage: Math.round((completed / total) * 100),
      completed,
      total,
    };
  },
};
