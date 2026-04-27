import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { applicationService } from "@/lib/services/application.service";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Get application completion status
  const completionStatus = await applicationService.getCompletionStatus(session.user.id);
  
  // Get applicant data for status display
  const applicant = await prisma.applicant.findUnique({
    where: { userId: session.user.id },
    include: {
      documents: true,
    },
  });

  const app = applicant;
  const status = applicant?.status || "DRAFT";
  
  const statusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
    DRAFT: { label: "Draft", bg: "bg-slate-100", text: "text-slate-600", icon: "✏️" },
    SUBMITTED: { label: "Terkirim", bg: "bg-yellow-100", text: "text-yellow-700", icon: "📨" },
    PENDING_VERIFICATION: { label: "Menunggu Verifikasi", bg: "bg-blue-100", text: "text-blue-700", icon: "⏳" },
    VERIFIED: { label: "Terverifikasi", bg: "bg-purple-100", text: "text-purple-700", icon: "✅" },
    ACCEPTED: { label: "Diterima", bg: "bg-green-100", text: "text-green-700", icon: "🎉" },
    REJECTED: { label: "Tidak Diterima", bg: "bg-red-100", text: "text-red-700", icon: "❌" },
  };

  const currentStatus = statusConfig[status] || statusConfig.DRAFT;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Premium Header */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-black text-blue-600 tracking-tighter">SPMB<span className="text-slate-900 font-normal">KODEIN</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">{applicant?.fullName || 'Siswa'}</p>
                <p className="text-xs text-slate-500 mt-1">{session.user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-blue-50">
                {applicant?.fullName?.charAt(0) || 'S'}
              </div>
              <a href="/api/auth/signout" className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors">Keluar</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Halo, {applicant?.fullName?.split(' ')[0] || 'Calon Siswa'}! 👋</h2>
            <p className="text-slate-500 mt-2 text-lg">Pantau progress pendaftaranmu di sini.</p>
          </div>
          
          <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border-2 ${currentStatus.bg.replace('bg-', 'border-').replace('100', '200')} ${currentStatus.bg} shadow-sm`}>
            <span className="text-3xl">{currentStatus.icon}</span>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Status Saat Ini</p>
              <p className={`text-xl font-black ${currentStatus.text}`}>{currentStatus.label}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Progress & Actions */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Progress Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 opacity-50 rounded-full -mr-16 -mt-16 -z-10"></div>
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Kelengkapan Data</h3>
                  <span className="text-3xl font-black text-blue-600">{completionStatus.percentage}%</span>
               </div>
               
               <div className="w-full bg-slate-100 rounded-full h-4 mb-4 overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${completionStatus.percentage}%` }}
                  ></div>
               </div>
               
               <p className="text-slate-500 text-sm">
                 {completionStatus.percentage === 100 
                   ? "✅ Data kamu sudah lengkap! Silakan submit pendaftaran jika belum." 
                   : `Kamu telah mengisi ${completionStatus.completed} dari ${completionStatus.total} data yang diperlukan.`}
               </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Lengkapi Data",
                  desc: "Isi data pribadi, wali, dan asal sekolah",
                  href: "/application",
                  icon: "📝",
                  active: status === "DRAFT",
                  color: "blue"
                },
                {
                  title: "Upload Berkas",
                  desc: "Unggah dokumen persyaratan (KK, Akta, dll)",
                  href: "/documents",
                  icon: "📤",
                  active: status === "DRAFT",
                  color: "green"
                },
                {
                  title: "Tracking Status",
                  desc: "Pantau proses verifikasi admin",
                  href: "/status",
                  icon: "🔍",
                  active: true,
                  color: "purple"
                },
                {
                  title: "Pusat Bantuan",
                  desc: "Hubungi panitia jika ada kendala",
                  href: "#",
                  icon: "💬",
                  active: true,
                  color: "orange"
                }
              ].map((action) => (
                <a 
                  key={action.title}
                  href={action.active ? action.href : '#'}
                  className={`flex items-start gap-4 p-6 rounded-3xl border-2 transition-all group ${
                    action.active 
                      ? `bg-white border-slate-100 hover:border-${action.color}-300 hover:shadow-xl` 
                      : 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-${action.color}-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{action.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{action.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Information & Timeline */}
          <div className="space-y-8">
             {/* Announcement Card */}
             <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full -mb-12 -mr-12"></div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-yellow-400">🔔</span> Pengumuman
                </h3>
                <div className="space-y-4">
                   <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                      <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">Penting</p>
                      <p className="text-sm leading-relaxed">Batas akhir pemenuhan dokumen adalah 31 Mei 2026. Pastikan semua berkas terbaca jelas.</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Informasi</p>
                      <p className="text-sm leading-relaxed">Admin melakukan verifikasi berkas setiap hari kerja (Senin - Jumat).</p>
                   </div>
                </div>
             </div>

             {/* Simple Checklist */}
             <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6">Persyaratan Utama</h3>
                <ul className="space-y-4">
                  {[
                    { label: "Isi Formulir Lengkap", done: completionStatus.completed >= 9 },
                    { label: "Upload Kartu Keluarga", done: app?.documents.some(d => d.type === "FAMILY_CARD") },
                    { label: "Upload Akta Kelahiran", done: app?.documents.some(d => d.type === "BIRTH_CERTIFICATE") },
                    { label: "Submit Pendaftaran", done: status !== "DRAFT" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${item.done ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                        {item.done ? '✓' : '○'}
                      </div>
                      <span className={`text-sm ${item.done ? 'text-slate-600 line-through' : 'text-slate-800 font-medium'}`}>{item.label}</span>
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="mt-20 py-10 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-slate-500 text-sm">© 2026 SPMB KODEIN. Sistem Pendaftaran Siswa Baru Terpadu.</p>
        </div>
      </footer>
    </div>
  );
}
