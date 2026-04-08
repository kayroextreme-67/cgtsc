import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getUserById, getUserByEmail, createUser } from '../lib/db';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUserId = localStorage.getItem('cgtsc_user_id');
      if (storedUserId) {
        const dbUser = await getUserById(storedUserId);
        if (dbUser) {
          setUser(dbUser);
        } else {
          localStorage.removeItem('cgtsc_user_id');
        }
      }
      setLoading(false);
    };
    loadUser();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncFirebaseUser(firebaseUser);
      } else {
        setUser(null);
        localStorage.removeItem('cgtsc_user_id');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const syncFirebaseUser = async (authUser: any) => {
    try {
      let dbUser = await getUserById(authUser.uid);
      
      if (!dbUser && authUser.email) {
        dbUser = await getUserByEmail(authUser.email);
      }

      const isAdminEmail = authUser.email === 'ahnafa870@gmail.com';

      if (!dbUser) {
        // Create user in our custom table if they don't exist
        dbUser = await createUser({
          id: authUser.uid,
          email: authUser.email || '',
          name: authUser.displayName || (authUser.email ? authUser.email.split('@')[0] : 'User'),
          role: isAdminEmail ? 'admin' : 'visitor',
          status: isAdminEmail ? 'approved' : 'pending',
        });
        if (!dbUser) {
          console.error('Failed to create user profile in database.');
          return;
        }
      } else if (isAdminEmail && (dbUser.role !== 'admin' || dbUser.status !== 'approved')) {
        // Auto-upgrade the specific email to admin if they are not already
        const { updateUser } = await import('../lib/db');
        const updated = await updateUser(dbUser.id, { role: 'admin', status: 'approved' });
        if (updated) {
          dbUser = updated;
        }
      }

      if (dbUser) {
        login(dbUser);
      }
    } catch (error: any) {
      console.error("Error syncing user:", error);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('cgtsc_user_id', userData.id);
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('cgtsc_user_id');
      await signOut(auth);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const refreshUser = async () => {
    if (user?.id) {
      const dbUser = await getUserById(user.id);
      if (dbUser) {
        setUser(dbUser);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
