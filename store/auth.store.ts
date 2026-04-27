import { create } from 'zustand';
import { Session } from 'next-auth';

interface AuthStore {
  session: Session | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  isLoading: false,
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
}));
