# SPMB Kodein (Sistem Pendaftaran Mahasiswa Baru)

Sistem Pendaftaran Mahasiswa Baru yang dibangun dangan **Next.js 16 (App Router)** dan **Prisma 7**.

## 🛠 Tech Stack
- **Frontend**: Next.js 16, TailwindCSS, Framer Motion
- **Backend**: Next.js App Router (Server Actions & Route Handlers)
- **Database**: PostgreSQL (dangan Prisma 7 Driver Adapter)
- **Auth**: Next-Auth v4

---

## 🚀 Panduan Setup Awal (Cloning & Running)

### 1. Prasyarat
- Node.js versi 18 ke atas
- PostgreSQL yang sudah berjalan lokal atau cloud

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (Env)
Salin file `.env.example` menjadi `.env` dan isi variabelnya:
```bash
cp .env.example .env
```
Wajib isi:
- `DATABASE_URL`: URL PostgreSQL Anda.
- `NEXTAUTH_SECRET`: Gunakan random string (bisa pakai `openssl rand -base64 32`).

### 4. Setup Database (Penting: Standar Prisma 7)
Proyek ini menggunakan **Prisma 7**. Pastikan Anda menjalankan perintah berikut untuk mensinkronkan skema dan mengisi data awal (Admin):

```bash
# Sinkronisasi Skema ke Database
npx prisma db push

# Mengisi Data Seed (Admin Demo)
npx prisma db seed
```

### 5. Jalankan Aplikasi
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000)

---

## 🎮 Akun Demo Admin
- **Email**: `admin@kodein.com`
- **Password**: `Admin123!`

---

## 🏗 Struktur Penting (Next.js 16 & Prisma 7)
- **`prisma.config.ts`**: File konfigurasi utama Prisma 7 (pengganti konfigurasi di `package.json`).
- **`proxy.ts`**: Handler rute global (pengganti `middleware.ts` yang sudah deprecated di Next.js 16).
- **`prisma/schema.prisma`**: Skema database tanpa properti `url` (karena dikelola oleh driver adapter di `lib/prisma.ts`).

---

## 📝 Catatan Tambahan
Jika Anda menemukan peringatan `scroll-behavior: smooth` di konsol browser, hal tersebut adalah standar peringatan UX Next.js 16 dan tidak mempengaruhi fungsionalitas inti aplikasi.