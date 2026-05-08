import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Music, Music2 } from 'lucide-react';
import { NavDropdown } from './NavDropdown';
import { NavbarProps } from './Navbar1';

export const Navbar9 = ({ 
  settings, 
  navLinks, 
  location, 
  isMenuOpen, 
  setIsMenuOpen, 
  isPlaying, 
  toggleMusic, 
  customPages 
}: NavbarProps) => {

  const bgColor = settings?.navbar_bg_color || '#1A1A1A';
  const textColor = settings?.navbar_text_color || '#F5F5F5';

  const logoSizes: Record<string, string> = {
    small: "h-6 md:h-8",
    medium: "h-8 md:h-10",
    large: "h-12 md:h-14",
    xlarge: "h-16 md:h-20"
  };

  const logoClass = logoSizes[settings?.logo_size || 'medium'] || logoSizes.medium;

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="w-full h-12 md:h-14 px-4 md:px-8 flex items-center justify-between text-xs font-semibold tracking-widest uppercase">
        
        {/* Left Links */}
        <nav className="hidden md:flex flex-1 items-center space-x-6">
          {navLinks.map((link) => (
             link.dropdown ? (
               <NavDropdown key={link.name} title={link.name} items={link.dropdown} location={location} styleClass="hover:opacity-60 transition-opacity" />
             ) : (
               <Link
                 key={link.name}
                 to={link.path!}
                 className={`hover:opacity-60 transition-opacity flex items-center h-full ${
                   location.pathname === link.path ? 'opacity-100 border-b-2 border-current' : 'opacity-80'
                 }`}
               >
                 {link.name}
               </Link>
             )
          ))}
          <NavDropdown title="More" items={(customPages || []).map(p => ({ title: p.title, path: '/' + p.slug }))} location={location} styleClass="hover:opacity-60 transition-opacity" />
        </nav>

        {/* Mobile Menu Icon */}
        <div className="flex md:hidden flex-1">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Center Logo */}
        <Link to="/" className="flex-shrink-0 flex justify-center items-center">
            {settings?.logo_url ? (
               <img src={settings.logo_url} alt="Logo" className={logoClass} referrerPolicy="no-referrer" />
            ) : (
               <span className="font-serif italic capitalize text-lg">N & I</span>
            )}
        </Link>

        {/* Right Info / Music */}
        <div className="flex-1 flex justify-end items-center gap-6 text-[10px]">
           <span className="hidden lg:block opacity-60">Zanzibar • 2026</span>
           {settings?.music_enabled !== false && (
             <button onClick={toggleMusic} className="hover:opacity-60 transition-opacity flex items-center gap-2">
               {isPlaying ? "Pause Music" : "Play Music"}
               {isPlaying ? <Music size={14} className="animate-pulse" /> : <Music2 size={14} />}
             </button>
           )}
        </div>
      </div>
    </header>
  );
};
