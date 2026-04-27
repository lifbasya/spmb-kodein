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
   * GET — Read only. Returns null if applicant has no application yet.
   */
  async getApplication(userId: string) {
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: {
        application: {
          include: { documents: true },
        },
      },
    });

    return applicant?.application ?? null;
  },

  /**
   * POST — Idempotent create. Returns existing application or creates a DRAFT.
   */
  async getOrCreateApplication(userId: string) {
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: { application: true },
    });

    if (!applicant) {
      throw new Error("Applicant profile not found");
    }

    if (applicant.application) {
      return applicant.application;
    }

    // Create new DRAFT application
    const application = await prisma.application.create({
      data: {
        applicantId: applicant.id,
        status: "DRAFT",
      },
    });

    return application;
  },

  /**
   * PUT — Update application + applicant data. Only allowed in DRAFT status.
   * Fixes: properly merges only provided fields (no undefined overwrite).
   */
  async updateApplication(userId: string, data: UpdateApplicationInput) {
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: { application: true },
    });

    if (!applicant) {
      throw new Error("Applicant not found");
    }

    if (!applicant.application) {
      throw new Error("Application not found");
    }

    // Business rule: only DRAFT can be updated
    if (applicant.application.status !== "DRAFT") {
      throw new Error(
        `Cannot update application in status: ${applicant.application.status}`,
      );
    }

    // Build applicant update payload — only include fields that were provided
    const applicantUpdate: Record<string, unknown> = {};
    if (data.fullName !== undefined) applicantUpdate.fullName = data.fullName;
    if (data.nisn !== undefined) applicantUpdate.nisn = data.nisn;
    if (data.birthPlace !== undefined)
      applicantUpdate.birthPlace = data.birthPlace;
    if (data.birthDate !== undefined)
      applicantUpdate.birthDate = new Date(data.birthDate);
    if (data.gender !== undefined) applicantUpdate.gender = data.gender;
    if (data.address !== undefined) applicantUpdate.address = data.address;
    if (data.phone !== undefined) applicantUpdate.phone = data.phone;

    if (Object.keys(applicantUpdate).length > 0) {
      await prisma.applicant.update({
        where: { id: applicant.id },
        data: applicantUpdate,
      });
    }

    // Build application update payload — only include fields that were provided
    const applicationUpdate: Record<string, unknown> = {};
    if (data.schoolOrigin !== undefined)
      applicationUpdate.schoolOrigin = data.schoolOrigin;
    if (data.parentName !== undefined)
      applicationUpdate.parentName = data.parentName;
    if (data.parentPhone !== undefined)
      applicationUpdate.parentPhone = data.parentPhone;

    if (Object.keys(applicationUpdate).length > 0) {
      await prisma.application.update({
        where: { id: applicant.application.id },
        data: applicationUpdate,
      });
    }

    return this.getApplication(userId);
  },

  /**
   * POST /submit — Transitions DRAFT → SUBMITTED.
   * Enforces: required fields + at least one document + valid status.
   */
  async submitApplication(userId: string) {
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: {
        application: {
          include: { documents: true },
        },
      },
    });

    if (!applicant || !applicant.application) {
      throw new Error("Application not found");
    }

    const app = applicant.application;

    // Enforce status transition
    if (!canTransition(app.status, "SUBMITTED")) {
      throw new Error(
        `Cannot submit application in status: ${app.status}`,
      );
    }

    // Validate required applicant fields
    if (
      !applicant.fullName ||
      !applicant.birthPlace ||
      !applicant.birthDate ||
      !applicant.gender ||
      !applicant.address ||
      !applicant.phone
    ) {
      throw new Error(
        "Harap lengkapi semua data pribadi sebelum submit",
      );
    }

    // Validate required application fields
    if (!app.schoolOrigin || !app.parentName || !app.parentPhone) {
      throw new Error(
        "Harap lengkapi data aplikasi (asal sekolah, nama orang tua, telepon orang tua)",
      );
    }

    // Validate mandatory documents before submit
    const hasFamilyCard = app.documents.some(d => d.type === "FAMILY_CARD");
    const hasBirthCert = app.documents.some(d => d.type === "BIRTH_CERTIFICATE");

    if (!hasFamilyCard || !hasBirthCert) {
      throw new Error(
        "Harap upload Kartu Keluarga dan Akta Kelahiran sebelum submit pendaftaran",
      );
    }

    const updated = await prisma.application.update({
      where: { id: app.id },
      data: { status: "SUBMITTED" },
    });

    return updated;
  },

  /**
   * Compute completion percentage for student dashboard.
   * Total fields: 6 applicant + 3 application + 1 documents = 10
   */
  async getCompletionStatus(userId: string) {
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: {
        application: {
          include: { documents: true },
        },
      },
    });

    if (!applicant?.application) {
      return { percentage: 0, completed: 0, total: 10 };
    }

    let completed = 0;
    const total = 10;

    // Applicant fields (6)
    if (applicant.fullName) completed++;
    if (applicant.birthPlace) completed++;
    if (applicant.birthDate) completed++;
    if (applicant.gender) completed++;
    if (applicant.address) completed++;
    if (applicant.phone) completed++;

    // Application fields (3)
    if (applicant.application.schoolOrigin) completed++;
    if (applicant.application.parentName) completed++;
    if (applicant.application.parentPhone) completed++;

    // Documents (1)
    if (applicant.application.documents.length > 0) completed++;

    return {
      percentage: Math.round((completed / total) * 100),
      completed,
      total,
    };
  },
};
