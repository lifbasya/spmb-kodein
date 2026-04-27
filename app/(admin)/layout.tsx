import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-400">Admin SPMB</h2>
          <p className="text-xs text-slate-400 mt-1">Management Portal</p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/applicants"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Pendaftar
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{session.user.email}</p>
              <p className="text-xs text-slate-500 capitalize">{session.user.role}</p>
            </div>
          </div>
          <a
            href="/api/auth/signout"
            className="mt-2 block text-center py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Keluar
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 md:hidden">
            <h2 className="text-xl font-bold text-blue-600">Admin SPMB</h2>
            {/* Mobile menu toggle would go here */}
        </header>
        <main className="p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
