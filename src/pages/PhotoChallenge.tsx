import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, CheckCircle2, Loader2, Image as ImageIcon, Film, Trophy, Flame, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getGallery } from '../lib/api';

interface Challenge {
  id: string;
  title: string;
  description: string;
}

interface GalleryItem {
  id: string;
  file_url: string;
  type: 'image' | 'video';
  created_at: string;
  challenge_name?: string;
  uploaded_by?: string;
}

const CHALLENGES: Challenge[] = [
  { id: 'bride-selfie', title: 'Selfie with the Bride', description: 'Find the bride and snap a quick selfie together!' },
  { id: 'dance-floor', title: 'Dance Floor Magic', description: 'Capture the energy and best moves on the dance floor.' },
  { id: 'sunset', title: 'Sunset Moment', description: 'The golden hour is perfect for a romantic or scenic shot.' },
  { id: 'group-shot', title: 'The Whole Squad', description: 'Get a photo with at least 5 other guests.' },
  { id: 'funny-moment', title: 'Something Funny', description: 'Catch a candid moment that makes everyone laugh.' },
  { id: 'food-art', title: 'Food Art', description: 'The catering looks too good not to photograph!' },
  { id: 'decor', title: 'The Details', description: 'Capture your favorite piece of wedding decor.' },
];

export default function PhotoChallenge() {
  const [uploaderName, setUploaderName] = useState('');
  const [uploading, setUploading] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = useCallback(async () => {
    const data = await getGallery();
    setGalleryItems(data as GalleryItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const getChallengeStats = () => {
    const stats: Record<string, number> = {};
    galleryItems.forEach(item => {
      if (item.challenge_name) {
        stats[item.challenge_name] = (stats[item.challenge_name] || 0) + 1;
      }
    });
    
    let popularChallenge = '';
    let maxUploads = 0;
    Object.entries(stats).forEach(([name, count]) => {
      if (count > maxUploads) {
        maxUploads = count;
        popularChallenge = name;
      }
    });

    return { stats, popularChallenge };
  };

  const { stats, popularChallenge } = getChallengeStats();

  async function handleUpload(challengeId: string, challengeTitle: string, e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!uploaderName.trim()) {
      setMessage({ type: 'error', text: 'Please enter your name before uploading.' });
      return;
    }

    setUploading(challengeId);
    setMessage(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `challenge/${challengeId}/${fileName}`;

        // 1. Upload to Storage
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        // 3. Save to Gallery Table
        const { error: dbError } = await supabase
          .from('gallery')
          .insert([
            { 
              file_url: publicUrl, 
              type: file.type.startsWith('video') ? 'video' : 'image',
              challenge_name: challengeTitle,
              uploaded_by: uploaderName.trim()
            }
          ]);

        if (dbError) throw dbError;
      }

      setCompleted(prev => [...prev, challengeId]);
      setMessage({ type: 'success', text: 'Challenge completed! Your photos are in the gallery.' });
      fetchGallery();
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'Failed to upload. Please try again.' });
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block p-3 bg-brand-gold/10 rounded-full mb-4"
          >
            <Camera className="text-brand-gold w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-serif text-brand-navy mb-4"
          >
            Photo Challenge
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Help us capture every moment! Complete these challenges and share your photos directly to our wedding gallery.
          </motion.p>
        </header>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-8 p-4 rounded-xl text-center text-sm font-medium ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Name Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-gold/10 rounded-lg">
              <User className="text-brand-gold w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl text-brand-navy">Before you start</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">Please enter your name so we know who captured these amazing moments!</p>
          <input
            type="text"
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none transition-all text-sm"
          />
        </motion.div>

        <div className="grid gap-8">
          {CHALLENGES.map((challenge, index) => {
            const challengeImages = galleryItems.filter(item => item.challenge_name === challenge.title);
            const isPopular = popularChallenge === challenge.title && stats[challenge.title] > 0;
            const uploadCount = stats[challenge.title] || 0;

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-3xl shadow-sm border transition-all overflow-hidden ${
                  isPopular ? 'border-brand-gold ring-1 ring-brand-gold/20' : 'border-gray-100'
                }`}
              >
                <div className={`p-6 ${isPopular ? 'bg-brand-gold/5' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-serif text-2xl text-brand-navy">{challenge.title}</h3>
                        {isPopular && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold text-white uppercase tracking-wider animate-pulse">
                            <Flame size={10} />
                            Most Popular
                          </span>
                        )}
                        {completed.includes(challenge.id) && (
                          <CheckCircle2 className="text-green-500 w-5 h-5" />
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mb-4">{challenge.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">
                          {uploadCount} {uploadCount === 1 ? 'photo' : 'photos'} submitted
                        </span>
                      </div>
                    </div>
                    
                    <div className="shrink-0">
                      <label className={`
                        relative flex items-center justify-center w-14 h-14 rounded-2xl cursor-pointer transition-all
                        ${uploading === challenge.id ? 'bg-gray-100' : 'bg-brand-gold text-white hover:bg-brand-gold/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'}
                        ${completed.includes(challenge.id) ? 'bg-green-500 hover:bg-green-600' : ''}
                      `}>
                        {uploading === challenge.id ? (
                          <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
                        ) : (
                          <Camera className="w-6 h-6" />
                        )}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*,video/*"
                          multiple
                          onChange={(e) => handleUpload(challenge.id, challenge.title, e)}
                          disabled={!!uploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Challenge Gallery */}
                {challengeImages.length > 0 && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {challengeImages.map((item) => (
                        <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                          {item.type === 'video' ? (
                            <video src={item.file_url} className="w-full h-full object-cover" />
                          ) : (
                            <img 
                              src={item.file_url} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                            <p className="text-[10px] text-white font-medium truncate">
                              By {item.uploaded_by}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <footer className="mt-12 text-center text-gray-400 text-xs">
          <p>All photos will be visible in the public gallery.</p>
          <p className="mt-2">Thank you for being part of our story!</p>
        </footer>
      </div>
    </div>
  );
}
