import React from 'react';
import { motion } from 'motion/react';

interface TemplateProps {
  names: string;
  date: string;
  tagline: string;
  bgUrl?: string;
  logoUrl?: string;
  logoSize?: string;
}

export const ClassicTemplate = ({ names, date, tagline, bgUrl, logoUrl, logoSize }: TemplateProps) => {
  const logoSizes: Record<string, string> = {
    small: "h-20 md:h-24 lg:h-28",
    medium: "h-28 md:h-36 lg:h-44",
    large: "h-40 md:h-52 lg:h-64"
  };
  const logoClass = logoSizes[logoSize || 'medium'] || logoSizes.medium;

  return (
    <div className="relative w-full flex-grow flex items-center justify-center overflow-hidden min-h-[calc(100vh-var(--navbar-height,80px))]">
    {bgUrl && (
      <>
        <img 
          src={bgUrl}
          alt="Wedding Cover"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ objectFit: 'cover' }}
          sizes="100vw"
          fetchPriority="high"
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
      </>
    )}
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 text-center text-white px-4"
    >
      {logoUrl ? (
        <motion.img 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          src={logoUrl} 
          alt="Wedding Logo" 
          className={`mx-auto ${logoClass} mb-8 object-contain drop-shadow-xl`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold tracking-[0.3em] uppercase rounded-full mb-8 border border-white/20">
          {tagline}
        </span>
      )}
      <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-tight drop-shadow-2xl">
        {names}
      </h1>
      <div className="w-24 h-px bg-white/40 mx-auto mb-8" />
      <p className="text-xl md:text-2xl font-serif tracking-widest opacity-90 italic">
        {date}
      </p>
      {logoUrl && (
        <p className="mt-8 text-sm tracking-[0.3em] uppercase opacity-60">
          {tagline}
        </p>
      )}
    </motion.div>
  </div>
  );
};

export const ModernTemplate = ({ names, date, tagline, bgUrl, logoUrl, logoSize }: TemplateProps) => {
  const logoSizes: Record<string, string> = {
    small: "h-12 md:h-16",
    medium: "h-16 md:h-24",
    large: "h-24 md:h-32"
  };
  const logoClass = logoSizes[logoSize || 'medium'] || logoSizes.medium;

  return (
    <div className="relative flex-grow flex flex-col md:flex-row bg-white overflow-hidden min-h-[calc(100vh-var(--navbar-height,80px))]">
    <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 order-2 md:order-1">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        {logoUrl && (
          <img 
            src={logoUrl} 
            alt="Logo" 
            className={`${logoClass} w-auto object-contain mb-4`}
            referrerPolicy="no-referrer"
          />
        )}
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
    <div className="w-full md:w-1/2 h-[50vh] md:min-h-[calc(100vh-var(--navbar-height,80px))] relative order-1 md:order-2">
      {bgUrl ? (
        <>
          <img 
            src={bgUrl} 
            alt="Wedding Cover" 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectFit: 'cover' }}
            sizes="100vw"
            fetchPriority="high"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-navy/10" />
        </>
      ) : (
        <div className="w-full h-full bg-gray-100 relative" />
      )}
    </div>
  </div>
  );
};

export const LuxuryTemplate = ({ names, date, tagline, bgUrl, logoUrl, logoSize }: TemplateProps) => {
  const logoSizes: Record<string, string> = {
    small: "h-20 md:h-24 lg:h-28",
    medium: "h-28 md:h-36 lg:h-44",
    large: "h-40 md:h-52 lg:h-64"
  };
  const logoClass = logoSizes[logoSize || 'medium'] || logoSizes.medium;

  return (
    <div 
      className="relative w-full flex-grow flex items-center justify-center overflow-hidden min-h-[calc(100vh-var(--navbar-height,80px))]"
      style={{ backgroundColor: "var(--brand-primary)" }}
    >
    {bgUrl && (
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={bgUrl}
          alt="Wedding Cover"
          className="w-full h-full object-cover opacity-60"
          style={{ objectFit: 'cover' }}
          sizes="100vw"
          fetchPriority="high"
        />
      </motion.div>
    )}
    <div 
      className="absolute inset-0 z-10 bg-gradient-to-b from-brand-primary/80 via-transparent to-brand-primary/80" 
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
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt="Wedding Logo" 
            className={`mx-auto ${logoClass} mb-6 object-contain drop-shadow-2xl`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div 
            className="w-20 h-20 border-2 rounded-full mx-auto flex items-center justify-center mb-6"
            style={{ borderColor: "var(--brand-secondary)" }}
          >
            <span className="text-3xl font-serif" style={{ color: "var(--brand-secondary)" }}>
              {names.split('&').map(n => n.trim()[0]).join('')}
            </span>
          </div>
        )}
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
};

export const CinematicTemplate = ({ names, date, tagline, bgUrl, logoUrl, logoSize }: TemplateProps) => {
  const logoSizes: Record<string, string> = {
    small: "h-20 md:h-24 lg:h-28",
    medium: "h-28 md:h-36 lg:h-44",
    large: "h-40 md:h-52 lg:h-64",
    xlarge: "h-52 md:h-64 lg:h-80"
  };
  const logoClass = logoSizes[logoSize || 'medium'] || logoSizes.medium;

  return (
    <div className="relative w-full flex-grow flex items-center justify-center overflow-hidden bg-black min-h-[calc(100vh-var(--navbar-height,80px))]">
      {bgUrl && (
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={bgUrl}
            alt="Wedding Cover"
            className="w-full h-full object-cover"
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </motion.div>
      )}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 2 }}
        className="relative z-10 text-center text-white px-4"
      >
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className={`mx-auto ${logoClass} mb-12 object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]`} />
        ) : (
          <h1 className="text-6xl md:text-8xl font-serif mb-6 tracking-wide drop-shadow-2xl">{names}</h1>
        )}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-white/60" />
          <p className="text-xl md:text-2xl font-serif tracking-[0.3em] uppercase opacity-90">{date}</p>
          <div className="h-px w-12 bg-white/60" />
        </div>
        <p className="text-sm tracking-[0.4em] uppercase opacity-70 mt-4">{tagline}</p>
      </motion.div>
    </div>
  );
};

export const EditorialTemplate = ({ names, date, tagline, bgUrl, logoUrl, logoSize }: TemplateProps) => {
  const logoSizes: Record<string, string> = {
    small: "h-16 md:h-20",
    medium: "h-24 md:h-32",
    large: "h-32 md:h-40",
    xlarge: "h-40 md:h-56"
  };
  const logoClass = logoSizes[logoSize || 'medium'] || logoSizes.medium;

  return (
    <div className="relative min-h-[calc(100vh-var(--navbar-height,80px))] flex flex-col md:flex-row bg-[#FAFAFA] overflow-hidden p-4 md:p-12 gap-8">
      <div className="w-full md:w-5/12 flex flex-col justify-between pt-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400">{tagline}</p>
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className={`${logoClass} w-auto object-contain`} />
          ) : (
            <h1 className="text-5xl md:text-7xl font-serif leading-tight text-gray-900">{names}</h1>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 md:mt-0 pb-12">
          <p className="text-2xl font-serif text-gray-900 italic mb-2">The Wedding</p>
          <p className="text-sm tracking-widest text-gray-500 uppercase">{date}</p>
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="w-full md:w-7/12 h-[60vh] md:h-[calc(100vh-6rem)] relative"
      >
        {bgUrl ? (
          <img src={bgUrl} alt="Wedding Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </motion.div>
    </div>
  );
};

export const GlassTemplate = ({ names, date, tagline, bgUrl, logoUrl, logoSize }: TemplateProps) => {
  const logoSizes: Record<string, string> = {
    small: "h-20 md:h-24",
    medium: "h-28 md:h-36",
    large: "h-40 md:h-48",
    xlarge: "h-48 md:h-64"
  };
  const logoClass = logoSizes[logoSize || 'medium'] || logoSizes.medium;

  return (
    <div className="relative w-full flex-grow flex items-center justify-center overflow-hidden min-h-[calc(100vh-var(--navbar-height,80px))]">
      {bgUrl && (
        <img src={bgUrl} alt="Wedding Cover" className="absolute inset-0 w-full h-full object-cover z-0" />
      )}
      <div className="absolute inset-0 bg-black/20 z-0" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-[90%] md:w-auto max-w-3xl backdrop-blur-md bg-white/10 border border-white/20 p-8 md:p-16 rounded-3xl text-center shadow-2xl"
      >
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className={`mx-auto ${logoClass} mb-8 object-contain`} />
        ) : (
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-md">{names}</h1>
        )}
        <p className="text-lg md:text-xl text-white font-medium tracking-[0.2em] mb-4 drop-shadow">{date}</p>
        <p className="text-sm text-white/80 tracking-widest uppercase">{tagline}</p>
      </motion.div>
    </div>
  );
};

export const RomanticTemplate = ({ names, date, tagline, bgUrl, logoUrl, logoSize }: TemplateProps) => {
  const logoSizes: Record<string, string> = {
    small: "h-24 md:h-32",
    medium: "h-36 md:h-48",
    large: "h-48 md:h-64",
    xlarge: "h-64 md:h-80"
  };
  const logoClass = logoSizes[logoSize || 'medium'] || logoSizes.medium;

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden bg-brand-cream min-h-[calc(100vh-var(--navbar-height,80px))]">
      {bgUrl && (
        <>
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            src={bgUrl} 
            alt="Wedding Cover" 
            className="absolute inset-0 w-full h-full object-cover opacity-70 z-0" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5E9DA]/50 via-transparent to-[#F5E9DA] z-0" 
               style={{ background: "linear-gradient(to bottom, rgba(var(--brand-bg, 245,233,218), 0.4), transparent, var(--brand-bg, #F5E9DA))" }}/>
        </>
      )}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="relative z-10 text-center px-4"
        style={{ color: "var(--brand-primary, #1F3A5F)" }}
      >
        {logoUrl ? (
          <motion.img 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src={logoUrl} 
            alt="Logo" 
            className={`mx-auto ${logoClass} mb-10 object-contain drop-shadow-xl`} 
          />
        ) : (
          <h1 className="text-6xl md:text-8xl font-serif mb-8 italic">{names}</h1>
        )}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <p className="text-xl md:text-2xl font-serif tracking-[0.2em]">{date}</p>
          <p className="mt-6 text-sm tracking-widest uppercase opacity-70">{tagline}</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export const MonogramTemplate = ({ names, date, tagline, bgUrl, logoUrl, logoSize }: TemplateProps) => {
  const logoSizes: Record<string, string> = {
    small: "h-32 md:h-40",
    medium: "h-48 md:h-64",
    large: "h-64 md:h-80",
    xlarge: "h-80 md:h-96"
  };
  const logoClass = logoSizes[logoSize || 'medium'] || logoSizes.medium;

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-8 bg-white overflow-hidden min-h-[calc(100vh-var(--navbar-height,80px))]">
      {bgUrl && (
        <div className="absolute inset-0 opacity-10">
          <img src={bgUrl} alt="Background" className="w-full h-full object-cover blur-sm" />
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto border-4 p-8 md:p-16 border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <div className="w-full border-b border-gray-200 pb-12 mb-12 text-center flex flex-col items-center">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className={`${logoClass} object-contain`} />
          ) : (
            <h1 className="text-6xl md:text-8xl font-serif tracking-tighter text-gray-900">{names}</h1>
          )}
        </div>
        <div className="flex flex-col md:flex-row justify-between w-full items-center gap-8 text-center md:text-left">
          <div className="flex-1">
            <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">The Date</p>
            <p className="text-xl md:text-2xl font-serif text-gray-900">{date}</p>
          </div>
          <div className="h-12 w-px bg-gray-200 hidden md:block" />
          <div className="flex-1 md:text-right">
            <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">Join Us</p>
            <p className="text-xl md:text-2xl font-serif text-gray-900 italic">{tagline}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
