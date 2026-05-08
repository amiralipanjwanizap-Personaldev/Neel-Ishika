import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Music, Music2 } from 'lucide-react';
import { NavDropdown } from './NavDropdown';
import { NavbarProps } from './Navbar1';

export const Navbar8 = ({ 
  settings, 
  navLinks, 
  location, 
  isMenuOpen, 
  setIsMenuOpen, 
  isPlaying, 
  toggleMusic, 
  customPages 
}: NavbarProps) => {

  const bgColor = settings?.navbar_bg_color || '#FAFAFA';
  const textColor = settings?.navbar_text_color || '#222222';

  const logoSizes: Record<string, string> = {
    small: "h-10 md:h-12",
    medium: "h-14 md:h-16",
    large: "h-18 md:h-20",
    xlarge: "h-24 md:h-28"
  };

  const logoClass = logoSizes[settings?.logo_size || 'medium'] || logoSizes.medium;

  return (
    <div className="fixed w-full z-50 p-2 md:p-6 transition-all duration-300 pointer-events-none">
      <header 
        className="w-full h-16 md:h-24 border-2 flex items-center justify-between px-4 md:px-10 pointer-events-auto bg-white/90 backdrop-blur-sm"
        style={{ 
          borderColor: "var(--brand-secondary, #C9A46C)",
          color: textColor,
          backgroundColor: bgColor
        }}
      >
        {/* Left Links */}
        <nav className="hidden md:flex flex-1 space-x-8 items-center">
          {navLinks.slice(0, Math.ceil(navLinks.length / 2)).map((link) => (
             link.dropdown ? (
               <NavDropdown key={link.name} title={link.name} items={link.dropdown} location={location} styleClass="text-sm font-semibold tracking-wider uppercase hover:text-[var(--brand-secondary)] transition-colors" />
             ) : (
               <Link
                 key={link.name}
                 to={link.path!}
                 className={`text-sm font-semibold tracking-wider uppercase hover:text-[var(--brand-secondary)] transition-colors ${
                   location.pathname === link.path ? 'text-[var(--brand-secondary)]' : ''
                 }`}
               >
                 {link.name}
               </Link>
             )
          ))}
        </nav>

        {/* Center Logo */}
        <Link to="/" className="flex-shrink-0 mx-4 flex items-center justify-center">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className={`${logoClass} w-auto object-contain`} referrerPolicy="no-referrer" />
          ) : (
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-[var(--brand-secondary)]">N & I</span>
          )}
        </Link>

        {/* Right Links & Music */}
        <nav className="hidden md:flex flex-1 space-x-8 items-center justify-end">
           {navLinks.slice(Math.ceil(navLinks.length / 2)).map((link) => (
             link.dropdown ? (
               <NavDropdown key={link.name} title={link.name} items={link.dropdown} location={location} styleClass="text-sm font-semibold tracking-wider uppercase hover:text-[var(--brand-secondary)] transition-colors" />
             ) : (
               <Link
                 key={link.name}
                 to={link.path!}
                 className={`text-sm font-semibold tracking-wider uppercase hover:text-[var(--brand-secondary)] transition-colors ${
                   location.pathname === link.path ? 'text-[var(--brand-secondary)]' : ''
                 }`}
               >
                 {link.name}
               </Link>
             )
          ))}
          <NavDropdown title="More" items={(customPages || []).map(p => ({ title: p.title, path: '/' + p.slug }))} location={location} styleClass="text-sm font-semibold tracking-wider uppercase hover:text-[var(--brand-secondary)] transition-colors" />
          
          {settings?.music_enabled !== false && (
            <button onClick={toggleMusic} className="ml-4 hover:text-[var(--brand-secondary)] transition-colors">
              {isPlaying ? <Music className="w-5 h-5 animate-pulse" /> : <Music2 className="w-5 h-5 opacity-70" />}
            </button>
          )}
        </nav>

        {/* Mobile Menu */}
        <div className="flex justify-end flex-1 md:hidden items-center">
            {settings?.music_enabled !== false && (
              <button onClick={toggleMusic} className="mr-4">
                {isPlaying ? <Music className="w-5 h-5 animate-pulse" /> : <Music2 className="w-5 h-5 opacity-70" />}
              </button>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>
      </header>
    </div>
  );
};
