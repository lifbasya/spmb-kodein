import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f0d] text-white overflow-x-hidden">

      {/* === NAVBAR === */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0f0d]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <span className="text-[#0a0f0d] font-black text-sm">K</span>
              </div>
              <span className="text-xl font-black tracking-tight">
                SPMB<span className="text-emerald-400">KODEIN</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#program" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Program</a>
              <a href="#fitur" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Fitur</a>
              <a href="#faq" className="text-sm text-white/60 hover:text-white transition-colors font-medium">FAQ</a>
              <a href="#kontak" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Kontak</a>
              <Link
                href="/login"
                className="text-sm font-semibold text-white/80 border border-white/20 px-5 py-2 rounded-full hover:border-white/50 hover:text-white transition-all"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold bg-emerald-500 text-[#0a0f0d] px-6 py-2.5 rounded-full hover:bg-emerald-400 transition-all"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* === HERO === */}
      <section className="relative min-h-screen flex items-center pt-5 overflow-hidden">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(16,185,129,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.15) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gradient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-900/30 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Pendaftaran Gelombang 3 — Berakhir 30 Juni 2026
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
              Mencetak
              <br />
              <span className="text-emerald-400">Generasi</span>
              <br />
              Unggul IT
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-12 leading-relaxed">
              Boarding School fokus IT dengan nilai Islami. Daftarkan putra-putri Anda dan mulai perjalanan menuju karier digital yang gemilang.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-base font-bold bg-emerald-500 text-[#0a0f0d] px-8 py-4 rounded-full hover:bg-emerald-400 transition-all"
              >
                Daftar Sekarang
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-base font-semibold text-white border border-white/20 px-8 py-4 rounded-full hover:border-white/50 transition-all"
              >
                Masuk Dashboard
              </Link>
            </div>

            {/* Highlight pills */}
            <div className="flex flex-wrap gap-3">
              {["Jenjang SMP & SMA", "Sistem Boarding & Full Day", "Kuasai Skill IT & Digital", "Pembinaan Qur'an & Karakter"].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-sm text-white/60 border border-white/10 px-4 py-2 rounded-full bg-white/5">
                  <svg className="w-3 h-3 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.285 6.709l-11.285 11.285-5.285-5.285 1.415-1.414 3.87 3.87 9.87-9.87 1.415 1.414z" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === STATS BAR === */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "100%", label: "Proses Online" },
              { num: "24/7", label: "Akses Kapan Saja" },
              { num: "Real-time", label: "Update Status" },
              { num: "< 10 Menit", label: "Waktu Pendaftaran" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-black text-emerald-400 mb-1">{s.num}</p>
                <p className="text-sm text-white/50 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === PROGRAM UNGGULAN === */}
      <section id="program" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">Program</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Pilih Sistem Belajar Terbaik</h2>
            <p className="text-white/50 max-w-xl">Kami menyediakan dua jalur belajar yang dirancang untuk memaksimalkan potensi setiap siswa.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Boarding Card */}
            <div className="relative p-8 md:p-10 rounded-3xl border border-emerald-500/30 bg-emerald-950/30 overflow-hidden group hover:border-emerald-400/50 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] -z-0" />
              <div className="relative z-10">
                <div className="inline-block text-xs font-bold uppercase tracking-widest text-[#0a0f0d] bg-emerald-400 px-3 py-1 rounded-full mb-6">
                  Boarding (Full Program)
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-3 leading-tight">
                  Kurikulum IT Tuntas<br />&amp; Karakter 24 Jam
                </h3>
                <p className="text-white/50 mb-8 leading-relaxed">
                  Siswa tinggal di asrama dengan pengawasan penuh. Pembentukan karakter, disiplin, dan pembelajaran IT yang mendalam.
                </p>
                <ul className="space-y-3">
                  {[
                    "Tahfidz & Qur'an (Subuh & Maghrib)",
                    "Pembinaan Karakter & Kemandirian",
                    "Lingkungan Islami & Positif",
                    "Pengawasan & Mentoring 24 Jam",
                    "Kurikulum Coding, IoT & Multimedia",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                      <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.285 6.709l-11.285 11.285-5.285-5.285 1.415-1.414 3.87 3.87 9.87-9.87 1.415 1.414z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Full Day Card */}
            <div className="relative p-8 md:p-10 rounded-3xl border border-white/10 bg-white/5 overflow-hidden group hover:border-white/20 transition-all">
              <div className="relative z-10">
                <div className="inline-block text-xs font-bold uppercase tracking-widest text-white/60 bg-white/10 px-3 py-1 rounded-full mb-6">
                  Full Day (Program Utama)
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-3 leading-tight">
                  Fokus Keahlian IT<br />&amp; Kurikulum Nasional
                </h3>
                <p className="text-white/50 mb-8 leading-relaxed">
                  Senin – Jumat, 07:30–15:00. Pilihan tepat bagi yang tinggal dekat keluarga dengan kegiatan ekstrakurikuler aktif.
                </p>
                <ul className="space-y-3">
                  {[
                    "Kurikulum Nasional (Diknas)",
                    "Fokus Keahlian IT (Coding, IoT, Multimedia)",
                    "Persiapan Karir & Kuliah",
                    "Project-Based Learning",
                    "Tryout UTBK Bulanan",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                      <svg className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.285 6.709l-11.285 11.285-5.285-5.285 1.415-1.414 3.87 3.87 9.87-9.87 1.415 1.414z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FITUR PPDB === */}
      <section id="fitur" className="py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">Fitur SPMB</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Proses Pendaftaran<br />yang Revolusioner</h2>
            <p className="text-white/50 max-w-xl mx-auto">Pengalaman daftar yang modern, transparan, dan tanpa ribet — dari mana saja, kapan saja.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🧭", title: "Sistem Terpandu", desc: "Formulir bertahap yang memandu orang tua langkah demi langkah tanpa membingungkan." },
              { icon: "📄", title: "Manajemen Dokumen", desc: "Unggah semua berkas dalam format JPG, PNG, atau PDF secara aman di satu tempat." },
              { icon: "🚀", title: "Verifikasi Cepat", desc: "Tim kami memverifikasi berkas Anda berkala — pantau progres secara real-time." },
              { icon: "🎯", title: "Keputusan Transparan", desc: "Hasil penerimaan diinformasikan langsung di dashboard pribadi Anda." },
            ].map((f, i) => (
              <div key={i} className="p-7 rounded-2xl border border-white/10 bg-white/5 hover:border-emerald-500/30 hover:bg-emerald-950/20 transition-all group">
                <div className="text-3xl mb-5">{f.icon}</div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-emerald-300 transition-colors">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === STEPS / ALUR PENDAFTARAN === */}
      <section className="py-32 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">Alur Pendaftaran</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">4 Langkah Mudah</h2>
            <p className="text-white/50 max-w-xl mx-auto">Selesaikan pendaftaran dalam kurang dari 10 menit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            {[
              { step: "01", title: "Buat Akun", desc: "Daftarkan email dan buat password untuk akun orang tua Anda." },
              { step: "02", title: "Isi Formulir", desc: "Lengkapi data diri siswa, pilih program, dan jenjang yang diinginkan." },
              { step: "03", title: "Upload Berkas", desc: "Unggah dokumen persyaratan seperti rapor, akta, dan KK." },
              { step: "04", title: "Pantau Status", desc: "Cek dashboard Anda untuk update verifikasi dan hasil seleksi." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-500/50 bg-emerald-900/30 flex items-center justify-center mx-auto mb-6 text-emerald-400 font-black text-lg">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FAQ === */}
      <section id="faq" className="py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Pertanyaan Umum</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Apakah ijazah yang didapatkan resmi dan diakui?",
                a: "Sangat resmi. Siswa mendapatkan Ijazah Paket C yang setara SMA dan diakui secara nasional, untuk kuliah maupun melamar kerja.",
              },
              {
                q: "Apa perbedaan Boarding dan Full Day?",
                a: "Boarding: siswa tinggal di asrama dengan pengawasan 24 jam, cocok untuk pembentukan karakter mendalam. Full Day: sekolah Senin–Jumat pukul 07:30–15:00, cocok bagi yang tinggal dekat keluarga.",
              },
              {
                q: "Apakah biayanya bisa dicicil?",
                a: "Ya. KODEIN menyediakan sistem pembayaran fleksibel (cicilan) untuk meringankan beban biaya pendidikan.",
              },
              {
                q: "Bagaimana jika anak saya belum mengerti IT sama sekali?",
                a: "Jangan khawatir. Kurikulum kami dirancang dari nol (dasar) dan guru-guru kami membimbing dengan penuh kesabaran hingga siswa mahir.",
              },
              {
                q: "Setelah lulus, apakah anak bisa kuliah atau kerja?",
                a: "Sangat bisa. Lulusan kami dibekali portofolio nyata dan sertifikat profesi resmi, siap bersaing di dunia kerja digital atau melanjutkan ke perguruan tinggi.",
              },
            ].map((item, i) => (
              <details key={i} className="group border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
                <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer font-semibold text-white/90 hover:text-white list-none">
                  {item.q}
                  <svg
                    className="w-5 h-5 text-emerald-400 flex-shrink-0 transition-transform group-open:rotate-45"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-white/50 text-sm leading-relaxed border-t border-white/10 pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-emerald-500/30 bg-emerald-950/30 p-12 sm:p-20 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-600/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-800/20 blur-[100px] rounded-full" />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-6">Daftar Sekarang</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Siap Membangun<br />Masa Depan Digital?
              </h2>
              <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Bergabunglah bersama ribuan pendaftar lainnya. Proses pendaftaran hanya memakan waktu kurang dari 10 menit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 text-base font-bold bg-emerald-500 text-[#0a0f0d] px-10 py-4 rounded-full hover:bg-emerald-400 transition-all"
                >
                  Daftar Sekarang
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="https://wa.me/6282170270241"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-base font-semibold text-white border border-white/20 px-10 py-4 rounded-full hover:border-white/50 transition-all"
                >
                  💬 Chat Admin WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer id="kontak" className="border-t border-white/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <span className="text-[#0a0f0d] font-black text-sm">K</span>
                </div>
                <span className="text-xl font-black tracking-tight">
                  SPMB<span className="text-emerald-400">KODEIN</span>
                </span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                Boarding School fokus IT, menggabungkan teknologi dengan nilai Islami untuk membentuk generasi kreatif dan berintegritas.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-6">Tautan</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><a href="#program" className="hover:text-emerald-400 transition-colors">Program</a></li>
                <li><a href="#fitur" className="hover:text-emerald-400 transition-colors">Fitur SPMB</a></li>
                <li><a href="/login" className="hover:text-emerald-400 transition-colors">Masuk</a></li>
                <li><a href="/register" className="hover:text-emerald-400 transition-colors">Daftar</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-6">Kontak</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li>info@kodein.edu</li>
                <li>+62-821-7027-0241</li>
                <li>Jl. Digital No. 1, Jakarta</li>
                <li>
                  <a
                    href="https://kodein.sch.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    kodein.sch.id ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/30">
            <p>© 2026 SPMB KODEIN — Sekolah Developer Indonesia. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}