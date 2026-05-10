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
import { Navbar6 } from './navbar/Navbar6';
import { Navbar7 } from './navbar/Navbar7';
import { Navbar8 } from './navbar/Navbar8';
import { Navbar9 } from './navbar/Navbar9';
import { Navbar10 } from './navbar/Navbar10';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Schedule', path: '/schedule' },
  { 
    name: 'Travel', 
    dropdown: [
      { title: 'Travel Info', path: '/travel' },
      { title: 'Requirements', path: '/special-requirements' },
      { title: 'Explore', path: '/explore' },
      { title: 'Accommodation', path: '/accommodation' },
    ]
  },
  { 
    name: 'Wedding', 
    dropdown: [
      { title: 'Story', path: '/story' },
      { title: 'Wedding Makeup Artist', path: '/beauty' },
      { title: 'Important Contacts', path: '/important-contacts' },
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
  navbar6: Navbar6,
  navbar7: Navbar7,
  navbar8: Navbar8,
  navbar9: Navbar9,
  navbar10: Navbar10,
};

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicOverlay, setShowMusicOverlay] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [customPages, setCustomPages] = useState<{title: string, slug: string}[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    async function fetchSettings() {
      const data = await getSettings();
      if (data) {
        setSettings(data);
        if (data.music_enabled !== false) {
          const musicUrl = data.music_url || 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=romantic-piano-112194.mp3';
          audioRef.current = new Audio(musicUrl);
          audioRef.current.loop = true;
          audioRef.current.volume = 0; // Start at 0 for fade-in

          const userPreference = localStorage.getItem('musicPreference');
          if (userPreference !== 'muted') {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                setIsPlaying(true);
                fadeIn();
              }).catch(() => {
                // Autoplay blocked
                setShowMusicOverlay(true);
              });
            }
          }
        }
      }
    }
    
    const fadeIn = () => {
      let vol = 0;
      const interval = setInterval(() => {
        if (vol < 0.5 && audioRef.current) {
          vol += 0.05;
          audioRef.current.volume = Math.min(vol, 0.5);
        } else {
          clearInterval(interval);
        }
      }, 200);
    };
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

  useEffect(() => {
    // Visitor Tracking System
    if (location.pathname.startsWith('/admin')) return;

    const recordVisit = async () => {
      let visitorId = localStorage.getItem('visitor_id');
      if (!visitorId) {
        visitorId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        localStorage.setItem('visitor_id', visitorId);
      }

      const lastVisitKey = 'last_visit_timestamp';
      const lastVisit = localStorage.getItem(lastVisitKey);
      const now = Date.now();
      const thirtyMinutes = 30 * 60 * 1000;

      // Only count one visit every 30 minutes per visitor
      if (!lastVisit || now - parseInt(lastVisit) > thirtyMinutes) {
        try {
          const { error } = await supabase.from('page_views').insert([{
            visitor_id: visitorId,
            path: location.pathname
          }]);
          
          if (!error) {
            localStorage.setItem(lastVisitKey, now.toString());
          }
        } catch (e) {
          console.error("Error tracking view", e);
        }
      }
    };

    recordVisit();
  }, [location.pathname]);

  const toggleMusic = () => {
    if (audioRef.current && settings?.music_enabled !== false) {
      if (isPlaying) {
        audioRef.current.pause();
        localStorage.setItem('musicPreference', 'muted');
      } else {
        audioRef.current.volume = 0.5; // restore normal volume
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        localStorage.setItem('musicPreference', 'playing');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnableMusic = () => {
    setShowMusicOverlay(false);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        localStorage.setItem('musicPreference', 'playing');
      }).catch(e => console.log('Audio play failed:', e));
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

  useEffect(() => {
    const updateNavbarHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        document.documentElement.style.setProperty('--navbar-height', `${header.offsetHeight}px`);
      }
    };

    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);
    
    // Use ResizeObserver for more robust tracking of header height changes (e.g. logo loading)
    const observer = new ResizeObserver(() => updateNavbarHeight());
    const header = document.querySelector('header');
    if (header) {
      observer.observe(header);
    }

    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
      observer.disconnect();
    };
  }, [settings?.navbar_template, settings?.logo_size, settings?.logo_url]);

  const SelectedNavbar = navbars[settings?.navbar_template || 'navbar1'] || Navbar1;

  // Render logic continues...
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

      <AnimatePresence>
        {showMusicOverlay && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-4 shadow-xl border border-white/10"
          >
            <span className="text-sm tracking-widest uppercase font-medium">Tap to Play Music</span>
            <div className="flex gap-2">
              <button 
                onClick={handleEnableMusic}
                className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                Play
              </button>
              <button 
                onClick={() => {
                  setShowMusicOverlay(false);
                  localStorage.setItem('musicPreference', 'muted');
                }}
                className="bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white/30 transition-colors"
              >
                Mute
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col"
            style={{ backgroundColor: settings?.navbar_bg_color || "var(--brand-bg, #F5E9DA)" }}
          >
            <div className="flex-1 overflow-y-auto overflow-x-hidden pt-28 pb-12 px-6">
              <nav className="flex flex-col space-y-8 text-center min-h-full items-center justify-center">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow flex flex-col" style={{ paddingTop: 'var(--navbar-height, 80px)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex-grow flex flex-col"
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
