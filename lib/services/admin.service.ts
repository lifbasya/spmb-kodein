import prisma from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

export const adminService = {
  /**
   * Get all applicants with their applications and documents
   */
  async getApplicants() {
    return await prisma.applicant.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        application: {
          include: {
            documents: true,
          },
        },
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
    const pending = await prisma.application.count({
      where: { status: "SUBMITTED" },
    });
    const verified = await prisma.application.count({
      where: { status: "VERIFIED" },
    });
    const accepted = await prisma.application.count({
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
        application: {
          include: {
            documents: true,
          },
        },
      },
    });
  },

  /**
   * Start processing an application (SUBMITTED -> PENDING_VERIFICATION)
   */
  async processApplication(applicationId: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error("Aplikasi tidak ditemukan");
    }

    if (application.status !== "SUBMITTED") {
      // If already further in flow, ignore
      return application;
    }

    return await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: "PENDING_VERIFICATION",
      },
    });
  },

  /**
   * Verify an application (PENDING_VERIFICATION -> VERIFIED)
   */
  async verifyApplication(applicationId: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error("Aplikasi tidak ditemukan");
    }

    if (application.status !== "PENDING_VERIFICATION") {
      throw new Error(`Status aplikasi saat ini adalah ${application.status}. Hanya aplikasi dengan status PENDING_VERIFICATION yang dapat diverifikasi.`);
    }

    return await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
      },
    });
  },

  /**
   * Make a final decision on an application (VERIFIED -> ACCEPTED / REJECTED)
   */
  async decideApplication(applicationId: string, status: "ACCEPTED" | "REJECTED") {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new Error("Aplikasi tidak ditemukan");
    }

    if (application.status !== "VERIFIED") {
      throw new Error(`Status aplikasi saat ini adalah ${application.status}. Hanya aplikasi dengan status VERIFIED yang dapat diberikan keputusan.`);
    }

    return await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: status as ApplicationStatus,
        decidedAt: new Date(),
      },
    });
  },
};
