import React from 'react';
import Link from 'next/link';
import { Menu, X, Music, Music2 } from 'lucide-react';
import { NavbarProps } from './Navbar1';

export const Navbar2 = ({ 
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
        borderColor: "rgba(var(--brand-secondary-rgb, 201, 164, 108), 0.1)",
        color: textColor
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Left */}
          <Link href="/" className="font-serif text-2xl flex items-center gap-3">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Wedding Logo" className={`${logoClass} w-auto object-contain`} referrerPolicy="no-referrer" />
            ) : (
              "N & I"
            )}
          </Link>

          {/* Links Right */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm tracking-widest uppercase transition-all hover:opacity-70 ${
                  location.pathname === link.path ? 'font-bold' : ''
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
          <div className="md:hidden flex items-center gap-4">
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
