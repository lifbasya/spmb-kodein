import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";
import { documentService } from "@/lib/services/document.service";

/**
 * DELETE /api/documents/:id
 * Deletes a document by ID — ownership is verified in service layer.
 * Not allowed once application status is ACCEPTED or REJECTED.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id: documentId } = await params;

    if (!documentId) {
      return NextResponse.json(
        { success: false, message: "Document ID tidak valid" },
        { status: 400 },
      );
    }

    await documentService.deleteDocument(session.user.id, documentId);

    return NextResponse.json({
      success: true,
      message: "Dokumen berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Delete document error:", error);

    const isOwnershipError =
      error.message?.includes("tidak ditemukan") ||
      error.message?.includes("bukan milik");

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal menghapus dokumen",
      },
      { status: isOwnershipError ? 403 : 500 },
    );
  }
}
