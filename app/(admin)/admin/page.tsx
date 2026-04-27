import { adminService } from "@/lib/services/admin.service";

export default async function AdminDashboardPage() {
  const stats = await adminService.getStats();

  const cards = [
    {
      title: "Total Pendaftar",
      value: stats.totalApplicants,
      desc: "Semua akun calon siswa",
      color: "border-gray-200",
      textColor: "text-gray-900",
      icon: "👥",
    },
    {
      title: "Menunggu Verifikasi",
      value: stats.pending,
      desc: "Status: SUBMITTED",
      color: "border-yellow-200",
      textColor: "text-yellow-600",
      icon: "⏳",
    },
    {
      title: "Terverifikasi",
      value: stats.verified,
      desc: "Status: VERIFIED",
      color: "border-blue-200",
      textColor: "text-blue-600",
      icon: "✅",
    },
    {
      title: "Diterima",
      value: stats.accepted,
      desc: "Status: ACCEPTED",
      color: "border-green-200",
      textColor: "text-green-600",
      icon: "🎉",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600">Ringkasan statistik sistem pendaftaran</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`bg-white p-6 rounded-xl border shadow-sm transition-all hover:shadow-md ${card.color}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {card.title}
            </h3>
            <p className={`text-4xl font-bold mt-1 ${card.textColor}`}>
              {card.value}
            </p>
            <p className="text-xs text-gray-400 mt-2">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Akses Cepat</h2>
          <div className="grid grid-cols-1 gap-4">
            <a
              href="/admin/applicants"
              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all group"
            >
              <div>
                <p className="font-medium text-slate-800">Lihat Semua Pendaftar</p>
                <p className="text-xs text-slate-500">Kelola data dan dokumen calon siswa</p>
              </div>
              <span className="text-blue-600 transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        <div className="bg-blue-600 p-6 rounded-xl text-white flex flex-col justify-between">
           <div>
            <h2 className="text-lg font-semibold mb-2">Panduan Admin</h2>
            <p className="text-sm text-blue-100 mb-4 opacity-80">
              Pastikan memeriksa dokumen calon siswa dengan teliti sebelum melakukan verifikasi dan memberikan keputusan akhir.
            </p>
           </div>
           <div className="bg-blue-700/50 p-4 rounded-lg">
             <p className="text-xs font-medium mb-1">💡 Tips:</p>
             <p className="text-xs text-blue-100 opacity-70">Gunakan fitur pencarian di halaman pendaftar untuk mencari NISN atau nama siswa.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
