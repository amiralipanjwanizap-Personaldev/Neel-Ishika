import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Music, Music2 } from 'lucide-react';
import { NavDropdown } from './NavDropdown';
import { NavbarProps } from './Navbar1';

export const Navbar7 = ({ 
  settings, 
  navLinks, 
  location, 
  isMenuOpen, 
  setIsMenuOpen, 
  isPlaying, 
  toggleMusic, 
  customPages 
}: NavbarProps) => {

  const bgColor = settings?.navbar_bg_color || '#FFFFFF';
  const textColor = settings?.navbar_text_color || '#111111';

  const logoSizes: Record<string, string> = {
    small: "h-14 md:h-16",
    medium: "h-20 md:h-24",
    large: "h-28 md:h-32",
    xlarge: "h-36 md:h-48"
  };

  const logoClass = logoSizes[settings?.logo_size || 'medium'] || logoSizes.medium;

  return (
    <header 
      className="fixed w-full z-50 border-b border-gray-100 transition-all duration-300 shadow-sm"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="w-full flex justify-between items-center px-4 md:px-8 h-16 md:hidden">
         <div className="flex-1">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
         </div>
         <div className="flex-1 text-center font-serif text-xl">
            {settings?.logo_url ? <img src={settings.logo_url} alt="Logo" className="h-10 mx-auto" object-contain="true" /> : "N & I"}
         </div>
         <div className="flex-1 flex justify-end">
             {settings?.music_enabled !== false && (
                <button onClick={toggleMusic} className="p-2">
                  {isPlaying ? <Music className="w-5 h-5 animate-pulse" /> : <Music2 className="w-5 h-5 opacity-50" />}
                </button>
              )}
         </div>
      </div>

      <div className="hidden md:flex flex-col items-center justify-center py-8 px-8">
        <Link to="/" className="font-serif mb-6 hover:opacity-80 transition-opacity">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className={`${logoClass} w-auto object-contain`} referrerPolicy="no-referrer" />
          ) : (
            <h1 className="text-4xl tracking-widest uppercase">Neel & Ishika</h1>
          )}
        </Link>
        <div className="flex items-center space-x-12 relative w-full justify-center">
            {settings?.music_enabled !== false && (
                <button onClick={toggleMusic} className="absolute left-0 p-2 opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2 text-xs tracking-widest uppercase">
                  {isPlaying ? <Music size={14} className="animate-pulse" /> : <Music2 size={14} />}
                  <span>{isPlaying ? "Playing" : "Sound"}</span>
                </button>
            )}
            <nav className="flex space-x-10 text-sm tracking-[0.15em] uppercase pb-2">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <NavDropdown key={link.name} title={link.name} items={link.dropdown} location={location} styleClass="hover:opacity-60 transition-opacity" />
                ) : (
                  <Link
                    key={link.name}
                    to={link.path!}
                    className={`hover:opacity-60 transition-opacity ${
                      location.pathname === link.path ? 'opacity-100 font-bold border-b border-current pb-1' : 'opacity-80'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <NavDropdown title="More" items={(customPages || []).map(p => ({ title: p.title, path: '/' + p.slug }))} location={location} styleClass="hover:opacity-60 transition-opacity" />
            </nav>
        </div>
      </div>
    </header>
  );
};
