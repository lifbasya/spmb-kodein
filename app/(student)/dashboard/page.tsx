import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Get applicant data
  const applicant = await prisma.applicant.findUnique({
    where: { userId: session.user.id },
    include: {
      application: {
        include: {
          documents: true,
        },
      },
    },
  });

  const applicationStatus = applicant?.application?.status || 'DRAFT';
  const documentCount = applicant?.application?.documents.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">SPMB Kodein</h1>
          <div className="space-x-4">
            <span className="text-gray-600">{session.user.email}</span>
            <a href="/api/auth/signout" className="btn-secondary">
              Keluar
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Welcome Card */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-2">Selamat datang, {applicant?.fullName || 'Calon Siswa'}!</h2>
            <p className="text-gray-600">
              Lengkapi formulir pendaftaran, unggah dokumen, dan pantau status aplikasi Anda.
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Status Aplikasi</h3>
            <p className="text-2xl font-bold text-blue-600">{applicationStatus}</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Formulir Aplikasi',
              desc: 'Lengkapi data pribadi Anda',
              href: '/application',
              color: 'bg-blue-100 border-blue-300',
              textColor: 'text-blue-700',
            },
            {
              title: 'Unggah Dokumen',
              desc: `${documentCount} dokumen terupload`,
              href: '/documents',
              color: 'bg-green-100 border-green-300',
              textColor: 'text-green-700',
            },
            {
              title: 'Status Verifikasi',
              desc: 'Lihat progress verifikasi',
              href: '/status',
              color: 'bg-purple-100 border-purple-300',
              textColor: 'text-purple-700',
            },
            {
              title: 'Panduan',
              desc: 'Baca petunjuk lengkap',
              href: '#',
              color: 'bg-orange-100 border-orange-300',
              textColor: 'text-orange-700',
            },
          ].map((item) => (
            <a
              key={item.title}
              href={item.href}
              className={`border-2 rounded-lg p-6 hover:shadow-lg transition-all ${item.color}`}
            >
              <h4 className={`font-bold ${item.textColor} mb-2`}>{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </a>
          ))}
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
          <p className="font-bold text-yellow-800 mb-2">⚠️ Penting:</p>
          <ul className="text-yellow-700 space-y-1 text-sm">
            <li>✓ Lengkapi semua data pribadi sebelum submit</li>
            <li>✓ Unggah semua dokumen yang diperlukan (Kartu Keluarga, Akte Lahir, Kartu Rapor, Foto)</li>
            <li>✓ Setelah submit, Anda tidak dapat mengubah data lagi</li>
            <li>✓ Tunggu notifikasi verifikasi dari admin</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
