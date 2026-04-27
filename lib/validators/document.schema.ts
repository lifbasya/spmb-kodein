import { z } from 'zod';

export const DocumentTypeEnum = z.enum([
  'FAMILY_CARD',
  'BIRTH_CERTIFICATE',
  'REPORT_CARD',
  'PHOTO',
]);

export const UploadDocumentSchema = z.object({
  applicationId: z.string().cuid('ID aplikasi tidak valid'),
  type: DocumentTypeEnum,
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, 'Ukuran file maksimal 2MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type),
      'Format file harus JPG, PNG, atau PDF'
    ),
});

export type UploadDocumentInput = z.infer<typeof UploadDocumentSchema>;
