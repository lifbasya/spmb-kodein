'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ApplicationData {
  fullName: string;
  nisn: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  address: string;
  phone: string;
  schoolOrigin: string;
  parentName: string;
  parentPhone: string;
}

export default function ApplicationPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [appStatus, setAppStatus] = useState('DRAFT');
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '',
    nisn: '',
    birthPlace: '',
    birthDate: '',
    gender: '',
    address: '',
    phone: '',
    schoolOrigin: '',
    parentName: '',
    parentPhone: '',
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      fetchApplication();
    }
  }, [user]);

  const fetchApplication = async () => {
    try {
      const response = await fetch('/api/application', {
        method: 'GET',
      });
      const data = await response.json();

      if (data.success) {
        setAppStatus(data.data.status);
        // Load applicant data
        const applicantResponse = await fetch('/api/applicant');
        const applicantData = await applicantResponse.json();
        if (applicantData.success) {
          const app = applicantData.data;
          setFormData({
            fullName: app.fullName || '',
            nisn: app.nisn || '',
            birthPlace: app.birthPlace || '',
            birthDate: app.birthDate?.split('T')[0] || '',
            gender: app.gender || '',
            address: app.address || '',
            phone: app.phone || '',
            schoolOrigin: data.data.schoolOrigin || '',
            parentName: data.data.parentName || '',
            parentPhone: data.data.parentPhone || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/application', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to save application');
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError('Error saving application');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!confirm('Setelah submit, Anda tidak dapat mengubah data lagi. Lanjutkan?')) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/application/submit', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to submit application');
        return;
      }

      setAppStatus(data.data.status);
      alert('Aplikasi berhasil disubmit! Silakan upload dokumen.');
      router.push('/documents');
    } catch (error) {
      setError('Error submitting application');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-2">Formulir Aplikasi</h1>
          <p className="text-gray-600 mb-6">Lengkapi data pribadi dan aplikasi Anda</p>

          {appStatus !== 'DRAFT' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-lg text-blue-700">
              ℹ️ Aplikasi Anda sedang dalam status: <strong>{appStatus}</strong>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✅ Data berhasil disimpan
            </div>
          )}

          {appStatus === 'DRAFT' ? (
            <>
              {/* Personal Data Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b">Data Pribadi</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nisn" className="block text-sm font-medium text-gray-700 mb-1">
                        NISN
                      </label>
                      <input
                        id="nisn"
                        name="nisn"
                        type="text"
                        value={formData.nisn}
                        onChange={handleInputChange}
                        className="input-field"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Jenis Kelamin *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="input-field"
                        disabled={loading}
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="MALE">Laki-laki</option>
                        <option value="FEMALE">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-1">
                        Tempat Lahir *
                      </label>
                      <input
                        id="birthPlace"
                        name="birthPlace"
                        type="text"
                        required
                        value={formData.birthPlace}
                        onChange={handleInputChange}
                        className="input-field"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Lahir *
                      </label>
                      <input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        required
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="input-field"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Telepon *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-field"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Application Data Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b">Data Aplikasi</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="schoolOrigin" className="block text-sm font-medium text-gray-700 mb-1">
                      Asal Sekolah *
                    </label>
                    <input
                      id="schoolOrigin"
                      name="schoolOrigin"
                      type="text"
                      required
                      value={formData.schoolOrigin}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Orang Tua/Wali *
                    </label>
                    <input
                      id="parentName"
                      name="parentName"
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Telepon Orang Tua/Wali *
                    </label>
                    <input
                      id="parentPhone"
                      name="parentPhone"
                      type="tel"
                      required
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      className="input-field"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Memproses...' : 'Submit Aplikasi'}
                </button>
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-lg text-yellow-800">
              <p className="font-semibold mb-2">⚠️ Aplikasi Terkunci</p>
              <p>Aplikasi Anda telah disubmit dan tidak dapat diubah lagi.</p>
              <p className="mt-2">Status saat ini: <strong>{appStatus}</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
