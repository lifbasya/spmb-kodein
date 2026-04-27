"use client";

import { useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useDocuments,
  DOCUMENT_TYPES,
  getDocumentLabel,
  DocumentType,
} from "@/hooks/useDocuments";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "📄";
  if (ext === "png" || ext === "jpg" || ext === "jpeg") return "🖼️";
  return "📎";
}

// ─── Per-document Upload Card ────────────────────────────────────────────────

interface DocumentCardProps {
  type: DocumentType;
  onUpload: (type: DocumentType, file: File) => Promise<boolean>;
  onDelete: (id: string, type: DocumentType) => Promise<boolean>;
  existing?: {
    id: string;
    fileName: string;
    fileSize: number;
    fileUrl: string;
    createdAt: string;
  };
  state: {
    isUploading: boolean;
    isDeleting: boolean;
    error: string | null;
    success: string | null;
  };
  disabled?: boolean;
}

function DocumentCard({
  type,
  onUpload,
  onDelete,
  existing,
  state,
  disabled = false,
}: DocumentCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const label = getDocumentLabel(type);
  const isBusy = state.isUploading || state.isDeleting || disabled;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (!file) return;
    await onUpload(type, file);
    // Reset input so same file can be re-selected after error
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={`rounded-xl border-2 p-5 transition-all ${
        existing
          ? "border-green-300 bg-green-50"
          : "border-gray-200 bg-white hover:border-blue-300"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{label}</h3>
          <p className="text-xs text-gray-500 mt-0.5">JPG, PNG, atau PDF · maks. 2 MB</p>
        </div>

        {/* Status badge */}
        {existing ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
            ✓ Uploaded
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            ○ Belum
          </span>
        )}
      </div>

      {/* Existing file info */}
      {existing && (
        <div className="flex items-center gap-3 mb-3 p-3 bg-white rounded-lg border border-green-200">
          <span className="text-2xl">{getFileIcon(existing.fileName)}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {existing.fileName}
            </p>
            <p className="text-xs text-gray-500">{formatBytes(existing.fileSize)}</p>
          </div>
          <a
            href={existing.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline whitespace-nowrap"
          >
            Lihat
          </a>
        </div>
      )}

      {/* Inline feedback messages */}
      {state.error && (
        <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          ❌ {state.error}
        </div>
      )}
      {state.success && (
        <div className="mb-3 text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          ✅ {state.success}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          id={`file-input-${type}`}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={isBusy}
        />

        <button
          id={`btn-upload-${type}`}
          onClick={() => inputRef.current?.click()}
          disabled={isBusy}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            existing
              ? "border-blue-300 text-blue-700 hover:bg-blue-50"
              : "border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {state.isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
              Mengupload...
            </span>
          ) : existing ? (
            "Ganti File"
          ) : (
            "Upload"
          )}
        </button>

        {existing && (
          <button
            id={`btn-delete-${type}`}
            onClick={() => onDelete(existing.id, type)}
            disabled={isBusy}
            className="text-sm font-medium py-2 px-3 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isDeleting ? (
              <span className="animate-spin inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              "Hapus"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const { isLoading: authLoading } = useAuth();
  const {
    documents,
    isLoading,
    fetchError,
    uploadStates,
    uploadDocument,
    deleteDocument,
    getDocumentByType,
    status,
  } = useDocuments();

  const isLocked = status !== "DRAFT";

  const uploadedCount = documents.length;
  const totalRequired = DOCUMENT_TYPES.length;
  const progressPct = Math.round((uploadedCount / totalRequired) * 100);
  const allUploaded = uploadedCount === totalRequired;

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat dokumen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* ── Page Header ──────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Upload Dokumen</h1>
          <p className="text-gray-600 mt-1">
            Upload semua dokumen persyaratan untuk melengkapi pendaftaran Anda.
          </p>
        </div>

        {/* ── Status Info ────────────────────────────── */}
        {isLocked && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm">
            <p className="font-bold">⚠️ Dokumen Terkunci</p>
            <p>Aplikasi Anda sudah dalam status <strong>{status}</strong>. Dokumen tidak dapat diubah lagi.</p>
          </div>
        )}

        {/* ── Fetch Error ──────────────────────────────── */}
        {fetchError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            ⚠️ {fetchError}
          </div>
        )}

        {/* ── Progress Bar ─────────────────────────────── */}
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress Dokumen
            </span>
            <span className="text-sm font-medium text-blue-600">
              {uploadedCount}/{totalRequired}
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                backgroundColor: allUploaded ? "#16a34a" : "#2563eb",
              }}
            />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            {allUploaded
              ? "✅ Semua dokumen telah diupload!"
              : `${totalRequired - uploadedCount} dokumen lagi perlu diupload`}
          </p>
        </div>

        {/* ── Document Cards ────────────────────────────── */}
        <div className="space-y-4">
          {DOCUMENT_TYPES.map((type) => (
            <DocumentCard
              key={type}
              type={type}
              existing={getDocumentByType(type)}
              state={uploadStates[type]}
              onUpload={uploadDocument}
              onDelete={deleteDocument}
              disabled={isLocked}
            />
          ))}
        </div>

        {/* ── Info Box ──────────────────────────────────── */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
          <p className="font-semibold mb-2">📋 Ketentuan Upload:</p>
          <ul className="space-y-1 text-xs">
            <li>• Format file: JPG, PNG, atau PDF</li>
            <li>• Ukuran maksimal: 2 MB per file</li>
            <li>• Anda dapat mengganti dokumen dengan mengklik "Ganti File"</li>
            <li>• Semua dokumen harus diupload sebelum submit aplikasi</li>
          </ul>
        </div>

        {/* ── Navigation ────────────────────────────────── */}
        <div className="mt-6 flex gap-3">
          <a
            href="/application"
            className="btn-secondary text-sm text-center"
          >
            ← Formulir Aplikasi
          </a>
          <a
            href="/status"
            className="flex-1 text-center btn-primary text-sm"
          >
            Lihat Status →
          </a>
        </div>
      </div>
    </div>
  );
}
