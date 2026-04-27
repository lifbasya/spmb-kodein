import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";
import { applicationService } from "@/lib/services/application.service";
import { UpdateApplicationSchema } from "@/lib/validators/application.schema";

/**
 * GET /api/application
 * Read-only: get current user's application.
 * Does NOT create a new application.
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

    const application = await applicationService.getApplication(
      session.user.id,
    );

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application retrieved",
      data: application,
    });
  } catch (error: any) {
    console.error("Get application error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get application",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/application
 * Create or get existing application (idempotent).
 * Called once after registration.
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

    const application = await applicationService.getOrCreateApplication(
      session.user.id,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Application ready",
        data: application,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Create application error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create application",
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/application
 * Update application data (only when status is DRAFT).
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate input
    const validation = UpdateApplicationSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.flatten();
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          data: errors,
        },
        { status: 400 },
      );
    }

    const application = await applicationService.updateApplication(
      session.user.id,
      validation.data,
    );

    return NextResponse.json({
      success: true,
      message: "Application updated successfully",
      data: application,
    });
  } catch (error: any) {
    console.error("Update application error:", error);
    // Distinguish business rule errors (400) from server errors (500)
    const isBusinessError = [
      "Cannot update",
      "Applicant not found",
      "Application not found",
    ].some((msg) => error.message?.includes(msg));
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update application",
      },
      { status: isBusinessError ? 400 : 500 },
    );
  }
}
