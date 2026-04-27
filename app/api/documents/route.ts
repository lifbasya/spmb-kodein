import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";
import { documentService } from "@/lib/services/document.service";
import { DocumentTypeEnum } from "@/lib/validators/document.schema";


/**
 * GET /api/documents
 * Returns all documents uploaded by the current user's application.
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const result = await documentService.getDocuments(session.user.id);

    return NextResponse.json({
      success: true,
      message: "Documents retrieved",
      data: result,
    });
  } catch (error: any) {
    console.error("Get documents error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data dokumen" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/documents
 * Upload a document file (multipart/form-data).
 *
 * Body (FormData):
 *   - file: File
 *   - type: DocumentType ("FAMILY_CARD" | "BIRTH_CERTIFICATE" | "REPORT_CARD" | "PHOTO")
 *
 * Business rules enforced in documentService.uploadDocument:
 *   - Max 2 MB
 *   - Allowed types: JPG, PNG, PDF
 *   - Re-upload replaces existing document of same type
 *   - Locked after ACCEPTED / REJECTED
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Parse multipart form
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type");

    // Validate presence
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "File tidak ditemukan dalam request" },
        { status: 400 },
      );
    }

    // Validate document type using Zod
    const typeValidation = DocumentTypeEnum.safeParse(type);
    if (!typeValidation.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Tipe dokumen tidak valid. Pilih salah satu: FAMILY_CARD, BIRTH_CERTIFICATE, REPORT_CARD, PHOTO`,
        },
        { status: 400 },
      );
    }

    const document = await documentService.uploadDocument(
      session.user.id,
      file,
      typeValidation.data,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Dokumen berhasil diupload",
        data: document,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Upload document error:", error);

    const isBusinessError = [
      "Format file",
      "Ukuran file",
      "tidak dapat",
      "tidak ditemukan",
      "Harap isi formulir",
    ].some((msg) => error.message?.includes(msg));

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal mengupload dokumen",
      },
      { status: isBusinessError ? 422 : 500 },
    );
  }
}
