import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Music, Music2 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { NavDropdown } from './NavDropdown';
import { NavbarProps } from './Navbar1';

export const Navbar6 = ({ 
  settings, 
  navLinks, 
  location, 
  isMenuOpen, 
  setIsMenuOpen, 
  isPlaying, 
  toggleMusic, 
  customPages 
}: NavbarProps) => {

  const bgColor = settings?.navbar_bg_color ? `${settings.navbar_bg_color}99` : 'rgba(255, 255, 255, 0.4)'; // 60% opacity for glass
  const textColor = settings?.navbar_text_color || '#1F3A5F';

  const logoSizes: Record<string, string> = {
    small: "h-8 md:h-10",
    medium: "h-12 md:h-14",
    large: "h-16 md:h-20",
    xlarge: "h-20 md:h-28"
  };

  const logoClass = logoSizes[settings?.logo_size || 'medium'] || logoSizes.medium;

  return (
    <div className="fixed w-full z-50 p-4 transition-all duration-300">
      <header 
        className="max-w-6xl mx-auto rounded-3xl backdrop-blur-xl border shadow-lg transition-all duration-300 border-white/20"
        style={{ 
          backgroundColor: bgColor,
          color: textColor
        }}
      >
        <div className="px-6 sm:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Left */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="font-serif text-2xl flex items-center gap-2">
                {settings?.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className={`${logoClass} w-auto object-contain drop-shadow-md`} referrerPolicy="no-referrer" />
                ) : (
                  "N & I"
                )}
              </Link>
            </div>

            {/* Links Center */}
            <nav className="hidden md:flex space-x-8 items-center justify-center flex-1 ml-10">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <NavDropdown key={link.name} title={link.name} items={link.dropdown} location={location} styleClass="text-sm font-medium tracking-wide" />
                ) : (
                  <Link
                    key={link.name}
                    to={link.path!}
                    className={`text-sm font-medium tracking-wide transition-all hover:opacity-70 ${
                      location.pathname === link.path ? 'opacity-100 font-bold border-b-2 border-current' : 'opacity-80'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <NavDropdown title="More" items={(customPages || []).map(p => ({ title: p.title, path: '/' + p.slug }))} location={location} styleClass="text-sm font-medium tracking-wide" />
            </nav>

            {/* Icons Right */}
            <div className="hidden md:flex items-center space-x-6">
              {settings?.music_enabled !== false && (
                <button 
                  onClick={toggleMusic}
                  className="p-2 rounded-full transition-colors hover:bg-black/5"
                  aria-label="Toggle Music"
                >
                  {isPlaying ? <Music className="w-5 h-5 animate-pulse" /> : <Music2 className="w-5 h-5 opacity-50" />}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
              {settings?.music_enabled !== false && (
                <button onClick={toggleMusic} className="p-2 mr-2">
                  {isPlaying ? <Music className="w-5 h-5" /> : <Music2 className="w-5 h-5 opacity-50" />}
                </button>
              )}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
