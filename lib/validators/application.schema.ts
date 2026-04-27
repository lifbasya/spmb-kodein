import { z } from "zod";

export const CreateApplicationSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap harus diisi"),
  nisn: z.string().optional(),
  birthPlace: z.string().min(1, "Tempat lahir harus diisi"),
  birthDate: z.string().min(1, "Tanggal lahir harus diisi"),
  gender: z.string().min(1, "Jenis kelamin wajib dipilih"),
  religion: z.string().min(1, "Agama wajib dipilih"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  phoneNumber: z.string().min(10, "Nomor telepon minimal 10 karakter"),
  schoolOrigin: z.string().min(1, "Asal sekolah wajib diisi"),
  parentName: z.string().min(1, "Nama orang tua wajib diisi"),
  parentPhone: z.string().min(1, "Nomor telepon orang tua wajib diisi"),
});

export const UpdateApplicationSchema = CreateApplicationSchema.partial();

export const SubmitApplicationSchema = z.object({
  applicationId: z.string().cuid("ID aplikasi tidak valid"),
});

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof UpdateApplicationSchema>;
export type SubmitApplicationInput = z.infer<typeof SubmitApplicationSchema>;
