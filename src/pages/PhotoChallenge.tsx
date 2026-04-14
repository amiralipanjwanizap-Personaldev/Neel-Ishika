import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, CheckCircle2, Loader2, Image as ImageIcon, Film } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Challenge {
  id: string;
  title: string;
  description: string;
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
  const [uploading, setUploading] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleUpload(challengeId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

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
              type: file.type.startsWith('video') ? 'video' : 'image' 
            }
          ]);

        if (dbError) throw dbError;
      }

      setCompleted(prev => [...prev, challengeId]);
      setMessage({ type: 'success', text: 'Challenge completed! Your photos are in the gallery.' });
      
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

        <div className="grid gap-4">
          {CHALLENGES.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${
                completed.includes(challenge.id) ? 'border-green-200 bg-green-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-xl text-brand-navy">{challenge.title}</h3>
                    {completed.includes(challenge.id) && (
                      <CheckCircle2 className="text-green-500 w-5 h-5" />
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{challenge.description}</p>
                </div>
                
                <div className="shrink-0">
                  <label className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-all
                    ${uploading === challenge.id ? 'bg-gray-100' : 'bg-brand-gold text-white hover:bg-brand-gold/90 shadow-md hover:shadow-lg'}
                    ${completed.includes(challenge.id) ? 'bg-green-500 hover:bg-green-600' : ''}
                  `}>
                    {uploading === challenge.id ? (
                      <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
                    ) : completed.includes(challenge.id) ? (
                      <Upload className="w-6 h-6" />
                    ) : (
                      <Camera className="w-6 h-6" />
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => handleUpload(challenge.id, e)}
                      disabled={!!uploading}
                    />
                  </label>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <footer className="mt-12 text-center text-gray-400 text-xs">
          <p>All photos will be visible in the public gallery.</p>
          <p className="mt-2">Thank you for being part of our story!</p>
        </footer>
      </div>
    </div>
  );
}
