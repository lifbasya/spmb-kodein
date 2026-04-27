import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-helpers";
import { applicationService } from "@/lib/services/application.service";

export async function POST(request: NextRequest) {
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
        message: "Application submitted successfully",
        data: application,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Submit application error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to submit application",
      },
      { status: 400 },
    );
  }
}
