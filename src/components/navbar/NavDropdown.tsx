import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NavDropdown = ({ title = "More", items, location, styleClass = "text-xs tracking-widest uppercase" }: { title?: string, items: { title: string; path: string }[], location: any, styleClass?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!items || items.length === 0) return null;

  return (
    <div 
      className="relative flex items-center h-full"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className={`${styleClass} transition-all hover:opacity-70 flex items-center gap-1`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {title} <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 md:left-0 pt-2 z-50"
            >
              <div 
                className="py-2 min-w-[200px] rounded-lg shadow-xl"
                style={{ 
                  backgroundColor: "var(--brand-bg, #F5E9DA)",
                  border: "1px solid rgba(var(--brand-secondary-rgb, 201, 164, 108), 0.2)",
                  color: "var(--brand-primary, #1F3A5F)"
                }}
              >
                {items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-3 text-sm transition-colors hover:bg-black/5 ${
                      location.pathname === item.path ? 'font-bold' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
