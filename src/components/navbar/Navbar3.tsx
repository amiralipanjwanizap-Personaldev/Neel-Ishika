import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Music, Music2 } from 'lucide-react';
import { NavbarProps } from './Navbar1';

export const Navbar3 = ({ 
  settings, 
  navLinks, 
  location, 
  isMenuOpen, 
  setIsMenuOpen, 
  isPlaying, 
  toggleMusic 
}: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bgColor = isScrolled 
    ? (settings?.navbar_bg_color || "var(--brand-bg, #F5E9DA)") 
    : "transparent";
  
  const textColor = isScrolled 
    ? (settings?.navbar_text_color || "var(--brand-primary, #1F3A5F)") 
    : "#FFFFFF"; // White for overlay mode

  const borderColor = isScrolled 
    ? "rgba(var(--brand-secondary-rgb, 201, 164, 108), 0.2)" 
    : "transparent";

  const logoSizes: Record<string, string> = {
    small: "h-10 md:h-12",
    medium: "h-14 md:h-16",
    large: "h-20 md:h-24"
  };

  const logoClass = logoSizes[settings?.logo_size || 'medium'] || logoSizes.medium;

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'border-b shadow-sm' : ''}`}
      style={{ 
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: textColor,
        backdropFilter: isScrolled ? 'blur(8px)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="font-serif text-2xl flex items-center gap-3">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Wedding Logo" className={`${logoClass} w-auto object-contain`} referrerPolicy="no-referrer" />
            ) : (
              "N & I"
            )}
          </Link>

          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
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

          <div className="md:hidden flex items-center gap-4">
            {settings?.music_enabled !== false && (
              <button onClick={toggleMusic} className="p-2">
                {isPlaying ? <Music size={20} /> : <Music2 size={20} className="opacity-50" />}
              </button>
            )}
            <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
