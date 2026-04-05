import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Music, Music2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Schedule', path: '/schedule' },
  { name: 'Travel', path: '/travel' },
  { name: 'RSVP', path: '/rsvp' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Story', path: '/story' },
];

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=romantic-piano-112194.mp3');
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed w-full z-50 bg-brand-cream/90 backdrop-blur-sm border-b border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="font-serif text-2xl text-brand-navy">
              N & I
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm tracking-widest uppercase transition-colors hover:text-brand-gold ${
                    location.pathname === link.path ? 'text-brand-gold font-medium' : 'text-brand-navy'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button 
                onClick={toggleMusic}
                className="p-2 text-brand-navy hover:text-brand-gold transition-colors"
                aria-label="Toggle music"
              >
                {isPlaying ? <Music size={20} /> : <Music2 size={20} className="opacity-50" />}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={toggleMusic}
                className="p-2 text-brand-navy"
                aria-label="Toggle music"
              >
                {isPlaying ? <Music size={20} /> : <Music2 size={20} className="opacity-50" />}
              </button>
              <button
                className="p-2 text-brand-navy"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-brand-cream pt-24 px-4 md:hidden"
          >
            <nav className="flex flex-col space-y-6 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-serif text-3xl transition-colors hover:text-brand-gold ${
                    location.pathname === link.path ? 'text-brand-gold' : 'text-brand-navy'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      <footer className="bg-brand-navy text-brand-cream py-12 text-center">
        <p className="font-serif text-xl mb-4">Neel & Ishika</p>
        <p className="text-sm opacity-70 tracking-widest uppercase">Zanzibar â 2026</p>
      </footer>
    </div>
  );
}
