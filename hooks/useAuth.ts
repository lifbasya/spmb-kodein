'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    session,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    status,
  };
}

export function useRequireAuth(requiredRole?: string) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (!isLoading && requiredRole && user?.role !== requiredRole) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user?.role, requiredRole, router]);

  return { user, isAuthenticated, isLoading };
}
