import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, Shirt, Info, X, Map as MapIcon } from 'lucide-react';
import { getEvents } from '../lib/api';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  map_link: string;
  description?: string;
  dress_code?: string;
  location_label?: string;
  location_number?: string;
  map_x?: number;
  map_y?: number;
}

export default function Schedule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [highlightedLocation, setHighlightedLocation] = useState<string | null>(null);

  const mapUrl = supabase.storage.from('branding').getPublicUrl('seacliff-map.jpg').data.publicUrl;

  const mapMarkers: Record<string, { x: number, y: number }> = {};
  events.forEach(event => {
    if (event.location_number && event.map_x !== undefined && event.map_y !== undefined) {
      mapMarkers[event.location_number] = { x: event.map_x, y: event.map_y };
    }
  });

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
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-brand-gold bg-brand-cream text-brand-gold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Calendar size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-brand-gold/20 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-serif text-2xl text-brand-navy mb-2">{event.title}</h3>
                
                <div className="space-y-2 text-sm text-brand-navy/70 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-brand-gold shrink-0" />
                    <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-brand-gold shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  {event.dress_code && (
                    <div className="flex items-center gap-2">
                      <Shirt size={14} className="text-brand-gold shrink-0" />
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

                {/* Venue Map Guide Section */}
                {event.location_number ? (
                  <div 
                    onClick={() => {
                      setSelectedMap(mapUrl);
                      setHighlightedLocation(event.location_number!);
                    }}
                    className="mt-6 bg-brand-gold/5 p-3 rounded-xl border border-brand-gold/10 flex items-center justify-between cursor-pointer hover:bg-brand-gold/10 transition-colors group/map"
                  >
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-brand-gold mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium text-brand-navy text-sm">
                          📍 {event.location_label || event.venue} (Map No. {event.location_number})
                        </div>
                      </div>
                    </div>
                    <div className="text-brand-gold bg-white p-1.5 rounded-full shadow-sm group-hover/map:scale-110 transition-transform">
                      <MapIcon size={14} />
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 p-4 bg-gray-50/80 rounded-xl border border-gray-200 border-dashed text-brand-navy/50 text-sm text-center">
                    Location details will be updated soon
                  </div>
                )}

                {event.map_link && (
                  <div className="mt-4">
                    <a
                      href={event.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs uppercase tracking-widest text-brand-gold hover:text-brand-navy transition-colors font-medium"
                    >
                      View on external map →
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bottom Map Section */}
      {events.length > 0 && (
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mt-20 pt-16 border-t border-brand-gold/20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-brand-navy mb-4">Venue Map Guide</h2>
            <p className="text-brand-navy/70">Find your event location using the map numbers below.</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-brand-gold/20">
             <div 
               className="relative w-full cursor-pointer group bg-gray-100"
               onClick={() => {
                 setSelectedMap(mapUrl);
                 setHighlightedLocation(null);
               }}
             >
               <div className="relative w-full transition-transform duration-700 group-hover:scale-[1.02]">
                 <img 
                   src={mapUrl} 
                   alt="Resort Map" 
                   loading="lazy"
                   className="w-full h-auto block"
                 />
                 
                 {/* Map Markers Overlay */}
                 <div className="absolute inset-0">
                   {Object.entries(mapMarkers).map(([num, pos]) => (
                     <div 
                       key={num}
                       className={`absolute flex items-center justify-center rounded-full font-bold shadow-md transition-all duration-300 w-5 h-5 md:w-6 md:h-6 bg-white text-brand-navy text-[10px] md:text-xs z-10`}
                       style={{ top: `${pos.y}%`, left: `${pos.x}%`, transform: `translate(-50%, -50%)` }}
                     >
                       {num}
                     </div>
                   ))}
                 </div>
               </div>
               
               <div className="absolute inset-0 bg-brand-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                 <span className="flex items-center gap-2 bg-white/95 text-brand-navy px-4 py-2 rounded-full text-sm font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                   <MapIcon size={16} />
                   Tap to Expand Map
                 </span>
               </div>
               
               <div className="absolute bottom-4 right-4 bg-white/90 p-2.5 rounded-full shadow-lg md:hidden z-20">
                 <MapIcon size={20} className="text-brand-navy" />
               </div>
             </div>
             
             <div className="p-8">
               <h3 className="font-serif text-xl text-brand-navy mb-6">Event Locations</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {events.filter(e => e.location_number).length > 0 ? (
                   events.filter(e => e.location_number).map((event) => (
                     <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                       <div className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold text-sm shrink-0">
                         {event.location_number}
                       </div>
                       <p className="text-sm text-brand-navy font-medium">
                         {event.title} <span className="opacity-60 text-xs ml-1">→ {event.location_label || event.venue}</span>
                       </p>
                     </div>
                   ))
                 ) : (
                   <div className="col-span-full text-center text-brand-navy/50 py-4 text-sm">
                     Map locations will be added soon.
                   </div>
                 )}
               </div>
             </div>
          </div>
        </motion.div>
      )}

      {/* Map Interactive Modal */}
      <AnimatePresence>
        {selectedMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          >
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
              <p className="text-white/80 text-sm font-medium">Pinch or scroll to zoom</p>
              <button 
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
                onClick={() => setSelectedMap(null)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div 
              className="flex-1 w-full h-full overflow-auto touch-pan-x touch-pan-y"
              onClick={() => setSelectedMap(null)}
            >
              <div className="min-w-full min-h-full flex items-center justify-center p-4 md:p-10">
                <div 
                  className="relative max-w-none w-[150vw] md:w-[90vw] lg:w-[75vw] xl:w-[60vw]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img 
                    src={selectedMap} 
                    alt="Expanded Resort Map" 
                    className="w-full h-auto block bg-white rounded-xl shadow-2xl"
                  />
                  
                  {/* Modal Map Markers Overlay */}
                  <div className="absolute inset-0">
                    {Object.entries(mapMarkers).map(([num, pos]) => {
                      const isHighlighted = highlightedLocation === num;
                      return (
                        <div 
                          key={num}
                          className={`absolute flex items-center justify-center rounded-full font-bold shadow-lg transition-all duration-300 ${
                            isHighlighted 
                              ? 'w-10 h-10 md:w-12 md:h-12 bg-brand-gold text-white shadow-[0_0_20px_rgba(212,175,55,0.7)] z-30 text-base md:text-lg ring-4 ring-white' 
                              : 'w-6 h-6 md:w-8 md:h-8 bg-white/90 text-brand-navy z-20 text-xs md:text-sm border border-brand-gold/20'
                          }`}
                          style={{ 
                            top: `${pos.y}%`, 
                            left: `${pos.x}%`, 
                            transform: `translate(-50%, -50%) ${isHighlighted ? 'scale(1.2)' : 'scale(1)'}` 
                          }}
                        >
                          {num}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
