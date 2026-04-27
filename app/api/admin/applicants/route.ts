import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { adminService } from "@/lib/services/admin.service";

export async function GET(_request: NextRequest) {
  try {
    await requireAdmin();
    const applicants = await adminService.getApplicants();

    return NextResponse.json({
      success: true,
      message: "Applicants list retrieved",
      data: applicants,
    });
  } catch (error: any) {
    console.error("Get applicants list error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to get applicants" },
      { status: error.message === "Unauthorized" ? 401 : error.message.includes("Forbidden") ? 403 : 500 },
    );
  }
}
