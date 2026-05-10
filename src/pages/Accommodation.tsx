import { motion } from 'motion/react';
import { Bed, CalendarDays, ExternalLink, Mail, Info } from 'lucide-react';

export default function Accommodation() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <span className="inline-block px-4 py-1.5 bg-brand-gold/10 text-brand-gold text-xs font-bold tracking-[0.2em] uppercase rounded-full mb-6">
          Your Stay in Zanzibar
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-navy mb-6">Accommodation</h1>
        <p className="text-brand-navy/60 max-w-2xl mx-auto text-lg leading-relaxed">
          Information regarding your stay in Zanzibar.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-10 rounded-[2rem] border border-brand-navy/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
        >
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <CalendarDays size={24} />
          </div>
          <h3 className="text-2xl font-serif text-brand-navy mb-4">Stay Dates</h3>
          <p className="text-brand-navy/70 leading-relaxed mb-6">
            The wedding festivities run from <strong>21st to 24th August 2026</strong>. 
            All official wedding events and included accommodations will fall within these dates.
          </p>
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <p className="text-sm text-brand-navy/80 flex items-start gap-2">
              <Info size={16} className="text-blue-500 mt-1 flex-shrink-0" />
              <span>We will allocate rooms based on availability closer to the date. Check-in is normally at 2:00 PM and check-out is at 11:00 AM.</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 md:p-10 rounded-[2rem] border border-brand-navy/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
        >
          <div className="w-14 h-14 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mb-6">
            <Bed size={24} />
          </div>
          <h3 className="text-2xl font-serif text-brand-navy mb-4">Extended Stays</h3>
          <p className="text-brand-navy/70 leading-relaxed mb-6">
            If you plan to arrive early or stay later to explore more of Zanzibar, we have arranged a special discount code.
          </p>
          <div className="bg-brand-navy/5 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs uppercase tracking-widest text-brand-navy/50 font-bold mb-1">Discount Code</p>
              <p className="text-2xl font-mono text-brand-gold font-bold">Ishika&amp;Neel-21Aug2026</p>
            </div>
          </div>
          <p className="text-sm text-brand-navy/60 italic mb-2">To book additional nights at our corporate rate, please contact:</p>
          <a href="mailto:reservations@seacliffresort.com" className="inline-flex items-center gap-2 text-brand-gold font-medium hover:text-brand-navy transition-colors">
            <Mail size={16} /> reservations@seacliffresort.com
          </a>
        </motion.div>
      </div>

    </div>
  );
}
