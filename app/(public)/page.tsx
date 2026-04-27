import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Dynamic Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <span className="text-3xl font-black text-blue-600 tracking-tighter">SPMB<span className="text-slate-900">KODEIN</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
               <a href="#features" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Fitur</a>
               <a href="#about" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Tentang</a>
               <Link href="/login" className="text-sm font-bold text-slate-900 px-6 py-2.5 rounded-full border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                Masuk
               </Link>
               <Link href="/register" className="text-sm font-bold bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all">
                Daftar Sekarang
               </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Glassmorphism */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img 
            src="/school_hero_bg_1777297755295.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-10 blur-[100px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-8 animate-fade-in">
             ✨ Penerimaan Siswa Baru 2026 Telah Dibuka
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8">
            Gateway to <br /> <span className="text-blue-600 italic">Excellence.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12 leading-relaxed">
            Mulai perjalanan akademik putra-putri Anda bersama kami. Platform pendaftaran mandiri yang modern, cepat, dan transparan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link href="/register" className="w-full sm:w-auto text-lg font-bold bg-blue-600 text-white px-10 py-5 rounded-full hover:bg-blue-700 transform hover:-translate-y-1 transition-all shadow-xl shadow-blue-200">
               Daftar Sekarang
             </Link>
             <Link href="/login" className="w-full sm:w-auto text-lg font-bold bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-full hover:border-slate-300 transition-all">
               Masuk Dashboard
             </Link>
          </div>
          
          <div className="mt-20 relative px-4 sm:px-10">
             <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full scale-150"></div>
             <img 
               src="/school_hero_bg_1777297755295.png" 
               alt="Modern Campus" 
               className="relative rounded-[2rem] sm:rounded-[4rem] shadow-2xl border-8 border-white object-cover aspect-video bg-slate-100"
             />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
             {[
               { title: "100%", desc: "Proses Online", icon: "🌐" },
               { title: "24/7", desc: "Akses Kapan Saja", icon: "🕒" },
               { title: "Real-time", desc: "Update Status", icon: "⚡" },
             ].map((stat, i) => (
               <div key={i} className="space-y-4">
                  <div className="text-4xl">{stat.icon}</div>
                  <h3 className="text-4xl font-black text-slate-900">{stat.title}</h3>
                  <p className="text-slate-500 font-medium">{stat.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-20 text-center">
               <h2 className="text-4xl font-black text-slate-900 mb-4">Mengapa Memilih Kami?</h2>
               <p className="text-slate-500">Kami menghadirkan pengalaman pendaftaran yang revolusioner bagi orang tua.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {[
                 { title: "Sistem Terpandu", desc: "Formulir yang dibagi menjadi beberapa tahap mempermudah pengisian bagi orang tua tanpa merasa terbebani.", icon: "🧭" },
                 { title: "Manajemen Dokumen", desc: "Unggah semua berkas persyaratan dalam format JPG, PNG, atau PDF secara aman di satu tempat.", icon: "📄" },
                 { title: "Verifikasi Cepat", desc: "Tim pendaftaran kami akan memverifikasi berkas Anda secara berkala, pantau progressnya secara langsung.", icon: "🚀" },
                 { title: "Keputusan Transparan", desc: "Keputusan penerimaan diinformasikan langsung melalui dashboard pribadi Anda.", icon: "🎯" },
               ].map((feat, i) => (
                 <div key={i} className="p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                      {feat.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{feat.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
         <div className="max-w-5xl mx-auto px-4">
            <div className="relative bg-slate-900 rounded-[3rem] p-12 sm:p-20 text-center overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
               <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Siap Membangun Masa Depan?</h2>
               <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">Gabunglah bersama ribuan pendaftar lainnya. Proses pendaftaran hanya memakan waktu kurang dari 10 menit.</p>
               <Link href="/register" className="inline-block text-lg font-bold bg-blue-600 text-white px-10 py-5 rounded-full hover:bg-blue-700 transition-all">
                 Daftar Sekarang
               </Link>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100" id="about">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
               <div className="col-span-2">
                  <span className="text-2xl font-black text-blue-600 tracking-tighter">SPMB<span className="text-slate-900">KODEIN</span></span>
                  <p className="mt-6 text-slate-500 max-w-sm leading-relaxed">
                    Instansi pendidikan terdepan yang berfokus pada pengembangan bakat digital dan karakter siswa di era modern.
                  </p>
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 mb-6">Tautan Cepat</h4>
                  <ul className="space-y-4 text-slate-500 text-sm">
                     <li><a href="#" className="hover:text-blue-600 transition-colors">Beranda</a></li>
                     <li><a href="#features" className="hover:text-blue-600 transition-colors">Fitur</a></li>
                     <li><a href="/login" className="hover:text-blue-600 transition-colors">Masuk</a></li>
                     <li><a href="/register" className="hover:text-blue-600 transition-colors">Daftar</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 mb-6">Kontak</h4>
                  <ul className="space-y-4 text-slate-500 text-sm">
                     <li>info@kodein.edu</li>
                     <li>+62-123-4567-890</li>
                     <li>Jl. Digital No. 1, Jakarta</li>
                  </ul>
               </div>
            </div>
            <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
               <p>© 2026 SPMB KODEIN. All rights reserved.</p>
               <div className="flex gap-8">
                  <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
               </div>
            </div>
         </div>
      </footer>
    </main>
  );
}
