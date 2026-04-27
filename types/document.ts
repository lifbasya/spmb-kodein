export type DocumentType = 
  | 'FAMILY_CARD' 
  | 'BIRTH_CERTIFICATE' 
  | 'REPORT_CARD' 
  | 'PHOTO';

export interface Document {
  id: string;
  applicationId: string;
  type: DocumentType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: Date;
}
