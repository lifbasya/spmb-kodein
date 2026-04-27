import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { RegisterSchema } from "@/lib/validators/auth.schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.flatten();
      return NextResponse.json(
        {
          success: false,
          message: "Validasi gagal",
          data: errors,
        },
        { status: 400 },
      );
    }

    const { 
      email, 
      password, 
      fullName, 
      nisn, 
      birthPlace, 
      birthDate, 
      gender, 
      religion,
      address, 
      phone, 
      schoolOrigin, 
      parentName, 
      parentPhone,
      documents 
    } = validation.data;

    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah terdaftar",
        },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Atomic: create User + Applicant in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "STUDENT",
        },
      });

      const applicant = await tx.applicant.create({
        data: {
          userId: user.id,
          fullName,
          nisn,
          birthPlace,
          birthDate: new Date(birthDate),
          gender,
          religion,
          address,
          phoneNumber: phone,
          schoolOrigin,
          parentName,
          parentPhone,
          status: "SUBMITTED", // Langsung SUBMITTED karena data sudah lengkap
          documents: {
            create: documents?.map(doc => ({
              type: doc.type as any,
              fileUrl: doc.fileUrl,
              fileName: doc.fileName,
              fileSize: 0,
              cloudId: doc.cloudId,
            })) || [],
          },
        },
      });

      return { user, applicant };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pendaftaran berhasil disimpan. Akun Anda telah dibuat.",
        data: { user: { email: result.user.email }, applicantId: result.applicant.id },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Terjadi kesalahan pada server",
      },
      { status: 500 },
    );
  }
}
