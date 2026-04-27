import prisma from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

export const adminService = {
  /**
   * Get all applicants with their documents
   */
  async getApplicants() {
    return await prisma.applicant.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        documents: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Get total statistics for dashboard
   */
  async getStats() {
    const totalApplicants = await prisma.applicant.count();
    const pending = await prisma.applicant.count({
      where: { status: "SUBMITTED" },
    });
    const verified = await prisma.applicant.count({
      where: { status: "VERIFIED" },
    });
    const accepted = await prisma.applicant.count({
      where: { status: "ACCEPTED" },
    });

    return {
      totalApplicants,
      pending,
      verified,
      accepted,
    };
  },

  /**
   * Get detailed applicant information
   */
  async getApplicantDetail(id: string) {
    return await prisma.applicant.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        documents: true,
      },
    });
  },

  /**
   * Start processing an application (SUBMITTED -> PENDING_VERIFICATION)
   */
  async processApplication(applicantId: string) {
    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
    });

    if (!applicant) {
      throw new Error("Pendaftar tidak ditemukan");
    }

    if (applicant.status !== "SUBMITTED") {
      // If already further in flow, ignore
      return applicant;
    }

    return await prisma.applicant.update({
      where: { id: applicantId },
      data: {
        status: "PENDING_VERIFICATION",
      },
    });
  },

  /**
   * Verify an application (PENDING_VERIFICATION -> VERIFIED)
   */
  async verifyApplication(applicantId: string) {
    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
    });

    if (!applicant) {
      throw new Error("Pendaftar tidak ditemukan");
    }

    if (applicant.status !== "PENDING_VERIFICATION") {
      throw new Error(`Status pendaftar saat ini adalah ${applicant.status}. Hanya pendaftar dengan status PENDING_VERIFICATION yang dapat diverifikasi.`);
    }

    return await prisma.applicant.update({
      where: { id: applicantId },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
      },
    });
  },

  /**
   * Make a final decision on an application (VERIFIED -> ACCEPTED / REJECTED)
   */
  async decideApplication(applicantId: string, status: "ACCEPTED" | "REJECTED") {
    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
    });

    if (!applicant) {
      throw new Error("Pendaftar tidak ditemukan");
    }

    if (applicant.status !== "VERIFIED") {
      throw new Error(`Status pendaftar saat ini adalah ${applicant.status}. Hanya pendaftar dengan status VERIFIED yang dapat diberikan keputusan.`);
    }

    return await prisma.applicant.update({
      where: { id: applicantId },
      data: {
        status: status as ApplicationStatus,
        decidedAt: new Date(),
      },
    });
  },
};
