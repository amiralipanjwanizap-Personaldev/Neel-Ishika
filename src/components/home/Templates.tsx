import React from 'react';
import { motion } from 'motion/react';

interface TemplateProps {
  names: string;
  date: string;
  tagline: string;
  bgUrl?: string;
}

export const ClassicTemplate = ({ names, date, tagline, bgUrl }: TemplateProps) => (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {bgUrl && (
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>
    )}
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 text-center text-white px-4"
    >
      <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold tracking-[0.3em] uppercase rounded-full mb-8 border border-white/20">
        {tagline}
      </span>
      <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-tight drop-shadow-2xl">
        {names}
      </h1>
      <div className="w-24 h-px bg-white/40 mx-auto mb-8" />
      <p className="text-xl md:text-2xl font-serif tracking-widest opacity-90 italic">
        {date}
      </p>
    </motion.div>
  </div>
);

export const ModernTemplate = ({ names, date, tagline, bgUrl }: TemplateProps) => (
  <div className="relative min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
    <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 order-2 md:order-1">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <p 
          className="font-bold tracking-[0.2em] uppercase text-sm"
          style={{ color: "var(--brand-secondary)" }}
        >
          {tagline}
        </p>
        <h1 
          className="text-5xl md:text-7xl font-bold leading-none tracking-tighter"
          style={{ color: "var(--brand-primary)" }}
        >
          {names.split('&').map((name, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="block text-4xl my-2" style={{ color: "var(--brand-secondary)" }}>&</span>}
              <span className="block">{name.trim()}</span>
            </React.Fragment>
          ))}
        </h1>
        <div className="pt-8">
          <p 
            className="text-2xl font-medium border-l-4 pl-6"
            style={{ color: "rgba(var(--brand-primary-rgb, 31, 58, 95), 0.6)", borderLeftColor: "var(--brand-secondary)" }}
          >
            {date}
          </p>
        </div>
      </motion.div>
    </div>
    <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative order-1 md:order-2">
      {bgUrl ? (
        <img 
          src={bgUrl} 
          alt="Wedding" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full bg-gray-100" />
      )}
      <div className="absolute inset-0 bg-brand-navy/10" />
    </div>
  </div>
);

export const LuxuryTemplate = ({ names, date, tagline, bgUrl }: TemplateProps) => (
  <div 
    className="relative min-h-screen flex items-center justify-center overflow-hidden"
    style={{ backgroundColor: "var(--brand-primary)" }}
  >
    {bgUrl && (
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0 bg-cover bg-center z-0 opacity-60"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
    )}
    <div 
      className="absolute inset-0 z-10" 
      style={{ 
        background: "linear-gradient(to bottom, rgba(var(--brand-primary-rgb, 31, 58, 95), 0.8), transparent, rgba(var(--brand-primary-rgb, 31, 58, 95), 0.8))" 
      }}
    />
    
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="relative z-20 text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mb-12"
      >
        <div 
          className="w-20 h-20 border-2 rounded-full mx-auto flex items-center justify-center mb-6"
          style={{ borderColor: "var(--brand-secondary)" }}
        >
          <span className="text-3xl font-serif" style={{ color: "var(--brand-secondary)" }}>
            {names.split('&').map(n => n.trim()[0]).join('')}
          </span>
        </div>
        <div 
          className="h-px w-32 mx-auto"
          style={{ background: "linear-gradient(to right, transparent, var(--brand-secondary), transparent)" }}
        />
      </motion.div>

      <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 tracking-wider uppercase">
        {names}
      </h1>
      
      <p 
        className="text-xl md:text-2xl tracking-[0.5em] uppercase font-light"
        style={{ color: "var(--brand-secondary)" }}
      >
        {date}
      </p>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-12 text-white/60 text-lg italic font-serif"
      >
        {tagline}
      </motion.p>
    </motion.div>
  </div>
);
