"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useApplication } from "@/hooks/useApplication";

export default function ApplicationPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();
  const { application, applicant, isLoading, error: fetchError, updateApplication, submitApplication } =
    useApplication();

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: applicant?.fullName || "",
    nisn: applicant?.nisn || "",
    birthPlace: applicant?.birthPlace || "",
    birthDate: applicant?.birthDate?.split("T")[0] || "",
    gender: applicant?.gender || "",
    address: applicant?.address || "",
    phone: applicant?.phone || "",
    schoolOrigin: application?.schoolOrigin || "",
    parentName: application?.parentName || "",
    parentPhone: application?.parentPhone || "",
  });

  // Sync formData when remote data loads
  const [synced, setSynced] = useState(false);
  if (!isLoading && !synced && (applicant || application)) {
    setFormData({
      fullName: applicant?.fullName || "",
      nisn: applicant?.nisn || "",
      birthPlace: applicant?.birthPlace || "",
      birthDate: applicant?.birthDate?.split("T")[0] || "",
      gender: applicant?.gender || "",
      address: applicant?.address || "",
      phone: applicant?.phone || "",
      schoolOrigin: application?.schoolOrigin || "",
      parentName: application?.parentName || "",
      parentPhone: application?.parentPhone || "",
    });
    setSynced(true);
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setFormError(null);
    setFormSuccess(null);
    setSaving(true);

    const result = await updateApplication(formData);

    if (!result.success) {
      setFormError(result.message);
    } else {
      setFormSuccess(result.message);
      setTimeout(() => setFormSuccess(null), 3000);
      setSynced(false); // allow re-sync after save
    }
    setSaving(false);
  };

  const handleSubmit = async () => {
    if (
      !confirm(
        "Setelah submit, Anda tidak dapat mengubah data lagi. Lanjutkan?",
      )
    ) {
      return;
    }

    setFormError(null);
    setSubmitting(true);

    const result = await submitApplication();

    if (!result.success) {
      setFormError(result.message);
    } else {
      router.push("/documents");
    }

    setSubmitting(false);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  const isDraft = application?.status === "DRAFT";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-2">Formulir Aplikasi</h1>
          <p className="text-gray-600 mb-6">
            Lengkapi data pribadi dan aplikasi Anda
          </p>

          {/* Fetch error alert */}
          {fetchError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              ⚠️ {fetchError}
            </div>
          )}

          {/* Non-DRAFT status banner */}
          {!isDraft && application && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-lg text-blue-700">
              ℹ️ Status aplikasi Anda:{" "}
              <strong>{application.status}</strong>. Data tidak dapat diubah.
            </div>
          )}

          {/* Form error */}
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              ❌ {formError}
            </div>
          )}

          {/* Form success */}
          {formSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✅ {formSuccess}
            </div>
          )}

          {isDraft ? (
            <>
              {/* ── Personal Data ─────────────────────────────── */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b">
                  Data Pribadi
                </h2>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={saving || submitting}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="nisn"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        NISN
                      </label>
                      <input
                        id="nisn"
                        name="nisn"
                        type="text"
                        value={formData.nisn}
                        onChange={handleInputChange}
                        className="input-field"
                        disabled={saving || submitting}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Jenis Kelamin <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="input-field"
                        disabled={saving || submitting}
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="MALE">Laki-laki</option>
                        <option value="FEMALE">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="birthPlace"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tempat Lahir <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="birthPlace"
                        name="birthPlace"
                        type="text"
                        required
                        value={formData.birthPlace}
                        onChange={handleInputChange}
                        className="input-field"
                        disabled={saving || submitting}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="birthDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tanggal Lahir <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        required
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="input-field"
                        disabled={saving || submitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={saving || submitting}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Alamat <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-field"
                      disabled={saving || submitting}
                    />
                  </div>
                </div>
              </div>

              {/* ── Application Data ──────────────────────────── */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b">
                  Data Aplikasi
                </h2>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="schoolOrigin"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Asal Sekolah <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="schoolOrigin"
                      name="schoolOrigin"
                      type="text"
                      required
                      value={formData.schoolOrigin}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={saving || submitting}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="parentName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nama Orang Tua / Wali <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="parentName"
                      name="parentName"
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={saving || submitting}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="parentPhone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nomor Telepon Orang Tua / Wali{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="parentPhone"
                      name="parentPhone"
                      type="tel"
                      required
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={saving || submitting}
                    />
                  </div>
                </div>
              </div>

              {/* ── Actions ───────────────────────────────────── */}
              <div className="flex gap-4">
                <button
                  id="btn-save-application"
                  onClick={handleSave}
                  disabled={saving || submitting}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Menyimpan..." : "Simpan Draft"}
                </button>
                <button
                  id="btn-submit-application"
                  onClick={handleSubmit}
                  disabled={saving || submitting}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Memproses..." : "Submit Aplikasi"}
                </button>
              </div>

              <p className="mt-3 text-xs text-gray-500 text-center">
                ⚠️ Setelah submit, data tidak dapat diubah. Pastikan semua
                dokumen sudah diunggah.
              </p>
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-lg text-yellow-800">
              <p className="font-semibold mb-2">⚠️ Aplikasi Terkunci</p>
              <p>Aplikasi Anda telah disubmit dan tidak dapat diubah lagi.</p>
              <p className="mt-2">
                Status saat ini:{" "}
                <strong className="text-blue-700">{application?.status}</strong>
              </p>
              <a
                href="/status"
                className="inline-block mt-4 text-blue-600 hover:underline text-sm"
              >
                → Lihat status verifikasi
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
