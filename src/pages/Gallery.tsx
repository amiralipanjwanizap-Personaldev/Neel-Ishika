import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getGallery } from '../lib/api';
import UploadSection from '../components/gallery/UploadSection';
import GalleryGrid from '../components/gallery/GalleryGrid';
import ImageModal from '../components/gallery/ImageModal';

interface GalleryItem {
  id: string;
  file_url: string;
  type: 'image' | 'video';
  created_at: string;
  challenge_name?: string;
  uploaded_by?: string;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const fetchData = useCallback(async () => {
    const data = await getGallery();
    setItems(data as GalleryItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNext = useCallback(() => {
    if (!selectedItem) return;
    const currentIndex = items.findIndex(i => i.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % items.length;
    setSelectedItem(items[nextIndex]);
  }, [selectedItem, items]);

  const handlePrev = useCallback(() => {
    if (!selectedItem) return;
    const currentIndex = items.findIndex(i => i.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setSelectedItem(items[prevIndex]);
  }, [selectedItem, items]);

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

      {/* Step 1: Upload Section */}
      <UploadSection onUploadComplete={fetchData} />

      {items.length === 0 ? (
        <div className="text-center text-brand-navy/50 py-20">
          <p>Gallery will be updated with wedding photos soon!</p>
        </div>
      ) : (
        <GalleryGrid 
          items={items} 
          onItemClick={(item) => setSelectedItem(item)} 
        />
      )}

      {/* Step 3: Modal Preview */}
      <AnimatePresence>
        {selectedItem && (
          <ImageModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onNext={items.length > 1 ? handleNext : undefined}
            onPrev={items.length > 1 ? handlePrev : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
