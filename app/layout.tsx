import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'SPMB Kodein - Sistem Penerimaan Siswa Baru',
  description: 'Platform pendaftaran siswa baru yang mudah dan terpercaya',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="id">
      <body className="antialiased">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
