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

    const { email, password } = validation.data;

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

    // Atomic: create User + Applicant + Application in a transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "STUDENT",
        },
      });

      // Applicant profile — placeholder values, filled via /application form
      const applicant = await tx.applicant.create({
        data: {
          userId: user.id,
          fullName: "",
          birthPlace: "",
          birthDate: new Date(0), // epoch as placeholder — replaced on first save
          gender: "",
          address: "",
          phone: "",
        },
      });

      // Create initial DRAFT application
      await tx.application.create({
        data: {
          applicantId: applicant.id,
          status: "DRAFT",
        },
      });

      return user;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pendaftaran berhasil. Silakan login.",
        data: { email },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 },
    );
  }
}
