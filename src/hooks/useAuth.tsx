
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getCurrentUser as authGetCurrentUser, logOut as authLogOut, type User } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  logOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkUser = useCallback(() => {
    const currentUser = authGetCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkUser();
  }, [pathname, checkUser]);

  const logOut = () => {
    authLogOut();
    setUser(null);
    router.push('/login');
  };
  
  // This effect listens for storage changes from other tabs to keep auth state in sync.
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'migreen_session' || event.key === 'migreen_users') {
        checkUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkUser]);

  const value = { user, logOut, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
