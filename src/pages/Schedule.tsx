import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, Shirt, Info, Map as MapIcon, Maximize2, X } from 'lucide-react';
import { getEvents } from '../lib/api';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  map_link?: string;
  description?: string;
  dress_code?: string;
  location_label?: string;
  location_number?: string;
}

export default function Schedule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [expandedMap, setExpandedMap] = useState<boolean>(false);

  useEffect(() => {
    async function fetchEvents() {
      const data = await getEvents();
      setEvents(data);
      setLoading(false);
    }
    
    // Get map storage URL from supabase storage
    const { data } = supabase.storage.from('branding').getPublicUrl('seacliff-map.jpg');
    if (data?.publicUrl) {
      setMapUrl(data.publicUrl);
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

                {/* Map Implementation */}
                {event.location_number && event.location_label ? (
                  <div className="mt-6 border-t border-brand-gold/10 pt-4">
                    <div className="flex items-center gap-2 text-sm text-brand-navy font-medium mb-3 relative -left-[1px]">
                      <MapPin size={16} className="text-brand-gold shrink-0" />
                      <span>📍 Location: {event.location_label} (Map No. {event.location_number})</span>
                    </div>
                    
                    {mapUrl && (
                      <div 
                        className="relative group rounded-xl overflow-hidden shadow-sm bg-gray-50 border border-brand-gold/10 cursor-pointer" 
                        onClick={() => setExpandedMap(true)}
                      >
                        <img 
                          src={mapUrl} 
                          alt="Sea Cliff Resort Map" 
                          loading="lazy" 
                          className="w-full h-32 md:h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-brand-navy/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white/95 backdrop-blur text-brand-navy px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg">
                            <Maximize2 size={14} className="text-brand-gold" /> Tap to Expand Map
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-brand-navy/60 mt-3 flex items-start gap-1.5 font-medium">
                      <MapIcon size={14} className="text-brand-gold shrink-0 mt-0.5" />
                      Find number {event.location_number} on the map to reach your event.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 border-t border-brand-gold/10 pt-4 text-sm text-brand-navy/60 flex items-center gap-2">
                    <MapPin size={14} className="text-brand-gold opacity-60" />
                    <i>Location details will be updated soon</i>
                  </div>
                )}
                
                {event.map_link && !event.location_number && (
                  <a
                    href={event.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-xs uppercase tracking-widest text-brand-gold hover:text-brand-navy transition-colors font-medium border border-brand-gold/20 px-4 py-2 rounded-lg hover:bg-brand-gold/5"
                  >
                    View on Map →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Expanded Map Modal */}
      <AnimatePresence>
        {expandedMap && mapUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedMap(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-navy/95 backdrop-blur-md p-2 md:p-8"
          >
            <button
              onClick={() => setExpandedMap(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-50 hover:scale-105 active:scale-95"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-[90vh] max-w-6xl bg-black/50 rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
            >
              {/* Very simple scrollable map container */}
              <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
                <img 
                  src={mapUrl} 
                  alt="Sea Cliff Resort Map Full" 
                  className="min-w-[150%] md:min-w-full lg:max-w-none h-auto object-contain shadow-2xl rounded-lg"
                />
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md text-white/90 text-sm px-6 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-2xl">
                  <Maximize2 size={16} className="text-brand-gold" />
                  <span>Pinch or scroll to navigate</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
