import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Music, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface NavbarProps {
  settings: any;
  navLinks: { name: string; path: string }[];
  location: { pathname: string };
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isPlaying: boolean;
  toggleMusic: () => void;
}

export const Navbar1 = ({ 
  settings, 
  navLinks, 
  location, 
  isMenuOpen, 
  setIsMenuOpen, 
  isPlaying, 
  toggleMusic 
}: NavbarProps) => {
  const bgColor = settings?.navbar_bg_color || "var(--brand-bg, #F5E9DA)";
  const textColor = settings?.navbar_text_color || "var(--brand-primary, #1F3A5F)";

  const logoSizes: Record<string, string> = {
    small: "h-10 md:h-12",
    medium: "h-14 md:h-16",
    large: "h-20 md:h-24"
  };

  const logoClass = logoSizes[settings?.logo_size || 'medium'] || logoSizes.medium;

  return (
    <header 
      className="fixed w-full z-50 border-b transition-all duration-300"
      style={{ 
        backgroundColor: bgColor,
        borderColor: "rgba(var(--brand-secondary-rgb, 201, 164, 108), 0.2)",
        color: textColor
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center py-4">
          {/* Logo Centered */}
          <Link to="/" className="font-serif text-3xl mb-4 flex items-center gap-3">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Wedding Logo" className={`${logoClass} w-auto object-contain`} referrerPolicy="no-referrer" />
            ) : (
              "N & I"
            )}
          </Link>

          {/* Links Spaced Evenly */}
          <nav className="hidden md:flex space-x-12 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs tracking-[0.2em] uppercase transition-all hover:opacity-70 ${
                  location.pathname === link.path ? 'font-bold border-b border-current' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
            {settings?.music_enabled !== false && (
              <button 
                onClick={toggleMusic}
                className="p-2 transition-colors hover:opacity-70"
                aria-label="Toggle music"
              >
                {isPlaying ? <Music size={18} /> : <Music2 size={18} className="opacity-50" />}
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
            {settings?.music_enabled !== false && (
              <button 
                onClick={toggleMusic}
                className="p-2"
                aria-label="Toggle music"
              >
                {isPlaying ? <Music size={20} /> : <Music2 size={20} className="opacity-50" />}
              </button>
            )}
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
