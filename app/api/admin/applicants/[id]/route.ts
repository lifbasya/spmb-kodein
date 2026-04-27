import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { adminService } from "@/lib/services/admin.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const applicant = await adminService.getApplicantDetail(id);

    if (!applicant) {
      return NextResponse.json(
        { success: false, message: "Applicant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Applicant detail retrieved",
      data: applicant,
    });
  } catch (error: any) {
    console.error("Get applicant detail error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to get applicant detail" },
      { status: error.message === "Unauthorized" ? 401 : error.message.includes("Forbidden") ? 403 : 500 },
    );
  }
}
