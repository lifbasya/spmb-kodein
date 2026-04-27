"use client";

import { useState, useEffect, useCallback } from "react";

export type DocumentType =
  | "FAMILY_CARD"
  | "BIRTH_CERTIFICATE"
  | "REPORT_CARD"
  | "PHOTO";

export interface DocumentRecord {
  id: string;
  applicationId: string;
  type: DocumentType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
}

export interface UploadState {
  isUploading: boolean;
  isDeleting: boolean;
  error: string | null;
  success: string | null;
}

const DOCUMENT_LABELS: Record<DocumentType, string> = {
  FAMILY_CARD: "Kartu Keluarga",
  BIRTH_CERTIFICATE: "Akta Kelahiran",
  REPORT_CARD: "Kartu Rapor / Ijazah",
  PHOTO: "Foto 3x4",
};

export const DOCUMENT_TYPES: DocumentType[] = [
  "FAMILY_CARD",
  "BIRTH_CERTIFICATE",
  "REPORT_CARD",
  "PHOTO",
];

export function getDocumentLabel(type: DocumentType): string {
  return DOCUMENT_LABELS[type];
}

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [status, setStatus] = useState<string>("DRAFT");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [uploadStates, setUploadStates] = useState<
    Record<DocumentType, UploadState>
  >(
    Object.fromEntries(
      DOCUMENT_TYPES.map((type) => [
        type,
        { isUploading: false, isDeleting: false, error: null, success: null },
      ]),
    ) as Record<DocumentType, UploadState>,
  );

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (data.success) {
        setDocuments(data.data.documents);
        setStatus(data.data.status);
      } else {
        setFetchError(data.message || "Gagal memuat dokumen");
      }
    } catch {
      setFetchError("Terjadi kesalahan saat memuat dokumen");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const setTypeState = (
    type: DocumentType,
    patch: Partial<UploadState>,
  ) => {
    setUploadStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], ...patch },
    }));
  };

  const clearTypeMessages = (type: DocumentType, delay = 4000) => {
    setTimeout(
      () => setTypeState(type, { error: null, success: null }),
      delay,
    );
  };

  const uploadDocument = async (
    type: DocumentType,
    file: File,
  ): Promise<boolean> => {
    setTypeState(type, { isUploading: true, error: null, success: null });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setTypeState(type, {
          isUploading: false,
          error: data.message || "Gagal mengupload",
        });
        clearTypeMessages(type);
        return false;
      }

      setTypeState(type, {
        isUploading: false,
        success: "Berhasil diupload",
      });
      clearTypeMessages(type);
      await fetchDocuments(); // refresh list
      return true;
    } catch {
      setTypeState(type, {
        isUploading: false,
        error: "Terjadi kesalahan saat upload",
      });
      clearTypeMessages(type);
      return false;
    }
  };

  const deleteDocument = async (
    documentId: string,
    type: DocumentType,
  ): Promise<boolean> => {
    setTypeState(type, { isDeleting: true, error: null, success: null });

    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setTypeState(type, {
          isDeleting: false,
          error: data.message || "Gagal menghapus",
        });
        clearTypeMessages(type);
        return false;
      }

      setTypeState(type, {
        isDeleting: false,
        success: "Dokumen dihapus",
      });
      clearTypeMessages(type);
      await fetchDocuments();
      return true;
    } catch {
      setTypeState(type, {
        isDeleting: false,
        error: "Terjadi kesalahan saat menghapus",
      });
      clearTypeMessages(type);
      return false;
    }
  };

  const getDocumentByType = (type: DocumentType): DocumentRecord | undefined =>
    documents.find((d) => d.type === type);

  return {
    documents,
    isLoading,
    fetchError,
    uploadStates,
    uploadDocument,
    deleteDocument,
    getDocumentByType,
    refetch: fetchDocuments,
    status,
  };
}
