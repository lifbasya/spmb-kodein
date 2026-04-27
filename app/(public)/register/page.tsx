"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  MapPin, 
  Phone, 
  BookOpen, 
  Users, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Mail,
  Lock,
  Calendar,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const steps = [
  { 
    id: 1, 
    title: "Akun & Profil", 
    description: "Informasi dasar pendaftar",
    icon: <User className="w-5 h-5" />
  },
  { 
    id: 2, 
    title: "Akademik & Keluarga", 
    description: "Sekolah asal & wali",
    icon: <Users className="w-5 h-5" /> 
  },
  { 
    id: 3, 
    title: "Dokumen", 
    description: "Unggah berkas pendaftaran",
    icon: <Upload className="w-5 h-5" /> 
  },
];

const ApplicationForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    nisn: "",
    birthPlace: "",
    birthDate: "",
    gender: "MALE",
    religion: "",
    address: "",
    phone: "",
    schoolOrigin: "",
    parentName: "",
    parentPhone: "",
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    FAMILY_CARD: null,
    BIRTH_CERTIFICATE: null,
    REPORT_CARD: null,
    PHOTO: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Mock File Uploads
      const uploadedDocs = Object.keys(files).filter(k => files[k]).map(type => ({
        type,
        fileUrl: "https://res.cloudinary.com/demo/image/upload/sample.pdf", 
        fileName: files[type]?.name || "document.pdf",
        cloudId: "mock_id"
      }));

      const payload = {
        ...formData,
        documents: uploadedDocs
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Pendaftaran Berhasil! Akun Anda telah dibuat. Silakan login.");
        router.push("/login");
      } else {
        // Jika ada detail error dari Zod (data.data), tampilkan yang pertama
        if (data.data && typeof data.data === 'object') {
          const fieldErrors = data.data.fieldErrors;
          const firstError = Object.values(fieldErrors)[0] as string[];
          alert(`Validasi Gagal: ${firstError[0]}`);
        } else {
          alert(data.message || "Gagal mendaftar. Periksa kembali inputan Anda.");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                   <input 
                    name="email" value={formData.email} onChange={handleInputChange}
                    type="email" placeholder="nama@email.com" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase">Nama Lengkap</label>
                 <div className="relative">
                   <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                   <input 
                    name="fullName" value={formData.fullName} onChange={handleInputChange}
                    placeholder="Sesuai Ijazah" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                   />
                 </div>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                   <input 
                    name="password" value={formData.password} onChange={handleInputChange}
                    type="password" placeholder="••••••••" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase">Konfirmasi Password</label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                   <input 
                    name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                    type="password" placeholder="••••••••" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                   />
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Tempat Lahir</label>
                  <input 
                    name="birthPlace" value={formData.birthPlace} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Tanggal Lahir</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      name="birthDate" value={formData.birthDate} onChange={handleInputChange}
                      type="date" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Jenis Kelamin</label>
                  <select 
                    name="gender" value={formData.gender} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MALE">Laki-laki</option>
                    <option value="FEMALE">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Agama</label>
                  <select 
                    name="religion" value={formData.religion} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Agama</option>
                    <option value="ISLAM">Islam</option>
                    <option value="KRISTEN">Kristen</option>
                    <option value="KATHOLIK">Katholik</option>
                    <option value="HINDU">Hindu</option>
                    <option value="BUDHA">Budha</option>
                    <option value="KONGHUCU">Konghucu</option>
                  </select>
                </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-500 uppercase">No. Telpon Mandiri</label>
               <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    name="phone" value={formData.phone} onChange={handleInputChange}
                    placeholder="0812..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-500 uppercase">Alamat Lengkap</label>
               <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea 
                    name="address" value={formData.address} onChange={handleInputChange}
                    rows={3} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
               </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-500 uppercase">NISN</label>
               <input 
                name="nisn" value={formData.nisn} onChange={handleInputChange}
                placeholder="10 digit nomor induk" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
               />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-500 uppercase">Asal Sekolah (SMP/MTs)</label>
               <div className="relative">
                 <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                 <input 
                  name="schoolOrigin" value={formData.schoolOrigin} onChange={handleInputChange}
                  placeholder="Nama sekolah asal" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                 />
               </div>
            </div>
            <hr className="border-gray-100" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase">Nama Orang Tua / Wali</label>
                 <input 
                  name="parentName" value={formData.parentName} onChange={handleInputChange}
                  placeholder="Nama Lengkap" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase">No. Telp Orang Tua</label>
                 <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      name="parentPhone" value={formData.parentPhone} onChange={handleInputChange}
                      placeholder="0812..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                 </div>
               </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-xl text-blue-700 text-sm flex items-start space-x-3">
              <BookOpen className="w-5 h-5 shrink-0" />
              <p>Format file yang diizinkan adalah PDF atau Gambar (JPG/PNG). Maksimal 2MB per file.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { id: "PHOTO", label: "Pas Foto 3x4" },
                 { id: "REPORT_CARD", label: "Scan Raport" },
                 { id: "BIRTH_CERTIFICATE", label: "Akta Kelahiran" },
                 { id: "FAMILY_CARD", label: "Kartu Keluarga" },
               ].map((doc) => (
                 <div key={doc.id} className="relative group p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                    <label className="cursor-pointer block">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tight mb-2">{doc.label}</p>
                      <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600 truncate max-w-[120px]">
                            {files[doc.id]?.name || "Pilih file..."}
                         </span>
                         <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                           <Upload className="w-4 h-4" />
                         </div>
                      </div>
                      <input type="file" className="hidden" onChange={(e) => handleFileChange(doc.id, e)} />
                    </label>
                 </div>
               ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/5 overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-100">
        {/* Sidebar Nav */}
        <div className="w-full md:w-80 bg-slate-900 p-8 text-white relative">
          <div className="relative z-10">
            <h1 className="text-2xl font-black mb-2 tracking-tighter cursor-pointer" onClick={() => router.push('/')}>
              SPMB <span className="text-blue-400">KODEIN</span>
            </h1>
            <p className="text-slate-400 text-xs mb-10 font-medium">Sistem Penerimaan Mahasiswa Baru</p>

            <div className="space-y-6">
              {steps.map((s) => (
                <div key={s.id} className={`flex items-start space-x-4 transition-all ${currentStep === s.id ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${currentStep === s.id ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-slate-800'}`}>
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{s.title}</h3>
                    <p className="text-[10px] text-slate-400">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-8 right-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
             <p className="text-[10px] text-slate-400 leading-relaxed italic">"Membangun Masa Depan Gemilang Melalui Kompetensi Digital."</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 md:p-12 bg-white relative">
          <div className="max-w-2xl">
            <header className="mb-10">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                 {steps.find(s => s.id === currentStep)?.title}
               </h2>
               <div className="flex items-center space-x-2">
                  <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
                  <p className="text-slate-400 text-sm font-medium">Langkah {currentStep} dari 3</p>
               </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-[350px]"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <footer className="mt-12 flex items-center justify-between">
               <button 
                disabled={currentStep === 1 || isSubmitting}
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center space-x-2 px-6 py-3 text-slate-500 font-bold hover:text-slate-800 transition-all disabled:opacity-0"
               >
                 <ArrowLeft className="w-4 h-4" />
                 <span>Kembali</span>
               </button>

               <div className="flex space-x-4">
                  {currentStep < 3 ? (
                    <button 
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="flex items-center space-x-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-200 hover:shadow-slate-300 transition-all hover:translate-y-[-2px]"
                    >
                      <span>Lanjutkan</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center space-x-2 px-10 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all hover:translate-y-[-2px] disabled:bg-blue-300"
                    >
                      {isSubmitting ? (
                        <span>Mengirim Berkas...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Kirim Pendaftaran</span>
                        </>
                      )}
                    </button>
                  )}
               </div>
            </footer>
          </div>
        </div>
      </div>
      
      <p className="text-center mt-8 text-sm text-gray-500">
        Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold hover:underline">Masuk di sini</Link>
      </p>
    </div>
  );
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 selection:bg-blue-100 selection:text-blue-900">
      <ApplicationForm />
    </div>
  );
}
