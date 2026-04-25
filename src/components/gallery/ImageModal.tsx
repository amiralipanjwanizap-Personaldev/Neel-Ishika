import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface GalleryItem {
  id: string;
  file_url: string;
  type: 'image' | 'video';
  created_at: string;
  challenge_name?: string;
  uploaded_by?: string;
}

interface ImageModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function ImageModal({ item, onClose, onNext, onPrev }: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [item, onClose, onNext, onPrev]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-7xl w-full max-h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {item.type === 'video' ? (
            <video
              src={item.file_url}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={item.file_url}
              alt="Gallery Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          )}

          {/* Controls */}
          <div className="absolute -top-12 left-0 right-0 flex justify-between items-center px-4">
            <div className="flex items-center gap-4">
              <a
                href={item.file_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                title="Download"
              >
                <Download size={20} />
              </a>
              {item.uploaded_by && (
                <div className="px-4 py-2 bg-white/10 text-white rounded-full backdrop-blur-md text-sm font-medium">
                  Uploaded by {item.uploaded_by}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          {onPrev && (
            <button
              onClick={onPrev}
              className="absolute left-4 md:-left-16 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
              title="Previous"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="absolute right-4 md:-right-16 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
              title="Next"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
