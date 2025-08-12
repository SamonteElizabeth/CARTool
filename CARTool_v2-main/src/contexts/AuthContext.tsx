import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for different roles
const demoUsers: User[] = [
  {
    id: '1',
    email: 'lead.auditor@company.com',
    name: 'Sarah Johnson',
    role: 'lead_auditor',
    department: 'Quality Assurance'
  },
  {
    id: '2',
    email: 'auditor@company.com',
    name: 'Mike Chen',
    role: 'auditor',
    department: 'Internal Audit'
  },
  {
    id: '3',
    email: 'auditee@company.com',
    name: 'Emma Wilson',
    role: 'auditee',
    department: 'Operations'
  },
  {
    id: '4',
    email: 'ap.manager@company.com',
    name: 'Robert Davis',
    role: 'ap_manager',
    department: 'Management'
  },
  {
    id: '5',
    email: 'executive@company.com',
    name: 'Lisa Anderson',
    role: 'executive',
    department: 'Executive'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('iams_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = demoUsers.find(u => u.email === email);
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      localStorage.setItem('iams_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('iams_user');
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