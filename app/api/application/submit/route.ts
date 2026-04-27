import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";
import { applicationService } from "@/lib/services/application.service";

/**
 * POST /api/application/submit
 * Transitions application status: DRAFT → SUBMITTED
 * Business rules enforced in applicationService.submitApplication:
 *   - All required fields must be filled
 *   - At least one document must be uploaded
 *   - Status must be DRAFT
 */
export async function POST(_request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const application = await applicationService.submitApplication(
      session.user.id,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Aplikasi berhasil disubmit. Tim admin akan segera memverifikasi.",
        data: application,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Submit application error:", error);

    // Business logic errors → 422 Unprocessable Entity
    // (distinct from validation errors 400 and server errors 500)
    const isBusinessError = [
      "Cannot submit",
      "Harap lengkapi",
      "Application not found",
    ].some((msg) => error.message?.includes(msg));

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal submit aplikasi",
      },
      { status: isBusinessError ? 422 : 500 },
    );
  }
}
