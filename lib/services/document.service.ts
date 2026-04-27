import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { DocumentType } from "@prisma/client";

// Allowed MIME types per PRD.md §8 and SYSTEM_DESIGN.md §7
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

/**
 * Upload file buffer to Cloudinary
 */
async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<{ url: string; publicId: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `spmb/${folder}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload failed"));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete file from Cloudinary
 */
async function deleteFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn("Cloudinary delete warning:", err);
  }
}

export const documentService = {
  /**
   * Get all documents for the authenticated user's application.
   */
  async getDocuments(userId: string) {
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: {
        documents: true,
      },
    });

    return {
      documents: applicant?.documents ?? [],
      status: applicant?.status ?? "DRAFT",
    };
  },

  /**
   * Upload a document file to Cloudinary and store metadata.
   */
  async uploadDocument(
    userId: string,
    file: File,
    documentType: string
  ) {
    // 1. Validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error("Format file tidak valid. Gunakan JPG, PNG, atau PDF.");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Ukuran file melebihi batas 2 MB.");
    }

    // 2. Fetch data (Now from consolidated Applicant model)
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: {
        documents: true,
      },
    });

    if (!applicant) {
      throw new Error("Pendaftar tidak ditemukan. Harap isi formulir terlebih dahulu.");
    }

    // 3. Status Check (Applicant now holds status)
    if (applicant.status !== "DRAFT") {
      throw new Error(`Tidak dapat mengunggah dokumen. Aplikasi dalam status: ${applicant.status}`);
    }

    // 4. Upload to Cloudinary
    const { url, publicId } = await uploadToCloudinary(file, applicant.id);

    // 5. Replace existing if same type
    const existing = applicant.documents.find((d) => d.type === documentType);

    if (existing) {
      if (existing.cloudId) {
        await deleteFromCloudinary(existing.cloudId);
      }
      return await prisma.document.update({
        where: { id: existing.id },
        data: {
          fileUrl: url,
          fileName: file.name,
          fileSize: file.size,
          cloudId: publicId,
        },
      });
    }

    // 6. Create new record (Attached to applicantId)
    return await prisma.document.create({
      data: {
        applicantId: applicant.id,
        type: documentType as DocumentType,
        fileUrl: url,
        fileName: file.name,
        fileSize: file.size,
        cloudId: publicId,
      },
    });
  },

  /**
   * Delete document by ID
   */
  async deleteDocument(userId: string, documentId: string) {
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: {
        documents: true,
      },
    });

    const document = applicant?.documents.find((d) => d.id === documentId);

    if (!document) {
      throw new Error("Dokumen tidak ditemukan atau bukan milik Anda.");
    }

    if (applicant?.status !== "DRAFT") {
      throw new Error(`Tidak dapat menghapus dokumen. Aplikasi dalam status: ${applicant?.status}`);
    }

    // Delete from Cloudinary
    if (document.cloudId) {
      await deleteFromCloudinary(document.cloudId);
    }

    // Delete from DB
    await prisma.document.delete({ where: { id: documentId } });

    return { success: true };
  },
};
