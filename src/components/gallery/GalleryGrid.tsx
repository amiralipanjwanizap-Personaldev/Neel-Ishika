import React from 'react';
import { motion } from 'motion/react';
import { Film } from 'lucide-react';

interface GalleryItem {
  id: string;
  file_url: string;
  type: 'image' | 'video';
  created_at: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
  onItemClick: (item: GalleryItem) => void;
}

export default function GalleryGrid({ items, onItemClick }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.5,
            delay: (i % 6) * 0.1,
            ease: [0.21, 0.47, 0.32, 0.98]
          }}
          onClick={() => onItemClick(item)}
          className="group relative aspect-[4/5] sm:aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
        >
          {item.type === 'video' ? (
            <div className="w-full h-full relative">
              <video
                src={item.file_url}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                preload="metadata"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                  <Film size={24} />
                </div>
              </div>
            </div>
          ) : (
            <img
              src={item.file_url}
              alt="Gallery item"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
            <p className="text-white text-sm font-medium">
              {item.type === 'video' ? 'Play Video' : 'View Photo'}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
