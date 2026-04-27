import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { adminService } from "@/lib/services/admin.service";
import { z } from "zod";

const ProcessSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
});

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validation = ProcessSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const application = await adminService.processApplication(validation.data.applicationId);

    return NextResponse.json({
      success: true,
      message: "Application is now being processed",
      data: application,
    });
  } catch (error: any) {
    console.error("Process application error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process application" },
      { status: error.message === "Unauthorized" ? 401 : error.message.includes("Forbidden") ? 403 : 400 },
    );
  }
}
