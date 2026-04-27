"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Applicant {
  id: string;
  fullName: string;
  nisn: string | null;
  createdAt: string;
  user: {
    email: string;
  };
  application: {
    status: string;
  } | null;
}

export default function AdminApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/applicants");
      const data = await res.json();
      if (data.success) {
        setApplicants(data.data);
      }
    } catch (err) {
      console.error("Fetch applicants error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch =
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (a.nisn && a.nisn.includes(search)) ||
      a.user.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || (a.application?.status === statusFilter);

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">No App</span>;

    const styles: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-600",
      SUBMITTED: "bg-yellow-100 text-yellow-700",
      VERIFIED: "bg-blue-100 text-blue-700",
      ACCEPTED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
    };

    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles[status] || styles.DRAFT}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Pendaftar</h1>
          <p className="text-gray-600">Kelola semua calon siswa yang mendaftar</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari nama, NISN, atau email..."
            className="input-field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Semua Status</option>
            <option value="DRAFT">DRAFT</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Memuat data...</div>
        ) : filteredApplicants.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Tidak ada pendaftar yang ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nama Lengkap</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">NISN</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tanggal Daftar</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplicants.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{a.fullName || <span className="text-gray-400 italic">Belum diisi</span>}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{a.user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{a.nisn || "-"}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(a.application?.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(a.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/applicants/${a.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
