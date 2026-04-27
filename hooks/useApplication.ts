"use client";

import { useState, useEffect, useCallback } from "react";

export interface ApplicationData {
  id: string;
  applicantId: string;
  status: string;
  schoolOrigin?: string;
  parentName?: string;
  parentPhone?: string;
  verifiedAt?: string;
  decidedAt?: string;
  createdAt: string;
  documents?: Array<{
    id: string;
    type: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
  }>;
}

export interface ApplicantData {
  id: string;
  userId: string;
  fullName: string;
  nisn?: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  address: string;
  phone: string;
}

export interface UpdateApplicationPayload {
  fullName?: string;
  nisn?: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  phone?: string;
  schoolOrigin?: string;
  parentName?: string;
  parentPhone?: string;
}

export function useApplication() {
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [applicant, setApplicant] = useState<ApplicantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Ensure DRAFT application exists (idempotent)
      await fetch("/api/application", { method: "POST" });

      // Fetch application
      const appRes = await fetch("/api/application");
      const appData = await appRes.json();

      if (appData.success) {
        setApplication(appData.data);
      } else if (appRes.status !== 404) {
        setError(appData.message || "Gagal memuat data aplikasi");
      }

      // Fetch applicant profile
      const applicantRes = await fetch("/api/applicant");
      const applicantData = await applicantRes.json();

      if (applicantData.success) {
        setApplicant(applicantData.data);
      }
    } catch (err) {
      console.error("useApplication fetch error:", err);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateApplication = async (
    payload: UpdateApplicationPayload,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch("/api/application", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Gagal menyimpan" };
      }

      // Refresh local state
      await fetchData();
      return { success: true, message: "Data berhasil disimpan" };
    } catch (err) {
      console.error("updateApplication error:", err);
      return { success: false, message: "Terjadi kesalahan saat menyimpan" };
    }
  };

  const submitApplication = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const res = await fetch("/api/application/submit", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Gagal submit aplikasi",
        };
      }

      // Refresh local state
      await fetchData();
      return { success: true, message: data.message || "Aplikasi berhasil disubmit" };
    } catch (err) {
      console.error("submitApplication error:", err);
      return { success: false, message: "Terjadi kesalahan saat submit" };
    }
  };

  return {
    application,
    applicant,
    isLoading,
    error,
    refetch: fetchData,
    updateApplication,
    submitApplication,
  };
}
