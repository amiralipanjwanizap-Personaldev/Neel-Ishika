import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Download, Heart, MessageCircle, Send, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GalleryItem {
  id: string;
  file_url: string;
  type: 'image' | 'video';
  created_at: string;
  challenge_name?: string;
  uploaded_by?: string;
  votes?: number;
}

interface GalleryComment {
  id: string;
  name: string;
  comment: string;
  created_at: string;
}

interface ImageModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onVote?: (id: string, currentVotes: number) => void;
  hasVoted?: boolean;
}

export default function ImageModal({ item, onClose, onNext, onPrev, onVote, hasVoted }: ImageModalProps) {
  const [comments, setComments] = useState<GalleryComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      fetchComments();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [item, onClose, onNext, onPrev]);

  const fetchComments = async () => {
    if (!item) return;
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('gallery_comments')
        .select('*')
        .eq('gallery_id', item.id)
        .order('created_at', { ascending: true });
      
      if (!error && data) {
        setComments(data);
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (err) {
      console.error("Error fetching comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !name.trim() || !commentText.trim()) return;

    setSubmitting(true);
    try {
      const { error, data } = await supabase
        .from('gallery_comments')
        .insert([{
          gallery_id: item.id,
          name: name.trim(),
          comment: commentText.trim()
        }])
        .select()
        .single();

      if (!error && data) {
        setComments(prev => [...prev, data]);
        setCommentText('');
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-8"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
          title="Close (Esc)"
        >
          <X size={24} />
        </button>

        {/* Navigation - Desktop */}
        {onPrev && (
          <button
            onClick={onPrev}
            className="hidden md:flex absolute left-4 z-[110] p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
            title="Previous"
          >
            <ChevronLeft size={32} />
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            className="hidden md:flex absolute right-4 z-[110] p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
            title="Next"
          >
            <ChevronRight size={32} />
          </button>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[95vh] md:max-h-[85vh] bg-black rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Image Area */}
          <div className="flex-1 relative bg-black flex flex-col items-center justify-center order-1 md:order-1 min-h-[40vh] md:min-h-0">
            {item.type === 'video' ? (
              <video
                src={item.file_url}
                className="w-full h-full object-contain max-h-[50vh] md:max-h-full"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={item.file_url}
                alt="Gallery Preview"
                className="w-full h-full object-contain max-h-[50vh] md:max-h-full"
                referrerPolicy="no-referrer"
              />
            )}
            
            {/* Mobile Navigation overlay */}
            <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
              {onPrev && (
                <button onClick={onPrev} className="p-2 m-2 bg-black/50 text-white rounded-full backdrop-blur-md"><ChevronLeft size={24} /></button>
              )}
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center md:hidden">
              {onNext && (
                <button onClick={onNext} className="p-2 m-2 bg-black/50 text-white rounded-full backdrop-blur-md"><ChevronRight size={24} /></button>
              )}
            </div>
            
            {/* Fullscreen Download Action */}
            <a
              href={item.file_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
              title="Download"
            >
              <Download size={20} />
            </a>
          </div>

          {/* Social / Comments Sidebar */}
          <div className="w-full md:w-[400px] bg-white flex flex-col order-2 md:order-2 h-[50vh] md:h-full border-t md:border-t-0 md:border-l border-gray-100">
            {/* Header / Info */}
            <div className="p-6 border-b border-gray-100 shrink-0">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-serif text-xl text-brand-navy">By {item.uploaded_by || 'Guest'}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.created_at).toLocaleString(undefined, { 
                      month: 'long', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {item.challenge_name && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-brand-gold/10 text-brand-gold text-[10px] uppercase tracking-wider font-bold">
                    {item.challenge_name}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-4 text-gray-500">
                <button 
                  onClick={() => onVote?.(item.id, item.votes || 0)}
                  disabled={hasVoted}
                  className={`flex items-center gap-1.5 transition-colors ${hasVoted ? 'text-rose-500' : 'hover:text-rose-500'}`}
                >
                  <Heart size={20} className={hasVoted ? 'fill-rose-500' : ''} />
                  <span className="font-medium text-sm">{item.votes || 0}</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={20} />
                  <span className="font-medium text-sm">{comments.length}</span>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50/50">
              {loadingComments ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-6 h-6 text-brand-gold animate-spin" />
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="group">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-semibold text-sm text-brand-navy">{comment.name}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{comment.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No comments yet. Be the first!</p>
                </div>
              )}
              <div ref={commentsEndRef} />
            </div>

            {/* Comment Form */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <form onSubmit={handlePostComment} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. John & Jane)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-all font-medium"
                  required
                />
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full text-sm pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-all"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !commentText.trim()}
                    className="absolute right-1.5 p-1.5 bg-brand-navy text-white rounded-full hover:bg-brand-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

