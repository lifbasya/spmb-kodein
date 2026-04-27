import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { adminService } from "@/lib/services/admin.service";
import { z } from "zod";

const DecisionSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  status: z.enum(["ACCEPTED", "REJECTED"], {
    message: "Status must be ACCEPTED or REJECTED",
  }),
});

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validation = DecisionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const application = await adminService.decideApplication(
      validation.data.applicationId,
      validation.data.status
    );

    return NextResponse.json({
      success: true,
      message: `Application ${validation.data.status.toLowerCase()} successfully`,
      data: application,
    });
  } catch (error: any) {
    console.error("Decide application error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to make decision" },
      { status: error.message === "Unauthorized" ? 401 : error.message.includes("Forbidden") ? 403 : 400 },
    );
  }
}
