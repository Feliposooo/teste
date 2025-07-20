import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/auth';
import { getUserByLogin } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored auth session
    const storedUser = localStorage.getItem('condominium_current_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuthState({
        user,
        isAuthenticated: true
      });
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const user = getUserByLogin(username);
    
    if (user && user.password === password) {
      setAuthState({
        user,
        isAuthenticated: true
      });
      localStorage.setItem('condominium_current_user', JSON.stringify(user));
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${user.name}!`
      });
      return true;
    } else {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false
    });
    localStorage.removeItem('condominium_current_user');
    toast({
      title: "Logout realizado",
      description: "Até logo!"
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};