import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const applicant = await prisma.applicant.findUnique({
      where: { userId: session.user.id },
      include: { application: true },
    });

    if (!applicant) {
      return NextResponse.json(
        { success: false, message: 'Applicant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Applicant retrieved',
      data: applicant,
    });
  } catch (error: any) {
    console.error('Get applicant error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get applicant' },
      { status: 500 }
    );
  }
}
