import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">SPMB Kodein</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-blue-600">
              Masuk
            </Link>
            <Link href="/register" className="btn-primary">
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-white text-center py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Selamat Datang di SPMB</h2>
          <p className="text-xl mb-8">
            Sistem Penerimaan Siswa Baru yang mudah, cepat, dan terpercaya
          </p>
          <div className="space-x-4">
            <Link
              href="/register"
              className="inline-block btn-primary bg-white text-blue-600 hover:bg-gray-100"
            >
              Mulai Pendaftaran
            </Link>
            <Link
              href="/login"
              className="inline-block btn-secondary border-2 border-white text-white hover:bg-white/10"
            >
              Sudah Punya Akun?
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">
            Keunggulan Kami
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Mudah Digunakan",
                desc: "Interface yang intuitif dan user-friendly",
              },
              {
                title: "Aman",
                desc: "Enkripsi data dan keamanan tingkat tinggi",
              },
              {
                title: "Cepat",
                desc: "Proses verifikasi yang efisien dan transparan",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 border border-gray-200 rounded-lg text-center"
              >
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 SPMB Kodein. Semua hak dilindungi.</p>
        </div>
      </footer>
    </main>
  );
}
