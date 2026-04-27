import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import prisma from "@/lib/prisma";

// Allowed MIME types per PRD.md §8 and SYSTEM_DESIGN.md §7
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

// Storage: local filesystem under /public/uploads (MVP)
// Future: replace saveToLocal() with cloud provider (S3/Supabase)
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

async function saveToLocal(
  file: File,
  applicationId: string,
): Promise<{ fileUrl: string; fileName: string; fileSize: number }> {
  await ensureUploadDir();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Sanitize filename — prevent path traversal
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const safeName = `${applicationId}_${Date.now()}.${extension}`;
  const filePath = path.join(UPLOAD_DIR, safeName);

  await writeFile(filePath, buffer);

  return {
    fileUrl: `/uploads/${safeName}`,
    fileName: file.name,
    fileSize: file.size,
  };
}

async function deleteFromLocal(fileUrl: string) {
  try {
    // fileUrl is like /uploads/xxx.pdf
    const filename = fileUrl.split("/").pop();
    if (!filename) return;
    const filePath = path.join(UPLOAD_DIR, filename);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (err) {
    // Log but don't throw — DB record cleanup takes priority
    console.warn("File delete warning:", err);
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
        application: {
          include: { documents: true },
        },
      },
    });

    return {
      documents: applicant?.application?.documents ?? [],
      status: applicant?.application?.status ?? "DRAFT",
    };
  },

  /**
   * Upload a document file and store its metadata in the DB.
   * Business rules (from EDGE_CASES.md + PRD.md):
   *   - File type must be JPG, PNG, or PDF
   *   - File size max 2 MB
   *   - If same DocumentType already exists, replace it (re-upload)
   */
  async uploadDocument(
    userId: string,
    file: File,
    documentType: string,
  ) {
    // ─── 1. File validation ───────────────────────────────────────────────
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error(
        "Format file tidak valid. Gunakan JPG, PNG, atau PDF.",
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Ukuran file melebihi batas 2 MB.");
    }

    // ─── 2. Fetch applicant + application ────────────────────────────────
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: {
        application: {
          include: { documents: true },
        },
      },
    });

    if (!applicant) {
      throw new Error("Data pendaftar tidak ditemukan.");
    }

    const application = applicant.application;
    if (!application) {
      throw new Error("Aplikasi tidak ditemukan. Harap isi formulir terlebih dahulu.");
    }

    // Documents can only be uploaded while application is in DRAFT status
    // Once submitted, the application is locked for the student.
    if (application.status !== "DRAFT") {
      throw new Error(
        `Tidak dapat mengunggah dokumen. Aplikasi sudah dalam status: ${application.status}`,
      );
    }

    // ─── 3. Save file to local storage ───────────────────────────────────
    const { fileUrl, fileName, fileSize } = await saveToLocal(
      file,
      application.id,
    );

    // ─── 4. Replace existing document of same type (re-upload) ───────────
    const existing = application.documents.find(
      (d) => d.type === documentType,
    );

    if (existing) {
      // Delete old file from disk
      await deleteFromLocal(existing.fileUrl);

      // Update DB record
      const updated = await prisma.document.update({
        where: { id: existing.id },
        data: { fileUrl, fileName, fileSize },
      });
      return updated;
    }

    // ─── 5. Create new document record ───────────────────────────────────
    const document = await prisma.document.create({
      data: {
        applicationId: application.id,
        // @ts-ignore — type is validated as DocumentType string by Zod upstream
        type: documentType,
        fileUrl,
        fileName,
        fileSize,
      },
    });

    return document;
  },

  /**
   * Delete a document by ID.
   * Only the owner can delete their own document.
   */
  async deleteDocument(userId: string, documentId: string) {
    // Verify ownership — find the document through the application chain
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      include: {
        application: {
          include: { documents: true },
        },
      },
    });

    const document = applicant?.application?.documents.find(
      (d) => d.id === documentId,
    );

    if (!document) {
      throw new Error("Dokumen tidak ditemukan atau bukan milik Anda.");
    }

    const status = applicant?.application?.status;
    if (status !== "DRAFT") {
      throw new Error(
        `Tidak dapat menghapus dokumen. Aplikasi sudah dalam status: ${status}`,
      );
    }

    // Delete from disk then DB
    await deleteFromLocal(document.fileUrl);
    await prisma.document.delete({ where: { id: documentId } });

    return { deleted: true };
  },
};
