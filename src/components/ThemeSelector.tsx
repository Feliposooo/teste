import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { THEME_OPTIONS, Theme } from '@/types/theme';

export const ThemeSelector = () => {
  const { theme, userTheme, setUserTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (selectedTheme: Theme) => {
    setUserTheme(selectedTheme);
    setIsOpen(false);
  };

  const currentThemeOption = THEME_OPTIONS.find(option => option.id === theme);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Palette className="w-4 h-4" />
          <span>Personalizar Tema</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Escolha seu Tema Personalizado</DialogTitle>
          <DialogDescription>
            Selecione um tema visual para personalizar sua experiência no sistema
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {THEME_OPTIONS.map((themeOption) => (
            <Card 
              key={themeOption.id}
              className={`cursor-pointer transition-all border-2 ${
                theme === themeOption.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleThemeSelect(themeOption.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: themeOption.primaryColor }}
                    />
                    <span>{themeOption.name}</span>
                  </CardTitle>
                  {theme === themeOption.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {themeOption.description}
                </p>
                
                {/* Preview das cores do tema */}
                <div className="flex space-x-2">
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: themeOption.primaryColor }}
                    title="Cor principal"
                  />
                  <div 
                    className="w-6 h-6 rounded bg-secondary"
                    title="Cor secundária"
                  />
                  <div 
                    className="w-6 h-6 rounded bg-accent"
                    title="Cor de destaque"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Tema Atual</span>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentThemeOption?.primaryColor }}
            />
            <span className="text-sm text-muted-foreground">
              {currentThemeOption?.name}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};