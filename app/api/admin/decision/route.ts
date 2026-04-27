import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { adminService } from "@/lib/services/admin.service";
import { z } from "zod";

const DecisionSchema = z.object({
  applicantId: z.string().min(1, "Applicant ID is required"),
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

    const applicant = await adminService.decideApplication(
      validation.data.applicantId,
      validation.data.status
    );

    return NextResponse.json({
      success: true,
      message: `Application ${validation.data.status.toLowerCase()} successfully`,
      data: applicant,
    });
  } catch (error: any) {
    console.error("Decide application error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to make decision" },
      { status: error.message === "Unauthorized" ? 401 : error.message.includes("Forbidden") ? 403 : 400 },
    );
  }
}
