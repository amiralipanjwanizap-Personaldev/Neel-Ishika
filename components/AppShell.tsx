'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getSettings } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { SettingsProvider } from '@/context/SettingsContext';
import { Navbar1 } from '@/components/navbar/Navbar1';
import { Navbar2 } from '@/components/navbar/Navbar2';
import { Navbar3 } from '@/components/navbar/Navbar3';
import { Navbar4 } from '@/components/navbar/Navbar4';
import { Navbar5 } from '@/components/navbar/Navbar5';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Schedule', path: '/schedule' },
  { name: 'Travel', path: '/travel' },
  { name: 'RSVP', path: '/rsvp' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Story', path: '/story' },
  { name: 'Challenge', path: '/games/photo-challenge' },
  { name: 'Messages', path: '/games/message-wall' },
];

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

const navbars: Record<string, any> = {
  navbar1: Navbar1,
  navbar2: Navbar2,
  navbar3: Navbar3,
  navbar4: Navbar4,
  navbar5: Navbar5,
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchSettings() {
      const data = await getSettings();
      if (data) {
        setSettings(data as Settings);
        const musicUrl = data.music_url || 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=romantic-piano-112194.mp3';
        audioRef.current = new Audio(musicUrl);
        audioRef.current.loop = true;
      }
    }
    fetchSettings();

    // Subscribe to real-time updates for settings
    const settingsChannel = supabase
      .channel('settings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        (payload) => {
          console.log('Settings changed:', payload);
          setSettings(payload.new as Settings);
        }
      )
      .subscribe();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current && settings?.music_enabled !== false) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const fontClass = settings?.font_family || 'font-sans';

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
  };

  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      const primary = settings.primary_color || '#1F3A5F';
      const secondary = settings.secondary_color || '#C9A46C';
      const text = settings.text_color || '#000000';
      
      root.style.setProperty('--brand-primary', primary);
      root.style.setProperty('--brand-secondary', secondary);
      root.style.setProperty('--brand-text', text);
      root.style.setProperty('--brand-bg', '#F5E9DA');
      
      const primaryRgb = hexToRgb(primary);
      if (primaryRgb) root.style.setProperty('--brand-primary-rgb', primaryRgb);
      
      const secondaryRgb = hexToRgb(secondary);
      if (secondaryRgb) root.style.setProperty('--brand-secondary-rgb', secondaryRgb);
    }
  }, [settings]);

  const SelectedNavbar = navbars[settings?.navbar_template || 'navbar1'] || Navbar1;

  return (
    <div className={`min-h-screen flex flex-col ${fontClass}`}>
      <SelectedNavbar 
        settings={settings}
        navLinks={navLinks}
        location={{ pathname }}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isPlaying={isPlaying}
        toggleMusic={toggleMusic}
      />

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-24 px-4 lg:hidden"
            style={{ backgroundColor: settings?.navbar_bg_color || "var(--brand-bg, #F5E9DA)" }}
          >
            <nav className="flex flex-col space-y-6 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-serif text-3xl transition-colors hover:opacity-70 ${
                    pathname === link.path ? 'font-bold' : ''
                  }`}
                  style={{ color: settings?.navbar_text_color || "var(--brand-primary, #1F3A5F)" }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-20">
        <SettingsProvider settings={settings}>
          {children}
        </SettingsProvider>
      </main>

      <footer 
        className="py-12 text-center relative"
        style={{ 
          backgroundColor: "var(--brand-primary)", 
          color: "var(--brand-bg, #F5E9DA)" 
        }}
      >
        <p className="font-serif text-xl mb-4">Neel & Ishika</p>
        <p className="text-sm opacity-70 tracking-widest uppercase">
          {settings?.wedding_date ? `Zanzibar • ${settings.wedding_date}` : "Zanzibar • 2026"}
        </p>
        
        <Link 
          href="/admin/login" 
          className="absolute bottom-4 right-4 text-brand-cream/20 hover:text-brand-gold transition-colors p-2"
          title="Admin Login"
        >
          <Lock size={16} />
        </Link>
      </footer>
    </div>
  );
}
