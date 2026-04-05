import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, Shirt, Info } from 'lucide-react';
import { getEvents } from '../lib/api';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  map_link: string;
  description?: string;
  dress_code?: string;
}

export default function Schedule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const data = await getEvents();
      setEvents(data);
      setLoading(false);
    }

    fetchEvents();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-serif text-brand-navy mb-4">Event Schedule</h1>
        <p className="text-brand-navy/70">Join us for a weekend of celebrations</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-brand-navy/50 py-20 bg-white/30 rounded-2xl border border-dashed border-brand-gold/30">
          <Calendar className="mx-auto mb-4 opacity-20" size={48} />
          <p>Schedule will be announced soon.</p>
        </div>
      ) : (
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-gold/30 before:to-transparent">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-brand-gold bg-brand-cream text-brand-gold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Calendar size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-brand-gold/20 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-serif text-2xl text-brand-navy mb-2">{event.title}</h3>
                
                <div className="space-y-2 text-sm text-brand-navy/70 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-brand-gold" />
                    <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-brand-gold" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-brand-gold" />
                    <span>{event.venue}</span>
                  </div>
                  {event.dress_code && (
                    <div className="flex items-center gap-2">
                      <Shirt size={14} className="text-brand-gold" />
                      <span>Dress Code: {event.dress_code}</span>
                    </div>
                  )}
                </div>

                {event.description && (
                  <div className="mb-4 p-3 bg-brand-gold/5 rounded-lg border border-brand-gold/10 flex gap-2 items-start">
                    <Info size={14} className="text-brand-gold mt-1 shrink-0" />
                    <p className="text-xs text-brand-navy/80 leading-relaxed">{event.description}</p>
                  </div>
                )}

                {event.map_link && (
                  <a
                    href={event.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs uppercase tracking-widest text-brand-gold hover:text-brand-navy transition-colors font-medium"
                  >
                    View on Map →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
