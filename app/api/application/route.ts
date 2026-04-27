import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";
import { applicationService } from "@/lib/services/application.service";
import { UpdateApplicationSchema } from "@/lib/validators/application.schema";

export async function GET(request: NextRequest) {
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
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update application",
      },
      { status: 400 },
    );
  }
}
