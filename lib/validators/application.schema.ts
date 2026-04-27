import { z } from 'zod';

export const CreateApplicationSchema = z.object({
  fullName: z.string().min(1, 'Nama lengkap harus diisi'),
  nisn: z.string().optional(),
  birthPlace: z.string().min(1, 'Tempat lahir harus diisi'),
  birthDate: z.string().min(1, 'Tanggal lahir harus diisi'),
  gender: z.enum(['MALE', 'FEMALE'], { message: 'Jenis kelamin harus dipilih' }),
  address: z.string().min(1, 'Alamat harus diisi'),
  phone: z.string().min(7, 'Nomor telepon tidak valid'),
  schoolOrigin: z.string().min(1, 'Asal sekolah harus diisi'),
  parentName: z.string().min(1, 'Nama orang tua harus diisi'),
  parentPhone: z.string().min(7, 'Nomor telepon orang tua tidak valid'),
});

export const UpdateApplicationSchema = CreateApplicationSchema.partial();

export const SubmitApplicationSchema = z.object({
  applicationId: z.string().cuid('ID aplikasi tidak valid'),
});

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof UpdateApplicationSchema>;
export type SubmitApplicationInput = z.infer<typeof SubmitApplicationSchema>;
