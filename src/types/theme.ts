export type Theme = 'campos-jordao' | 'modern' | 'elegant' | 'sunset';

export interface ThemeOption {
  id: Theme;
  name: string;
  description: string;
  primaryColor: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'campos-jordao',
    name: 'Campos do Jordão',
    description: 'Tons terrosos e montanhosos inspirados na cidade serrana',
    primaryColor: 'hsl(140 40% 35%)'
  },
  {
    id: 'modern',
    name: 'Moderno Azul',
    description: 'Visual limpo e profissional com tons de azul',
    primaryColor: 'hsl(217 91% 60%)'
  },
  {
    id: 'elegant',
    name: 'Elegante Púrpura',
    description: 'Sofisticado com tons de roxo e lilás',
    primaryColor: 'hsl(270 50% 45%)'
  },
  {
    id: 'sunset',
    name: 'Sunset Laranja',
    description: 'Caloroso e acolhedor com tons de pôr do sol',
    primaryColor: 'hsl(15 75% 55%)'
  }
];