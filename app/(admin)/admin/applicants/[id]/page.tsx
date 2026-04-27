"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Document {
  id: string;
  type: string;
  fileUrl: string;
  fileName: string;
}

interface ApplicantDetail {
  id: string;
  fullName: string;
  nisn: string | null;
  birthPlace: string;
  birthDate: string;
  gender: string;
  address: string;
  phone: string;
  createdAt: string;
  user: {
    email: string;
  };
  application: {
    id: string;
    status: string;
    schoolOrigin: string | null;
    parentName: string | null;
    parentPhone: string | null;
    documents: Document[];
    verifiedAt: string | null;
    decidedAt: string | null;
  } | null;
}

export default function AdminApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [applicant, setApplicant] = useState<ApplicantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applicants/${id}`);
      const data = await res.json();
      if (data.success) {
        setApplicant(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Fetch detail error:", err);
      setError("Gagal memuat data detail.");
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!applicant?.application) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/process", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: applicant.application.id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDetail();
      } else {
        alert(data.message);
      }
    } catch (err) {
        console.error("Process error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!applicant?.application) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: applicant.application.id }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Aplikasi berhasil diverifikasi.");
        fetchDetail();
      } else {
        alert(data.message);
      }
    } catch (err) {
        console.error("Verify error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecision = async (status: "ACCEPTED" | "REJECTED") => {
    if (!applicant?.application) return;
    const confirmMsg = status === "ACCEPTED" ? "Terima calon siswa ini?" : "Tolak calon siswa ini?";
    if (!confirm(confirmMsg)) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/decision", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: applicant.application.id,
          status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Keputusan ${status.toLowerCase()} berhasil disimpan.`);
        fetchDetail();
      } else {
        alert(data.message);
      }
    } catch (err) {
        console.error("Decision error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Memuat data detail...</div>;
  if (error || !applicant) return <div className="p-12 text-center text-red-500">{error || "Data tidak ditemukan."}</div>;

  const app = applicant.application;
  const status = app?.status || "NO_APP";

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center space-x-4">
        <Link href="/admin/applicants" className="p-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detail Pendaftar</h1>
          <p className="text-gray-500 text-sm">Informasi lengkap dan pengelolaan status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Info Sections */}
        <div className="md:col-span-2 space-y-6">
          {/* Status Header */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Status Saat Ini</p>
               <span className={`text-lg font-bold px-3 py-1 rounded-lg ${
                 status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                 status === "REJECTED" ? "bg-red-100 text-red-700" :
                 status === "VERIFIED" ? "bg-blue-100 text-blue-700" :
                 status === "SUBMITTED" ? "bg-yellow-100 text-yellow-700" :
                 "bg-gray-100 text-gray-600"
               }`}>
                 {status}
               </span>
            </div>
            <div className="text-right">
                <p className="text-xs font-medium text-gray-400 mb-1">ID Pendaftar</p>
                <p className="text-sm font-mono text-gray-600">{applicant.id}</p>
            </div>
          </div>

          {/* Personal Data */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-semibold text-gray-800">Data Pribadi</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Nama Lengkap</p>
                <p className="font-medium">{applicant.fullName || "-"}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">NISN</p>
                <p className="font-medium font-mono">{applicant.nisn || "-"}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Email</p>
                <p className="font-medium">{applicant.user.email}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Nomor Telepon</p>
                <p className="font-medium">{applicant.phone || "-"}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Tempat, Tanggal Lahir</p>
                <p className="font-medium">
                  {applicant.birthPlace}, {new Date(applicant.birthDate).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Jenis Kelamin</p>
                <p className="font-medium">{applicant.gender === "MALE" ? "Laki-laki" : applicant.gender === "FEMALE" ? "Perempuan" : "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-1">Alamat</p>
                <p className="font-medium leading-relaxed">{applicant.address || "-"}</p>
              </div>
            </div>
          </div>

          {/* Application & Parent Info */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-semibold text-gray-800">Data Aplikasi & Orang Tua</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Asal Sekolah</p>
                <p className="font-medium">{app?.schoolOrigin || "-"}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Orang Tua / Wali</p>
                <p className="font-medium">{app?.parentName || "-"}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Telepon Orang Tua</p>
                <p className="font-medium">{app?.parentPhone || "-"}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-semibold text-gray-800">Dokumen Pendukung</h2>
            </div>
            <div className="p-6">
              {!app?.documents || app.documents.length === 0 ? (
                <p className="text-gray-500 text-sm italic">Tidak ada dokumen yang diunggah.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {app.documents.map((doc) => (
                    <div key={doc.id} className="p-4 rounded-lg border border-gray-100 flex items-center justify-between hover:bg-slate-50 transition-all">
                      <div className="flex items-center space-x-3">
                         <span className="text-xl">📄</span>
                         <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{doc.type.replace("_", " ")}</p>
                            <p className="text-sm font-medium truncate max-w-[120px]">{doc.fileName}</p>
                         </div>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 rounded transition-all border border-blue-600"
                      >
                        Lihat
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900 border-b pb-4 mb-4">Pengelolaan</h2>

            {/* Process Button */}
            {status === "SUBMITTED" && (
              <button
                onClick={handleProcess}
                disabled={actionLoading}
                className="w-full btn-primary bg-indigo-600 hover:bg-indigo-700 h-10 disabled:opacity-50"
              >
                {actionLoading ? "Memproses..." : "Mulai Periksa Berkas"}
              </button>
            )}

            {/* Verification Button */}
            {status === "PENDING_VERIFICATION" && (
              <button
                onClick={handleVerify}
                disabled={actionLoading}
                className="w-full btn-primary bg-blue-600 hover:bg-blue-700 h-10 disabled:opacity-50"
              >
                {actionLoading ? "Memproses..." : "Verifikasi Data"}
              </button>
            )}

            {/* Decision Buttons */}
            {status === "VERIFIED" && (
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleDecision("ACCEPTED")}
                  disabled={actionLoading}
                  className="w-full btn-primary bg-green-600 hover:bg-green-700 h-10 disabled:opacity-50"
                >
                  {actionLoading ? "Memproses..." : "Terima Siswa"}
                </button>
                <button
                  onClick={() => handleDecision("REJECTED")}
                  disabled={actionLoading}
                  className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold h-10 rounded-lg disabled:opacity-50"
                >
                  {actionLoading ? "Memproses..." : "Tolak Siswa"}
                </button>
              </div>
            )}

            {/* Already Decided State */}
            {(status === "ACCEPTED" || status === "REJECTED") && (
              <div className="bg-slate-50 p-4 rounded-lg text-center">
                 <p className="text-sm font-medium text-slate-500">Keputusan Akhir Telah Dibuat</p>
                 <p className="text-xs text-slate-400 mt-1">Pada {app?.decidedAt ? new Date(app.decidedAt).toLocaleDateString("id-ID") : "-"}</p>
              </div>
            )}

            {/* Pending state for student */}
            {(status === "DRAFT" || status === "NO_APP") && (
              <div className="p-4 bg-gray-50 border border-dashed rounded-lg text-center">
                 <p className="text-xs text-gray-400">Siswa belum mensubmit aplikasi pendaftaran.</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-xl shadow-sm">
             <p className="text-xs font-bold text-slate-500 uppercase mb-2">Riwayat Log</p>
             <div className="space-y-4 text-xs">
                <div className="flex space-x-3">
                   <span className="text-green-500">●</span>
                   <div>
                      <p className="font-medium">Akun Dibuat</p>
                      <p className="text-slate-500">{new Date(applicant.createdAt).toLocaleString("id-ID")}</p>
                   </div>
                </div>
                {app?.verifiedAt && (
                  <div className="flex space-x-3">
                    <span className="text-blue-500">●</span>
                    <div>
                        <p className="font-medium">Data Diverifikasi</p>
                        <p className="text-slate-500">{new Date(app.verifiedAt).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
