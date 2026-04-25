import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';

export default function RSVP() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    attending: 'yes',
    plus_one: 'no',
    dietary_requirements: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const { error } = await supabase.from('rsvps').insert([
        {
          name: formData.name,
          attending: formData.attending === 'yes',
          plus_one: formData.plus_one === 'yes',
          dietary_requirements: formData.dietary_requirements
        }
      ]);

      if (error) throw error;
      setStatus('success');
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (status === 'success') {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/60 backdrop-blur-sm p-12 rounded-2xl border border-brand-gold/20 max-w-lg w-full"
        >
          <h2 className="text-3xl font-serif text-brand-navy mb-4">Thank You!</h2>
          <p className="text-brand-navy/70">
            We have received your RSVP. We can't wait to celebrate with you in Zanzibar!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-serif text-brand-navy mb-4">RSVP</h1>
        <p className="text-brand-navy/70">Please let us know if you can make it by September 1st, 2026.</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-white/60 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-brand-gold/20 shadow-sm space-y-6"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-navy mb-2">
            Full Name(s)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-brand-navy/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
            placeholder="John & Jane Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Will you be attending?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="attending"
                value="yes"
                checked={formData.attending === 'yes'}
                onChange={handleChange}
                className="text-brand-gold focus:ring-brand-gold"
              />
              <span className="text-brand-navy">Joyfully Accept</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="attending"
                value="no"
                checked={formData.attending === 'no'}
                onChange={handleChange}
                className="text-brand-gold focus:ring-brand-gold"
              />
              <span className="text-brand-navy">Regretfully Decline</span>
            </label>
          </div>
        </div>

        {formData.attending === 'yes' && (
          <>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">
                Bringing a Plus One?
              </label>
              <select
                name="plus_one"
                value={formData.plus_one}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-brand-navy/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div>
              <label htmlFor="dietary_requirements" className="block text-sm font-medium text-brand-navy mb-2">
                Dietary Requirements
              </label>
              <textarea
                id="dietary_requirements"
                name="dietary_requirements"
                value={formData.dietary_requirements}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-brand-navy/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                placeholder="Vegetarian, Vegan, Nut Allergy, etc."
              ></textarea>
            </div>
          </>
        )}

        {status === 'error' && (
          <p className="text-red-500 text-sm">There was an error submitting your RSVP. Please try again.</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{ 
            backgroundColor: "var(--brand-primary)", 
            color: "var(--brand-bg, #F5E9DA)" 
          }}
          className="w-full py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Submitting...' : 'Send RSVP'}
        </button>
      </motion.form>
    </div>
  );
}
