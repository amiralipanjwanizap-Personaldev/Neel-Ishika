import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, CheckCircle2, Loader2, Image as ImageIcon, Film, Trophy, Flame, User, Heart } from 'lucide-react';
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
  votes?: number;
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
  const [votedImages, setVotedImages] = useState<string[]>([]);
  const [votingId, setVotingId] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    const data = await getGallery();
    setGalleryItems(data as GalleryItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGallery();
    const storedVotes = localStorage.getItem('votedImages');
    if (storedVotes) {
      setVotedImages(JSON.parse(storedVotes));
    }
  }, [fetchGallery]);

  const handleVote = async (imageId: string, currentVotes: number = 0) => {
    if (votedImages.includes(imageId) || votingId) return;
    setVotingId(imageId);
    
    // Optimistic UI update
    setGalleryItems(prev => prev.map(item => 
      item.id === imageId ? { ...item, votes: currentVotes + 1 } : item
    ));

    try {
      const newVotes = currentVotes + 1;
      const { error } = await supabase
        .from('gallery')
        .update({ votes: newVotes })
        .eq('id', imageId);

      if (error) {
        throw error;
      }

      const newVotedList = [...votedImages, imageId];
      setVotedImages(newVotedList);
      localStorage.setItem('votedImages', JSON.stringify(newVotedList));
    } catch (err) {
      console.error('Error voting:', err);
      // Revert optimistic update
      setGalleryItems(prev => prev.map(item => 
        item.id === imageId ? { ...item, votes: currentVotes } : item
      ));
    } finally {
      setVotingId(null);
    }
  };

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

  const getLeaderboardStats = () => {
    const counts: Record<string, number> = {};
    galleryItems.forEach(item => {
      const name = item.uploaded_by?.trim();
      if (name) {
        counts[name] = (counts[name] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const { stats, popularChallenge } = getChallengeStats();
  const topContributors = getLeaderboardStats();

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

        {/* Top Contributors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-gold/10 rounded-lg">
              <Trophy className="text-brand-gold w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl text-brand-navy">Top Contributors</h2>
          </div>
          {topContributors.length > 0 ? (
            <div className="flex flex-col gap-3">
              {topContributors.map(([name, count], index) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <span className="font-medium text-brand-navy text-sm sm:text-base">{name}</span>
                  </div>
                  <span className="text-sm font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full">
                    {count} {count === 1 ? 'photo' : 'photos'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No photos uploaded yet. Be the first!</p>
          )}
        </motion.div>

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
            
            const maxVotes = Math.max(0, ...challengeImages.map(img => img.votes || 0));
            const popularImageId = maxVotes > 0 ? challengeImages.find(img => img.votes === maxVotes)?.id : null;

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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {challengeImages.map((item) => {
                        const isMostLoved = item.id === popularImageId && (item.votes || 0) > 0;
                        const hasVoted = votedImages.includes(item.id);
                        
                        return (
                          <div key={item.id} className="group relative rounded-xl overflow-hidden bg-gray-100 flex flex-col shadow-sm border border-gray-100">
                            <div className="relative aspect-square">
                              {item.type === 'video' ? (
                                <video src={item.file_url} className="w-full h-full object-cover" />
                              ) : (
                                <img 
                                  src={item.file_url} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                />
                              )}
                              {isMostLoved && (
                                <div className="absolute top-2 left-2 z-10">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-md">
                                    <Trophy size={12} className="text-white" />
                                    Most Loved
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="bg-white p-3 border-t border-gray-100 flex items-center justify-between">
                              <p className="text-xs text-gray-500 font-medium truncate max-w-[50%]">
                                By {item.uploaded_by || 'Guest'}
                              </p>
                              
                              <motion.button
                                whileHover={{ scale: hasVoted ? 1 : 1.05 }}
                                whileTap={{ scale: hasVoted ? 1 : 0.95 }}
                                onClick={() => handleVote(item.id, item.votes)}
                                disabled={hasVoted || votingId === item.id}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                                  hasVoted 
                                    ? 'bg-rose-50 text-rose-500 border border-rose-100' 
                                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200'
                                }`}
                              >
                                <Heart 
                                  size={14} 
                                  className={hasVoted ? 'fill-rose-500 text-rose-500' : 'text-gray-400 group-hover:text-rose-500 transition-colors'} 
                                />
                                <span>{item.votes || 0}</span>
                              </motion.button>
                            </div>
                          </div>
                        );
                      })}
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
