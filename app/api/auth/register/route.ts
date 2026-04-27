import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { RegisterSchema } from "@/lib/validators/auth.schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
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

    // Check if user already exists
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

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    // Create applicant profile
    await prisma.applicant.create({
      data: {
        userId: user.id,
        fullName: "",
        birthPlace: "",
        birthDate: new Date(),
        gender: "",
        address: "",
        phone: "",
      },
    });

    // Create initial application
    const applicant = await prisma.applicant.findUnique({
      where: { userId: user.id },
    });

    if (applicant) {
      await prisma.application.create({
        data: {
          applicantId: applicant.id,
          status: "DRAFT",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pendaftaran berhasil. Silakan login.",
        data: {
          email: user.email,
        },
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
