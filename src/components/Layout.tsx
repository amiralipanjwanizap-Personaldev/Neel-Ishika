import { Link, Outlet, useLocation } from 'react-router-dom';
import { Lock, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getSettings } from '../lib/api';
import { supabase } from '../lib/supabase';
import { Navbar1 } from './navbar/Navbar1';
import { Navbar2 } from './navbar/Navbar2';
import { Navbar3 } from './navbar/Navbar3';
import { Navbar4 } from './navbar/Navbar4';
import { Navbar5 } from './navbar/Navbar5';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Schedule', path: '/schedule' },
  { 
    name: 'Travel', 
    dropdown: [
      { title: 'Requirements', path: '/special-requirements' },
      { title: 'Explore', path: '/explore' },
      { title: 'Accommodation', path: '/accommodation' },
    ]
  },
  { 
    name: 'Wedding', 
    dropdown: [
      { title: 'Story', path: '/story' },
      { title: 'Beauty', path: '/beauty' },
      { title: 'Messages', path: '/games/message-wall' },
      { title: 'Challenge', path: '/games/photo-challenge' },
      { title: 'Gallery', path: '/gallery' },
    ]
  },
];

const MobileAccordion = ({ title, items, onLinkClick, textColor, location }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = items.some((i: any) => location.pathname === i.path);

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`font-serif text-3xl transition-colors hover:opacity-70 flex items-center justify-center gap-2 ${isActive ? 'font-bold' : ''}`}
        style={{ color: textColor }}
      >
        {title} <ChevronDown size={24} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col space-y-4 mt-4 overflow-hidden"
          >
            {items.map((item: any) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onLinkClick}
                className={`font-serif text-xl transition-colors hover:opacity-70 bg-black/5 rounded-full px-6 py-2 ${
                  location.pathname === item.path ? 'font-bold bg-black/10' : ''
                }`}
                style={{ color: textColor }}
              >
                {item.title}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface Settings {
  logo_url?: string;
  music_url?: string;
  music_enabled?: boolean;
  tagline?: string;
  wedding_date?: string;
  primary_color?: string;
  secondary_color?: string;
  text_color?: string;
  homepage_template?: string;
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

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [customPages, setCustomPages] = useState<{title: string, slug: string}[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    async function fetchSettings() {
      const data = await getSettings();
      if (data) {
        setSettings(data);
        const musicUrl = data.music_url || 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=romantic-piano-112194.mp3';
        audioRef.current = new Audio(musicUrl);
        audioRef.current.loop = true;
      }
    }
    async function fetchCustomPages() {
      const { data } = await supabase.from('pages').select('title, slug').order('created_at', { ascending: true });
      if (data) {
        setCustomPages(data);
      }
    }
    
    fetchSettings();
    fetchCustomPages();

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

    // Subscribe to real-time updates for pages
    const pagesChannel = supabase
      .channel('pages-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pages' },
        () => {
          supabase.from('pages').select('title, slug').order('created_at', { ascending: true })
            .then(({ data }) => {
              if (data) setCustomPages(data);
            });
        }
      )
      .subscribe();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      supabase.removeChannel(settingsChannel);
      supabase.removeChannel(pagesChannel);
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
        location={location}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isPlaying={isPlaying}
        toggleMusic={toggleMusic}
        customPages={customPages}
      />

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-24 px-4 md:hidden"
            style={{ backgroundColor: settings?.navbar_bg_color || "var(--brand-bg, #F5E9DA)" }}
          >
            <nav className="flex flex-col space-y-6 text-center">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <MobileAccordion 
                    key={link.name} 
                    title={link.name} 
                    items={link.dropdown} 
                    onLinkClick={() => setIsMenuOpen(false)} 
                    textColor={settings?.navbar_text_color || "var(--brand-primary, #1F3A5F)"} 
                    location={location} 
                  />
                ) : (
                  <Link
                    key={link.name}
                    to={link.path!}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-serif text-3xl transition-colors hover:opacity-70 ${
                      location.pathname === link.path ? 'font-bold' : ''
                    }`}
                    style={{ color: settings?.navbar_text_color || "var(--brand-primary, #1F3A5F)" }}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              {customPages.length > 0 && (
                <MobileAccordion 
                  title="More" 
                  items={customPages.map(page => ({ title: page.title, path: '/' + page.slug }))}
                  onLinkClick={() => setIsMenuOpen(false)} 
                  textColor={settings?.navbar_text_color || "var(--brand-primary, #1F3A5F)"} 
                  location={location} 
                />
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-[calc(100vh-16rem)]"
          >
            <Outlet context={{ settings }} />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer 
        className="py-12 mt-auto w-full flex flex-col items-center justify-center relative"
        style={{ 
          backgroundColor: "var(--brand-primary)", 
          color: "var(--brand-bg, #F5E9DA)" 
        }}
      >
        <p className="font-serif text-2xl md:text-3xl mb-4 tracking-wider">#NeelMetHisIshk</p>
        <p className="text-sm opacity-70 tracking-widest uppercase text-center">
          {settings?.wedding_date ? `Zanzibar • ${settings.wedding_date}` : "Zanzibar • 2026"}
        </p>
        
        <Link 
          to="/admin/login" 
          className="absolute bottom-4 right-4 text-brand-cream/20 hover:text-brand-gold transition-colors p-2"
          title="Admin Login"
        >
          <Lock size={16} />
        </Link>
      </footer>
    </div>
  );
}
