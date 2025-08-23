import { useState, useEffect } from 'react';

export interface StoreTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
    text: string;
    muted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  layout: 'modern' | 'classic' | 'minimal' | 'bold';
}

const defaultThemes: StoreTheme[] = [
  {
    id: 'default',
    name: 'Padrão',
    description: 'Tema clássico e profissional',
    colors: {
      primary: '#030213',
      secondary: '#f1f5f9',
      accent: '#3b82f6',
      background: '#ffffff',
      card: '#ffffff',
      text: '#1e293b',
      muted: '#64748b'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    borderRadius: 'lg',
    layout: 'modern'
  },
  {
    id: 'fashion',
    name: 'Fashion Elite',
    description: 'Elegante e sofisticado para moda de luxo',
    colors: {
      primary: '#000000',
      secondary: '#f8fafc',
      accent: '#d4af37',
      background: '#ffffff',
      card: '#f9fafb',
      text: '#111827',
      muted: '#6b7280'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter'
    },
    borderRadius: 'sm',
    layout: 'classic'
  },
  {
    id: 'streetwear',
    name: 'Streetwear Vibe',
    description: 'Moderno e urbano para moda jovem',
    colors: {
      primary: '#7c3aed',
      secondary: '#f3f4f6',
      accent: '#f59e0b',
      background: '#fafafa',
      card: '#ffffff',
      text: '#1f2937',
      muted: '#9ca3af'
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter'
    },
    borderRadius: 'xl',
    layout: 'bold'
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Limpo e simples, foco no produto',
    colors: {
      primary: '#1f2937',
      secondary: '#f9fafb',
      accent: '#059669',
      background: '#ffffff',
      card: '#ffffff',
      text: '#374151',
      muted: '#9ca3af'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    borderRadius: 'md',
    layout: 'minimal'
  },
  {
    id: 'vintage',
    name: 'Vintage Charm',
    description: 'Nostálgico e acolhedor para brechós',
    colors: {
      primary: '#92400e',
      secondary: '#fef7ed',
      accent: '#dc2626',
      background: '#fffbeb',
      card: '#ffffff',
      text: '#78350f',
      muted: '#a16207'
    },
    fonts: {
      heading: 'Merriweather',
      body: 'Open Sans'
    },
    borderRadius: 'lg',
    layout: 'classic'
  }
];

export function useStoreTheme() {
  const [currentTheme, setCurrentTheme] = useState<StoreTheme>(defaultThemes[0]);
  const [customThemes, setCustomThemes] = useState<StoreTheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('storeThemeId');
    const savedCustomThemes = localStorage.getItem('customStoreThemes');

    if (savedCustomThemes) {
      try {
        const parsed = JSON.parse(savedCustomThemes);
        setCustomThemes(parsed);
      } catch (error) {
        console.error('Error parsing custom themes:', error);
      }
    }

    if (savedThemeId) {
      const allThemes = [...defaultThemes, ...customThemes];
      const theme = allThemes.find(t => t.id === savedThemeId);
      if (theme) {
        setCurrentTheme(theme);
      }
    }

    setIsLoading(false);
  }, []);

  const applyTheme = (theme: StoreTheme) => {
    setCurrentTheme(theme);
    localStorage.setItem('storeThemeId', theme.id);

    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--store-primary', theme.colors.primary);
    root.style.setProperty('--store-secondary', theme.colors.secondary);
    root.style.setProperty('--store-accent', theme.colors.accent);
    root.style.setProperty('--store-background', theme.colors.background);
    root.style.setProperty('--store-card', theme.colors.card);
    root.style.setProperty('--store-text', theme.colors.text);
    root.style.setProperty('--store-muted', theme.colors.muted);
    
    // Apply border radius
    const radiusMap = {
      none: '0px',
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    };
    root.style.setProperty('--store-border-radius', radiusMap[theme.borderRadius]);
  };

  const saveCustomTheme = (theme: StoreTheme) => {
    const updatedCustomThemes = [...customThemes, theme];
    setCustomThemes(updatedCustomThemes);
    localStorage.setItem('customStoreThemes', JSON.stringify(updatedCustomThemes));
  };

  const deleteCustomTheme = (themeId: string) => {
    const updatedCustomThemes = customThemes.filter(t => t.id !== themeId);
    setCustomThemes(updatedCustomThemes);
    localStorage.setItem('customStoreThemes', JSON.stringify(updatedCustomThemes));
    
    // If deleting current theme, switch to default
    if (currentTheme.id === themeId) {
      applyTheme(defaultThemes[0]);
    }
  };

  const getAllThemes = () => [...defaultThemes, ...customThemes];

  // Apply current theme on mount
  useEffect(() => {
    if (!isLoading) {
      applyTheme(currentTheme);
    }
  }, [currentTheme, isLoading]);

  return {
    currentTheme,
    customThemes,
    defaultThemes,
    getAllThemes,
    applyTheme,
    saveCustomTheme,
    deleteCustomTheme,
    isLoading
  };
}