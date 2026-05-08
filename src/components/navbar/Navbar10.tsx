import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Music, Music2 } from 'lucide-react';
import { NavDropdown } from './NavDropdown';
import { NavbarProps } from './Navbar1';

export const Navbar10 = ({ 
  settings, 
  navLinks, 
  location, 
  isMenuOpen, 
  setIsMenuOpen, 
  isPlaying, 
  toggleMusic, 
  customPages 
}: NavbarProps) => {

  // For modern wedding, use an airy, border-bottom look with plenty of padding
  const bgColor = settings?.navbar_bg_color || '#FFFFFF';
  const textColor = settings?.navbar_text_color || '#2D3748';

  const logoSizes: Record<string, string> = {
    small: "h-12 md:h-16",
    medium: "h-16 md:h-24",
    large: "h-24 md:h-32",
    xlarge: "h-32 md:h-40"
  };

  const logoClass = logoSizes[settings?.logo_size || 'medium'] || logoSizes.medium;

  return (
    <header 
      className="fixed w-full z-50 border-b transition-colors duration-300 shadow-sm"
      style={{ backgroundColor: bgColor, color: textColor, borderColor: `${textColor}1A` }}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 md:py-6 flex justify-between items-center">
        
        {/* Logo Left */}
        <div className="flex-1">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className={`${logoClass} w-auto object-contain`} referrerPolicy="no-referrer" />
            ) : (
              <span className="font-serif text-3xl font-bold tracking-tight">Neel & Ishika</span>
            )}
          </Link>
        </div>

        {/* Links Right (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-10 text-sm font-medium tracking-wide">
          {navLinks.map((link) => (
            link.dropdown ? (
              <NavDropdown key={link.name} title={link.name} items={link.dropdown} location={location} styleClass="hover:opacity-60 transition-opacity uppercase tracking-widest text-xs" />
            ) : (
              <Link
                key={link.name}
                to={link.path!}
                className={`hover:opacity-60 transition-opacity uppercase tracking-widest text-xs ${
                  location.pathname === link.path ? 'opacity-100 font-bold border-b border-current pb-1' : 'opacity-80'
                }`}
              >
                {link.name}
              </Link>
            )
          ))}
          <NavDropdown title="More" items={(customPages || []).map(p => ({ title: p.title, path: '/' + p.slug }))} location={location} styleClass="hover:opacity-60 transition-opacity uppercase tracking-widest text-xs" />
          
          <div className="w-px h-6 bg-current opacity-20 ml-4 mr-2" />
          
          {settings?.music_enabled !== false && (
            <button onClick={toggleMusic} className="hover:opacity-60 transition-opacity p-2">
              {isPlaying ? <Music size={18} className="animate-pulse" /> : <Music2 size={18} />}
            </button>
          )}
        </nav>

        {/* Mobile Menu */}
        <div className="flex lg:hidden items-center">
          {settings?.music_enabled !== false && (
            <button onClick={toggleMusic} className="hover:opacity-60 transition-opacity p-2 mr-2">
              {isPlaying ? <Music size={20} className="animate-pulse" /> : <Music2 size={20} />}
            </button>
          )}
          <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="p-2 border rounded border-current hover:bg-black/5"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};
