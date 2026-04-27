import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "ACCEPTED"
  | "REJECTED";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string; border: string; icon: string; desc: string }
> = {
  DRAFT: {
    label: "Draft",
    color: "text-gray-600",
    bg: "bg-gray-100",
    border: "border-gray-300",
    icon: "✏️",
    desc: "Aplikasi masih dalam proses pengisian. Lengkapi formulir dan upload dokumen.",
  },
  SUBMITTED: {
    label: "Terkirim",
    color: "text-blue-700",
    bg: "bg-blue-100",
    border: "border-blue-300",
    icon: "📨",
    desc: "Aplikasi Anda telah berhasil dikirim. Menunggu verifikasi dari tim admin.",
  },
  PENDING_VERIFICATION: {
    label: "Menunggu Verifikasi",
    color: "text-yellow-700",
    bg: "bg-yellow-100",
    border: "border-yellow-300",
    icon: "⏳",
    desc: "Tim admin sedang memverifikasi data dan dokumen Anda.",
  },
  VERIFIED: {
    label: "Terverifikasi",
    color: "text-purple-700",
    bg: "bg-purple-100",
    border: "border-purple-300",
    icon: "✅",
    desc: "Data dan dokumen Anda telah diverifikasi. Menunggu keputusan akhir.",
  },
  ACCEPTED: {
    label: "Diterima",
    color: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-300",
    icon: "🎉",
    desc: "Selamat! Anda dinyatakan DITERIMA. Tim sekolah akan menghubungi Anda lebih lanjut.",
  },
  REJECTED: {
    label: "Tidak Diterima",
    color: "text-red-700",
    bg: "bg-red-100",
    border: "border-red-300",
    icon: "❌",
    desc: "Mohon maaf, Anda tidak diterima pada kesempatan ini. Silakan hubungi sekolah untuk informasi lebih lanjut.",
  },
};

// ─── Status Stepper ──────────────────────────────────────────────────────────

const FLOW_STEPS: ApplicationStatus[] = [
  "DRAFT",
  "SUBMITTED",
  "PENDING_VERIFICATION",
  "VERIFIED",
  "ACCEPTED",
];

function getStepIndex(status: ApplicationStatus): number {
  if (status === "REJECTED") return -1; // special case
  return FLOW_STEPS.indexOf(status);
}

interface StepperProps {
  currentStatus: ApplicationStatus;
}

function StatusStepper({ currentStatus }: StepperProps) {
  const currentIndex = getStepIndex(currentStatus);
  const isRejected = currentStatus === "REJECTED";

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {FLOW_STEPS.map((step, index) => {
          const config = STATUS_CONFIG[step];
          const isDone = !isRejected && index < currentIndex;
          const isCurrent = !isRejected && index === currentIndex;

          return (
            <div key={step} className="flex flex-col items-center flex-1">
              {/* Connector line */}
              {index > 0 && (
                <div className="absolute hidden md:block" />
              )}

              {/* Circle */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  isDone
                    ? "bg-green-500 border-green-500 text-white"
                    : isCurrent
                      ? "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {isDone ? "✓" : index + 1}
              </div>

              {/* Label */}
              <p
                className={`mt-2 text-xs text-center font-medium leading-tight ${
                  isCurrent
                    ? "text-blue-700"
                    : isDone
                      ? "text-green-700"
                      : "text-gray-400"
                }`}
              >
                {config.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Connecting line behind circles */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function StatusPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const applicant = await prisma.applicant.findUnique({
    where: { userId: session.user.id },
    include: {
      application: {
        include: { documents: true },
      },
    },
  });

  const application = applicant?.application;
  const status: ApplicationStatus =
    (application?.status as ApplicationStatus) ?? "DRAFT";
  const config = STATUS_CONFIG[status];
  const docCount = application?.documents?.length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* ── Page Header ──────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Status Pendaftaran</h1>
          <p className="text-gray-600 mt-1">
            Pantau perkembangan proses penerimaan Anda
          </p>
        </div>

        {/* ── Current Status Card ──────────────────────── */}
        <div
          className={`mb-6 p-6 rounded-xl border-2 ${config.bg} ${config.border}`}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{config.icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Status Saat Ini
              </p>
              <p className={`text-2xl font-bold ${config.color}`}>
                {config.label}
              </p>
            </div>
          </div>
          <p className={`mt-3 text-sm ${config.color}`}>{config.desc}</p>
        </div>

        {/* ── Progress Stepper ──────────────────────────── */}
        {status !== "REJECTED" && (
          <div className="mb-6 bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Alur Penerimaan
            </p>
            <StatusStepper currentStatus={status} />
          </div>
        )}

        {/* ── Application Summary ───────────────────────── */}
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            Ringkasan Aplikasi
          </p>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Nama Pendaftar</span>
              <span className="text-sm font-medium text-gray-900">
                {applicant?.fullName || (
                  <span className="text-gray-400 italic">Belum diisi</span>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Email</span>
              <span className="text-sm font-medium text-gray-900">
                {session.user.email}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Asal Sekolah</span>
              <span className="text-sm font-medium text-gray-900">
                {application?.schoolOrigin || (
                  <span className="text-gray-400 italic">Belum diisi</span>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Dokumen Terupload</span>
              <span
                className={`text-sm font-medium ${
                  docCount === 4 ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {docCount} / 4
              </span>
            </div>

            {application?.verifiedAt && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Tanggal Verifikasi</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(application.verifiedAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}

            {application?.decidedAt && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Tanggal Keputusan</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(application.decidedAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Action Prompt ─────────────────────────────── */}
        {status === "DRAFT" && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm font-semibold text-yellow-800 mb-1">
              ⚠️ Aplikasi Anda belum selesai
            </p>
            <p className="text-xs text-yellow-700 mb-3">
              Lengkapi formulir dan upload semua dokumen, lalu submit untuk memulai proses verifikasi.
            </p>
            <div className="flex gap-2">
              <a
                href="/application"
                className="text-xs btn-primary py-1.5 px-3"
              >
                Isi Formulir →
              </a>
              <a
                href="/documents"
                className="text-xs btn-secondary py-1.5 px-3"
              >
                Upload Dokumen →
              </a>
            </div>
          </div>
        )}

        {/* ── Back to Dashboard ─────────────────────────── */}
        <div className="text-center">
          <a
            href="/dashboard"
            className="btn-secondary text-sm inline-block"
          >
            ← Kembali ke Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
