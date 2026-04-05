import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getGallery } from '../lib/api';

interface GalleryItem {
  id: string;
  file_url: string;
  type: 'image' | 'video';
  created_at: string;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getGallery();
      setItems(data as GalleryItem[]);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-serif text-brand-navy mb-4">Gallery</h1>
        <p className="text-brand-navy/70 max-w-2xl mx-auto">
          A collection of our favorite moments.
        </p>
      </motion.div>

      {items.length === 0 ? (
        <div className="text-center text-brand-navy/50 py-20">
          <p>Gallery will be updated with wedding photos soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.1 }}
              className="aspect-square bg-brand-navy/5 rounded-lg overflow-hidden relative group"
            >
              {item.type === 'video' ? (
                <video
                  src={item.file_url}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                />
              ) : (
                <img
                  src={item.file_url}
                  alt="Gallery item"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
