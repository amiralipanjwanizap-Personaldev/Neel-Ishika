import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getGallery } from '../lib/api';
import { Camera, Image as ImageIcon, Heart, ArrowLeft, Trophy, User, Filter, Flame } from 'lucide-react';

interface GalleryItem {
  id: string;
  file_url: string;
  type: 'image' | 'video';
  created_at: string;
  challenge_name?: string;
  uploaded_by?: string;
  votes?: number;
}

const CHALLENGES = [
  'Selfie with the Bride',
  'Dance Floor Magic',
  'Sunset Moment',
  'The Whole Squad',
  'Something Funny',
  'Food Art',
  'The Details'
];

export default function ChallengeGallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedImages, setVotedImages] = useState<string[]>([]);
  const [votingId, setVotingId] = useState<string | null>(null);

  const initialFilter = searchParams.get('challenge') || 'All Challenges';
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const fetchGallery = useCallback(async () => {
    const data = await getGallery();
    setGalleryItems((data as GalleryItem[]).filter(item => item.challenge_name));
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

  const setFilter = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'All Challenges') {
      searchParams.delete('challenge');
    } else {
      searchParams.set('challenge', filter);
    }
    setSearchParams(searchParams);
  };

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All Challenges') return galleryItems;
    return galleryItems.filter(item => item.challenge_name === activeFilter);
  }, [galleryItems, activeFilter]);

  const topPhotos = useMemo(() => {
    return [...galleryItems].sort((a, b) => (b.votes || 0) - (a.votes || 0)).slice(0, 3);
  }, [galleryItems]);

  const topContributors = useMemo(() => {
    const counts: Record<string, number> = {};
    galleryItems.forEach(item => {
      const name = item.uploaded_by?.trim();
      if (name) {
        counts[name] = (counts[name] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [galleryItems]);

  return (
    <div className="min-h-screen bg-brand-cream pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <Link to="/games/photo-challenge" className="inline-flex items-center gap-2 text-brand-navy/70 hover:text-brand-navy transition-colors mb-6 text-sm font-medium">
            <ArrowLeft size={16} />
            Back to Challenges
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block p-3 bg-brand-gold/10 rounded-full mb-4"
              >
                <ImageIcon className="text-brand-gold w-8 h-8" />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-4xl md:text-5xl font-serif text-brand-navy mb-4"
              >
                Challenge Gallery
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 max-w-xl"
              >
                Explore all moments captured by our guests, vote for your favorites, and see who's dominating the leaderboards.
              </motion.p>
            </div>
          </div>
        </header>

        {/* Leaderboards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Most Loved */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-rose-50 rounded-lg">
                <Flame className="text-rose-500 w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl text-brand-navy">Most Loved Photos</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topPhotos.map((photo, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={photo.id} 
                  className="relative group rounded-2xl overflow-hidden bg-gray-100 aspect-square sm:aspect-auto sm:h-64 border border-gray-100 shadow-sm"
                >
                  {photo.type === 'video' ? (
                    <video src={photo.file_url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={photo.file_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow-md ${
                        i === 0 ? 'bg-yellow-400 text-yellow-900' :
                        i === 1 ? 'bg-gray-300 text-gray-800' :
                        'bg-amber-600 text-white'
                      }`}>
                        #{i + 1}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-rose-600 shadow-sm">
                        <Heart size={14} className="fill-rose-600" />
                        {photo.votes || 0}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm drop-shadow-md">By {photo.uploaded_by || 'Guest'}</p>
                      <p className="text-white/80 text-xs drop-shadow-md">{photo.challenge_name}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {topPhotos.length === 0 && (
                <div className="col-span-3 text-center py-12 text-gray-400 text-sm">
                  No photos uploaded yet. Check back soon!
                </div>
              )}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-gold/10 rounded-lg">
                <Trophy className="text-brand-gold w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl text-brand-navy">Top Contributors</h2>
            </div>
            
            {topContributors.length > 0 ? (
              <div className="flex-1 flex flex-col justify-between gap-4">
                {topContributors.map(([name, count], index) => (
                  <div key={name} className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-gray-50 border border-gray-100 transition-colors hover:bg-white hover:border-gray-200 hover:shadow-sm">
                    <div className="flex items-center gap-4">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-200 text-gray-700' :
                        index === 2 ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-brand-navy">{name}</span>
                    </div>
                    <span className="text-sm font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-gray-400 text-sm py-12">
                Leaderboard is empty. Be the first to upload!
              </div>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
            <h2 className="text-2xl font-serif text-brand-navy flex items-center gap-2">
              <Camera className="text-gray-400 w-6 h-6" />
              All Submissions
            </h2>
            
            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
              <Filter className="text-gray-400 w-4 h-4 shrink-0 hidden sm:block" />
              {['All Challenges', ...CHALLENGES].map(challenge => (
                <button
                  key={challenge}
                  onClick={() => setFilter(challenge)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${
                    activeFilter === challenge 
                    ? 'bg-brand-navy text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {challenge}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-8 h-8 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mb-4" />
              <p className="text-gray-500 text-sm font-medium animate-pulse">Loading gallery...</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredItems.map((item) => {
                const hasVoted = votedImages.includes(item.id);
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.id} 
                    className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
                  >
                    <div className="relative">
                      {item.type === 'video' ? (
                        <video src={item.file_url} className="w-full object-cover" />
                      ) : (
                        <img 
                          src={item.file_url} 
                          className="w-full object-cover" 
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-medium text-brand-navy">By {item.uploaded_by || 'Guest'}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[10px] uppercase tracking-wider font-semibold mt-1">
                            {item.challenge_name}
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: hasVoted ? 1 : 1.05 }}
                          whileTap={{ scale: hasVoted ? 1 : 0.95 }}
                          onClick={() => handleVote(item.id, item.votes)}
                          disabled={hasVoted || votingId === item.id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
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
                      <p className="text-[10px] text-gray-400 mt-2">
                        {new Date(item.created_at).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          
          {!loading && filteredItems.length === 0 && (
            <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="text-gray-300 w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif text-brand-navy mb-2">No photos yet</h3>
              <p className="text-gray-500 mb-6">Be the first to upload a photo for this challenge!</p>
              <Link
                to="/games/photo-challenge"
                className="inline-block px-6 py-3 bg-brand-navy text-white rounded-full text-sm font-medium hover:bg-brand-gold transition-colors"
              >
                Go to Uploads
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
