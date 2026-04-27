"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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
  status: string;
  schoolOrigin: string | null;
  parentName: string | null;
  parentPhone: string | null;
  createdAt: string;
  verifiedAt: string | null;
  decidedAt: string | null;
  user: {
    email: string;
  };
  documents: Document[];
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
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/process", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId: id }),
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
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId: id }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Pendaftar berhasil diverifikasi.");
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
    const confirmMsg = status === "ACCEPTED" ? "Terima calon siswa ini?" : "Tolak calon siswa ini?";
    if (!confirm(confirmMsg)) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/decision", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantId: id,
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

  const status = applicant.status;

  return (
    <div className="max-w-4xl pb-20">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/applicants" className="p-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detail Pendaftar</h1>
          <p className="text-gray-500 text-sm">Informasi lengkap dan pengelolaan berkas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Header */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status Pendaftaran</p>
               <span className={`text-base font-bold px-4 py-1.5 rounded-full ${
                 status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                 status === "REJECTED" ? "bg-red-100 text-red-700" :
                 status === "VERIFIED" ? "bg-blue-100 text-blue-700" :
                 status === "SUBMITTED" ? "bg-yellow-100 text-yellow-700" :
                 status === "PENDING_VERIFICATION" ? "bg-indigo-100 text-indigo-700" :
                 "bg-gray-100 text-gray-600"
               }`}>
                 {status}
               </span>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ID Profil</p>
                <p className="text-sm font-mono font-semibold text-gray-700">{applicant.id.split('-')[0]}...</p>
            </div>
          </div>

          {/* Data Cards Container */}
          <div className="grid grid-cols-1 gap-6">
            {/* Personal Data */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <h2 className="font-bold text-gray-800 flex items-center">
                   <span className="mr-2">👤</span> Data Pribadi
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10 text-sm">
                <div>
                  <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Nama Lengkap</p>
                  <p className="font-semibold text-gray-900">{applicant.fullName || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">NISN</p>
                  <p className="font-semibold font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block">{applicant.nisn || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Email</p>
                  <p className="font-semibold text-gray-900">{applicant.user.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">WhatsApp / HP</p>
                  <p className="font-semibold text-gray-900">{applicant.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Tempat, Tgl Lahir</p>
                  <p className="font-semibold text-gray-900">
                    {applicant.birthPlace}, {new Date(applicant.birthDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Jenis Kelamin</p>
                  <p className="font-semibold text-gray-900">{applicant.gender === "MALE" ? "Laki-laki" : applicant.gender === "FEMALE" ? "Perempuan" : "-"}</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Alamat Lengkap</p>
                  <p className="font-medium text-gray-900 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{applicant.address || "-"}</p>
                </div>
              </div>
            </section>

            {/* School & Parent Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                    <h2 className="font-bold text-gray-800 flex items-center">
                      <span className="mr-2">🏫</span> Asal Sekolah
                    </h2>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Nama Sekolah</p>
                    <p className="font-bold text-gray-900 text-lg leading-tight">{applicant.schoolOrigin || "-"}</p>
                  </div>
               </section>

               <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                    <h2 className="font-bold text-gray-800 flex items-center">
                      <span className="mr-2">👪</span> Orang Tua / Wali
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Nama Wali</p>
                      <p className="font-semibold text-gray-900">{applicant.parentName || "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">No. Telepon</p>
                      <p className="font-semibold text-gray-900">{applicant.parentPhone || "-"}</p>
                    </div>
                  </div>
               </section>
            </div>

            {/* Documents */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                <h2 className="font-bold text-gray-800 flex items-center">
                  <span className="mr-2">📂</span> Dokumen Pendukung
                </h2>
              </div>
              <div className="p-6">
                {!applicant.documents || applicant.documents.length === 0 ? (
                  <p className="text-gray-500 text-sm italic py-4 text-center border-2 border-dashed rounded-xl">Tidak ada dokumen yang diunggah.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {applicant.documents.map((doc) => (
                      <div key={doc.id} className="p-4 rounded-xl border border-gray-100 flex items-center justify-between hover:bg-blue-50/50 transition-all group">
                        <div className="flex items-center space-x-3 overflow-hidden">
                           <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                             {doc.type[0]}
                           </div>
                           <div className="overflow-hidden">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate">{doc.type.replace("_", " ")}</p>
                              <p className="text-sm font-semibold text-gray-700 truncate">{doc.fileName}</p>
                           </div>
                        </div>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 p-2 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                          title="Buka Dokumen"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Right: Actions */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 sticky top-8">
            <h2 className="font-bold text-gray-900 border-b border-gray-50 pb-4">Kontrol Admin</h2>

            {/* Step 1: Start Processing */}
            {status === "SUBMITTED" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProcess}
                disabled={actionLoading}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {actionLoading ? "..." : "Mulai Verifikasi"}
              </motion.button>
            )}

            {/* Step 2: Verification */}
            {status === "PENDING_VERIFICATION" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerify}
                disabled={actionLoading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-blue-200 shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {actionLoading ? "..." : "Tandai Diverifikasi"}
              </motion.button>
            )}

            {/* Step 3: Final Decision */}
            {status === "VERIFIED" && (
              <div className="grid grid-cols-1 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDecision("ACCEPTED")}
                  disabled={actionLoading}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-green-200 shadow-lg hover:bg-green-700 transition-all disabled:opacity-50"
                >
                  {actionLoading ? "..." : "Terima Siswa"}
                </motion.button>
                <motion.button
                   whileHover={{ y: -2 }}
                  onClick={() => handleDecision("REJECTED")}
                  disabled={actionLoading}
                  className="w-full py-3 border-2 border-red-500 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all disabled:opacity-50"
                >
                  {actionLoading ? "..." : "Tolak Siswa"}
                </motion.button>
              </div>
            )}

            {/* Status Info for Incomplete / Finished */}
            {(status === "ACCEPTED" || status === "REJECTED") && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                 <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-xl">
                   {status === "ACCEPTED" ? "🎉" : "❌"}
                 </div>
                 <p className="text-sm font-bold text-slate-800">Keputusan Final</p>
                 <p className="text-xs text-slate-400 mt-1">Status: <span className="font-bold text-slate-600">{status}</span></p>
                 <p className="text-[10px] text-slate-400 mt-2 italic">Pada {applicant.decidedAt ? new Date(applicant.decidedAt).toLocaleDateString("id-ID") : "-"}</p>
              </div>
            )}

            {(status === "DRAFT") && (
              <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl text-center">
                 <div className="text-2xl mb-2">⏳</div>
                 <p className="text-xs font-bold text-orange-800 uppercase tracking-tight">Menunggu Submit</p>
                 <p className="text-[10px] text-orange-600 mt-1 leading-relaxed">Siswa sedang melengkapi data atau mengunggah dokumen.</p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-50 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Timeline</span>
              </div>
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-1 before:bottom-1 before:w-[2px] before:bg-slate-100">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                  <p className="text-xs font-bold text-gray-700">Akun Terdaftar</p>
                  <p className="text-[10px] text-gray-400">{new Date(applicant.createdAt).toLocaleString("id-ID")}</p>
                </div>
                {applicant.verifiedAt && (
                   <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
                    <p className="text-xs font-bold text-gray-700">Lolos Verifikasi</p>
                    <p className="text-[10px] text-gray-400">{new Date(applicant.verifiedAt).toLocaleString("id-ID")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
