import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background Image Placeholder */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?q=80&w=2574&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-brand-gold tracking-[0.2em] uppercase text-sm mb-6">
            Together with their families
          </p>
          <h1 className="text-6xl md:text-8xl font-serif text-brand-navy mb-8">
            Neel & Ishika
          </h1>
          <p className="text-lg md:text-xl text-brand-navy/80 mb-12 font-light max-w-xl mx-auto leading-relaxed">
            Invite you to celebrate their wedding in the beautiful island of Zanzibar.
          </p>
          
          <Link 
            to="/schedule"
            className="inline-block bg-brand-navy text-brand-cream px-8 py-4 uppercase tracking-widest text-sm hover:bg-brand-gold transition-colors duration-300"
          >
            View Details
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
