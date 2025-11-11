import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'top_management' | 'project_owner' | 'project_manager' | 'project_officer' | 'system_admin';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('proven_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    // Mock authentication - in production, this would call an API
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role,
    };
    
    setUser(mockUser);
    localStorage.setItem('proven_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('proven_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
