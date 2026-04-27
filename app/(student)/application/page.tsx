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

  const [currentStep, setCurrentStep] = useState(1);
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

  const handleSave = async (silent = false) => {
    if (!silent) {
       setFormError(null);
       setFormSuccess(null);
       setSaving(true);
    }

    const result = await updateApplication(formData);

    if (!silent) {
        if (!result.success) {
          setFormError(result.message);
        } else {
          setFormSuccess("Draft berhasil disimpan");
          setTimeout(() => setFormSuccess(null), 3000);
          setSynced(false);
        }
        setSaving(false);
    }
  };

  const handleNext = async () => {
     await handleSave(true);
     setCurrentStep(prev => prev + 1);
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
     setCurrentStep(prev => prev - 1);
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!confirm("Pastikan semua data sudah benar. Setelah submit, data tidak dapat diubah lagi. Lanjutkan?")) return;

    setFormError(null);
    setSubmitting(true);
    const result = await submitApplication();

    if (!result.success) {
      setFormError(result.message);
      setSubmitting(false);
    } else {
      router.push("/documents");
    }
  };

  const steps = [
    { n: 1, title: "Data Diri", icon: "👤" },
    { n: 2, title: "Kontak & Asal", icon: "🏠" },
    { n: 3, title: "Orang Tua", icon: "👨‍👩‍👧" },
  ];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Menyiapkan formulir...</p>
        </div>
      </div>
    );
  }

  const isDraft = application?.status === "DRAFT";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 text-center">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Formulir Pendaftaran</h1>
           <p className="text-slate-500">Lengkapi data pendaftaranmu secara bertahap.</p>
        </div>

        {/* Stepper Logic */}
        <div className="mb-10 bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center relative overflow-hidden">
           {steps.map((s) => (
             <div key={s.n} className="flex flex-col items-center flex-1 relative z-10 transition-all duration-300">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold mb-2 transition-all ${
                  currentStep === s.n ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-100' : 
                  currentStep > s.n ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400'
                }`}>
                   {currentStep > s.n ? '✓' : s.n}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep === s.n ? 'text-blue-600' : 'text-slate-400'}`}>
                  {s.title}
                </span>
             </div>
           ))}
           <div className="absolute top-9 left-0 right-0 h-[2px] bg-slate-50 -z-0 mx-10"></div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 relative overflow-hidden border border-slate-100">
          
          {/* Status Notifications */}
          {fetchError && <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">⚠️ {fetchError}</div>}
          {!isDraft && (
            <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-100 rounded-3xl text-blue-800 text-center">
               <p className="text-2xl mb-1">🔒</p>
               <p className="font-bold">Aplikasi Terkunci</p>
               <p className="text-xs opacity-70">Status saat ini: {application?.status}. Anda tidak dapat mengubah data.</p>
            </div>
          )}
          {formError && <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium animate-shake">❌ {formError}</div>}
          {formSuccess && <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-600 text-sm font-medium animate-fade-in">✅ {formSuccess}</div>}

          {isDraft ? (
            <div className="space-y-8">
              
              {/* STEP 1: PERSONAL DATA */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                   <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <span className="bg-blue-50 p-2 rounded-xl text-xl">👤</span> Data Pribadi
                   </h2>
                   <div className="space-y-5">
                      <div className="group">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nama Lengkap</label>
                        <input name="fullName" type="text" value={formData.fullName} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none font-bold" placeholder="Contoh: Budi Santoso" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                           <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">NISN</label>
                           <input name="nisn" type="text" value={formData.nisn} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none font-bold" placeholder="10 Digit NISN" />
                        </div>
                        <div>
                           <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Jenis Kelamin</label>
                           <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none font-bold appearance-none">
                              <option value="">Pilih</option>
                              <option value="MALE">Laki-laki</option>
                              <option value="FEMALE">Perempuan</option>
                           </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                           <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tempat Lahir</label>
                           <input name="birthPlace" type="text" value={formData.birthPlace} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none font-bold" />
                        </div>
                        <div>
                           <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tanggal Lahir</label>
                           <input name="birthDate" type="date" value={formData.birthDate} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none font-bold" />
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 2: CONTACT & SCHOOL */}
              {currentStep === 2 && (
                <div className="animate-fade-in text-slate-900">
                   <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <span className="bg-green-50 p-2 rounded-xl text-xl">🏠</span> Kontak & Asal
                   </h2>
                   <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nomor Telepon</label>
                        <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none font-bold" placeholder="0812..." />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Alamat Lengkap</label>
                        <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none font-bold" placeholder="Tulis alamat rumah lengkap..." />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Asal Sekolah (SMP/MTs)</label>
                        <input name="schoolOrigin" type="text" value={formData.schoolOrigin} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none font-bold" />
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 3: PARENTS */}
              {currentStep === 3 && (
                <div className="animate-fade-in">
                   <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <span className="bg-purple-50 p-2 rounded-xl text-xl">👨‍👩‍👧</span> Data Orang Tua
                   </h2>
                   <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nama Orang Tua / Wali</label>
                        <input name="parentName" type="text" value={formData.parentName} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none font-bold" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Telepon Orang Tua / Wali</label>
                        <input name="parentPhone" type="tel" value={formData.parentPhone} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl px-5 py-4 transition-all outline-none font-bold" />
                      </div>
                   </div>
                   
                   <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-100 rounded-3xl">
                      <p className="text-xs font-black text-yellow-700 uppercase tracking-[.2em] mb-2">Konfirmasi Akhir</p>
                      <p className="text-xs text-yellow-800 opacity-80 leading-relaxed">
                        Pastikan data Orang Tua/Wali dapat dihubungi oleh panitia untuk informasi wawancara dan verifikasi lanjutan.
                      </p>
                   </div>
                </div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="pt-10 flex flex-col sm:flex-row gap-4">
                 {currentStep > 1 && (
                   <button onClick={handlePrev} className="flex-1 bg-slate-100 text-slate-600 font-black py-5 rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Kembali</button>
                 )}
                 
                 {currentStep < 3 ? (
                   <button onClick={handleNext} className="flex-[2] bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all uppercase tracking-widest text-xs">Simpan & Lanjut</button>
                 ) : (
                   <div className="flex-[2] flex gap-4 w-full">
                      <button onClick={() => handleSave()} disabled={saving} className="flex-1 border-2 border-blue-600 text-blue-600 font-black py-5 rounded-2xl hover:bg-blue-50 transition-all uppercase tracking-widest text-xs">Draft</button>
                      <button onClick={handleSubmit} disabled={submitting} className="flex-[2] bg-green-600 text-white font-black py-5 rounded-2xl hover:bg-green-700 shadow-xl shadow-green-100 transition-all uppercase tracking-widest text-xs">Submit Akhir</button>
                   </div>
                 )}
              </div>

               <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-tighter">Draft Anda tersimpan otomatis saat berpindah halaman.</p>
            </div>
          ) : (
            <div className="text-center py-8">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🎉</div>
               <h3 className="text-2xl font-black text-slate-900 mb-2">Aplikasi Terkirim</h3>
               <p className="text-slate-500 mb-10">Data Anda sudah aman di server kami. Silakan lanjutkan untuk mengunggah dokumen jika belum lengkap.</p>
               <div className="flex flex-col gap-3">
                  <a href="/documents" className="bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all uppercase tracking-widest text-xs">Upload Dokumen →</a>
                  <a href="/status" className="bg-slate-100 text-slate-600 font-black py-5 rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Cek Status</a>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
