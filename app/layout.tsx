import type { Metadata } from "next";
import { ClientProviders } from "@/components/providers/ClientProviders";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "SPMB Kodein - Sistem Penerimaan Siswa Baru",
  description: "Platform pendaftaran siswa baru yang mudah dan terpercaya",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
