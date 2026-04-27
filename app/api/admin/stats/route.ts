import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { adminService } from "@/lib/services/admin.service";

export async function GET(_request: NextRequest) {
  try {
    await requireAdmin();
    const stats = await adminService.getStats();

    return NextResponse.json({
      success: true,
      message: "Dashboard stats retrieved",
      data: stats,
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to get stats" },
      { status: error.message === "Unauthorized" ? 401 : error.message.includes("Forbidden") ? 403 : 500 },
    );
  }
}
