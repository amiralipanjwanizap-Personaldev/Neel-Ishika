import React from 'react';
import { motion } from 'motion/react';
import { Phone, MessageCircle, Calendar, Sparkles } from 'lucide-react';

export default function Beauty() {
  const services = [
    { name: "Blow Dry", price: "$15" },
    { name: "Hair Styling (Simple)", price: "$40" },
    { name: "Hair Styling (Party Look)", price: "$55" },
    { name: "Makeup (Subtle Look)", price: "$40" },
    { name: "Makeup (Party Glam Look)", price: "$60" },
    { name: "Simple Hair & Makeup", price: "$65" },
    { name: "Lashes", price: "$10" },
  ];

  const whatsappMessage = encodeURIComponent("Hi, I am attending Neel & Ishika's wedding and would like to book hair and makeup services.");

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <span className="block text-sm uppercase tracking-[0.3em] mb-4 opacity-70">Elevate Your Look</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">Bridal Hair & Makeup Services</h1>
        <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto font-light leading-relaxed">
          Professional beauty services available throughout the wedding celebrations in Zanzibar.
        </p>
      </motion.div>

      {/* Booking Information */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-8"
      >
        <div className="rounded-2xl p-8 md:p-12 text-center" style={{ backgroundColor: "rgba(var(--brand-secondary-rgb, 201, 164, 108), 0.05)", border: "1px solid rgba(var(--brand-secondary-rgb, 201, 164, 108), 0.2)" }}>
          <Sparkles className="w-8 h-8 mx-auto mb-6 opacity-60" style={{ color: "var(--brand-secondary, #C9A46C)" }} />
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/50 rounded-xl p-6 shadow-sm">
              <span className="block text-xs uppercase tracking-widest opacity-60 mb-2">Wedding Guest Code</span>
              <span className="text-xl md:text-2xl font-serif tracking-wide" style={{ color: "var(--brand-primary, #1F3A5F)" }}>Neel&IshikaZanzibar2026</span>
            </div>
            <div className="bg-white/50 rounded-xl p-6 shadow-sm">
              <span className="block text-xs uppercase tracking-widest opacity-60 mb-2">Booking Deadline</span>
              <span className="text-xl md:text-2xl font-serif tracking-wide flex items-center justify-center gap-2" style={{ color: "var(--brand-primary, #1F3A5F)" }}>
                <Calendar className="w-5 h-5 opacity-70" /> June 30th, 2026
              </span>
            </div>
          </div>
          <p className="text-sm md:text-base opacity-75 max-w-xl mx-auto italic font-serif">
            "Kindly ensure your appointment is booked before the stated deadline to secure your preferred time slot."
          </p>
        </div>
      </motion.div>

      {/* Additional Information */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-16 rounded-2xl p-8 md:p-10"
        style={{ 
          backgroundColor: "rgba(var(--brand-secondary-rgb, 201, 164, 108), 0.03)", 
          border: "1px solid rgba(var(--brand-secondary-rgb, 201, 164, 108), 0.15)" 
        }}
      >
        <h3 className="text-lg md:text-xl font-serif mb-3 tracking-wide" style={{ color: "var(--brand-primary, #1F3A5F)" }}>
          Additional Information
        </h3>
        <p className="text-sm md:text-base opacity-80 leading-relaxed font-light">
          Complimentary draping will be available for the Wedding Ceremony on 22nd August 2026 on a first-come, first-served basis.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Services & Pricing */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <h2 className="text-2xl md:text-3xl font-serif mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-current opacity-20"></span>
            Services & Pricing
            <span className="w-8 h-px bg-current opacity-20"></span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group relative bg-white/40 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                style={{ border: "1px solid rgba(var(--brand-primary-rgb, 31, 58, 95), 0.08)" }}
              >
                <div className="flex justify-between items-end mb-2">
                  <h3 className="font-medium text-lg leading-tight w-3/4">{service.name}</h3>
                  <span className="font-serif text-xl" style={{ color: "var(--brand-secondary, #C9A46C)" }}>{service.price}</span>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-current opacity-10 w-0 group-hover:w-full transition-all duration-500 rounded-b-xl" style={{ color: "var(--brand-secondary, #C9A46C)" }}></div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Makeup Artist Profile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-28">
            <h2 className="text-2xl md:text-3xl font-serif mb-8 flex items-center gap-3">
              <span className="w-8 h-px bg-current opacity-20"></span>
              The Artist
            </h2>
            <div 
              className="rounded-2xl p-8 text-center bg-white shadow-sm"
              style={{ border: "1px solid rgba(var(--brand-secondary-rgb, 201, 164, 108), 0.3)" }}
            >
              <div className="w-24 h-24 mx-auto rounded-full mb-6 flex items-center justify-center bg-gray-50" style={{ border: "1px solid rgba(var(--brand-secondary-rgb, 201, 164, 108), 0.2)" }}>
                <Sparkles className="w-8 h-8 opacity-40" />
              </div>
              
              <h3 className="text-2xl font-serif mb-1">Shagufta Yunus</h3>
              <p className="text-sm uppercase tracking-widest opacity-60 mb-6">Velvet Vogue Salon</p>
              
              <div className="space-y-4">
                <a 
                  href={`https://wa.me/255789214190?text=${whatsappMessage}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full transition-all duration-300 hover:opacity-90 font-medium text-white shadow-md hover:shadow-lg"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
                
                <a 
                  href="tel:+255789214190"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full transition-all duration-300 hover:opacity-90 font-medium"
                  style={{ 
                    backgroundColor: "var(--brand-primary, #1F3A5F)", 
                    color: "white" 
                  }}
                >
                  <Phone size={18} />
                  Call +255 789 214 190
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
