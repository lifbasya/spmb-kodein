import prisma from '@/lib/prisma';
import { CreateApplicationInput, UpdateApplicationInput } from '@/lib/validators/application.schema';
import { ApplicationStatus } from '@/types/application';

export const applicationService = {
  /**
   * Get user's application
   */
  async getApplication(userId: string) {
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: {
        application: true,
      },
    });

    return applicant?.application;
  },

  /**
   * Create or get user's application
   */
  async getOrCreateApplication(userId: string) {
    let applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: { application: true },
    });

    if (!applicant) {
      throw new Error('Applicant profile not found');
    }

    if (applicant.application) {
      return applicant.application;
    }

    // Create new application
    const application = await prisma.application.create({
      data: {
        applicantId: applicant.id,
        status: 'DRAFT',
      },
    });

    return application;
  },

  /**
   * Update application data
   */
  async updateApplication(
    userId: string,
    data: UpdateApplicationInput
  ) {
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: { application: true },
    });

    if (!applicant) {
      throw new Error('Applicant not found');
    }

    if (!applicant.application) {
      throw new Error('Application not found');
    }

    // Only allow update if status is DRAFT
    if (applicant.application.status !== 'DRAFT') {
      throw new Error('Cannot update application that has been submitted');
    }

    // Update applicant info
    if (Object.keys(data).length > 0) {
      await prisma.applicant.update({
        where: { id: applicant.id },
        data: {
          fullName: data.fullName || applicant.fullName,
          nisn: data.nisn || applicant.nisn,
          birthPlace: data.birthPlace || applicant.birthPlace,
          birthDate: data.birthDate ? new Date(data.birthDate) : applicant.birthDate,
          gender: data.gender || applicant.gender,
          address: data.address || applicant.address,
          phone: data.phone || applicant.phone,
        },
      });

      // Update application info
      await prisma.application.update({
        where: { id: applicant.application.id },
        data: {
          schoolOrigin: data.schoolOrigin,
          parentName: data.parentName,
          parentPhone: data.parentPhone,
        },
      });
    }

    return this.getApplication(userId);
  },

  /**
   * Submit application
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
      throw new Error('Application not found');
    }

    const app = applicant.application;

    // Validate status
    if (app.status !== 'DRAFT') {
      throw new Error(`Cannot submit application in ${app.status} status`);
    }

    // Validate required fields
    if (!applicant.fullName || !applicant.birthPlace || !applicant.birthDate || !applicant.gender || !applicant.address || !applicant.phone) {
      throw new Error('Please complete all personal information');
    }

    if (!app.schoolOrigin || !app.parentName || !app.parentPhone) {
      throw new Error('Please complete all application information');
    }

    // Validate documents (require at least one)
    if (app.documents.length === 0) {
      throw new Error('Please upload at least one document');
    }

    // Update status to SUBMITTED
    const updated = await prisma.application.update({
      where: { id: app.id },
      data: {
        status: 'SUBMITTED',
      },
    });

    return updated;
  },

  /**
   * Check completion percentage
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
      return { percentage: 0, completed: 0, total: 8 };
    }

    let completed = 0;
    const total = 8;

    // Check applicant fields (5 items)
    if (applicant.fullName) completed++;
    if (applicant.birthPlace) completed++;
    if (applicant.birthDate) completed++;
    if (applicant.gender) completed++;
    if (applicant.address) completed++;
    if (applicant.phone) completed++;

    // Check application fields (2 items)
    if (applicant.application.schoolOrigin) completed++;
    if (applicant.application.parentName) completed++;
    if (applicant.application.parentPhone) completed++;

    // Check documents
    if (applicant.application.documents.length > 0) completed++;

    return {
      percentage: Math.round((completed / total) * 100),
      completed,
      total: total + 1, // Including documents
    };
  },
};
