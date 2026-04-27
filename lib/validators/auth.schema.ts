import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  nisn: z.string().optional(),
  birthPlace: z.string().min(1, "Tempat lahir wajib diisi"),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.string().min(1, "Jenis kelamin wajib dipilih"),
  religion: z.string().min(1, "Agama wajib dipilih"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  phone: z.string().min(10, "Nomor telepon minimal 10 karakter"),
  schoolOrigin: z.string().min(1, "Asal sekolah wajib diisi"),
  parentName: z.string().min(1, "Nama orang tua wajib diisi"),
  parentPhone: z.string().min(1, "Nomor telepon orang tua wajib diisi"),
  documents: z.array(z.object({
    type: z.string(),
    fileUrl: z.string(),
    fileName: z.string(),
    cloudId: z.string().optional(),
  })).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export const LoginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password harus diisi"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
