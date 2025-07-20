import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '@/types/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  userTheme: Theme | null;
  setUserTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('campos-jordao'); // Tema padrão
  const [userTheme, setUserThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    // Carregar tema do usuário logado
    const currentUser = localStorage.getItem('condominium_current_user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const savedTheme = localStorage.getItem(`theme_${user.id}`);
      if (savedTheme) {
        const parsedTheme = savedTheme as Theme;
        setUserThemeState(parsedTheme);
        setTheme(parsedTheme);
      }
    }
  }, []);

  useEffect(() => {
    // Aplicar tema ao documento
    if (theme === 'campos-jordao') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const setUserTheme = (newTheme: Theme) => {
    setUserThemeState(newTheme);
    setTheme(newTheme);
    
    // Salvar tema do usuário
    const currentUser = localStorage.getItem('condominium_current_user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      localStorage.setItem(`theme_${user.id}`, newTheme);
    }
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme: handleSetTheme, 
      userTheme,
      setUserTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};