'use client';

import React, { createContext, useContext } from 'react';

interface Settings {
  logo_url?: string;
  music_url?: string;
  music_enabled?: boolean;
  tagline?: string;
  wedding_date?: string;
  primary_color?: string;
  secondary_color?: string;
  text_color?: string;
  homepage_template?: 'classic' | 'modern' | 'luxury';
  homepage_bg_url?: string;
  font_family?: string;
  navbar_template?: string;
  navbar_bg_color?: string;
  navbar_text_color?: string;
  logo_size?: string;
}

const SettingsContext = createContext<{ settings: Settings | null }>({ settings: null });

export const SettingsProvider = ({ settings, children }: { settings: Settings | null, children: React.ReactNode }) => {
  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
