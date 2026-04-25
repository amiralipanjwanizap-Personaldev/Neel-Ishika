import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Trash2, User, Clock, Loader2, Heart, Reply as ReplyIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Reply {
  id: string;
  message_id: string;
  name: string;
  reply: string;
  created_at: string;
}

interface Message {
  id: string;
  name: string;
  message: string;
  created_at: string;
  replies?: Reply[];
}

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
}

export default function MessageWall() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [replyName, setReplyName] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    fetchMessages();
    checkAdmin();

    // Update relative timestamps every minute
    const timer = setInterval(() => setTick(t => t + 1), 60000);

    const messagesSub = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchMessages();
      })
      .subscribe();

    const repliesSub = supabase
      .channel('public:replies')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'replies' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      clearInterval(timer);
      supabase.removeChannel(messagesSub);
      supabase.removeChannel(repliesSub);
    };
  }, []);

  async function checkAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAdmin(!!session);
  }

  async function fetchMessages() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, replies(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Sort replies within each message
      const sortedData = (data || []).map(msg => ({
        ...msg,
        replies: (msg.replies || []).sort((a: Reply, b: Reply) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      }));

      setMessages(sortedData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ name: name.trim(), message: message.trim() }]);

      if (error) throw error;

      setName('');
      setMessage('');
      setStatus({ type: 'success', text: 'Your message has been posted to the wall! ❤️' });
      setTimeout(() => setStatus(null), 4000);
    } catch (error) {
      console.error('Error posting message:', error);
      setStatus({ type: 'error', text: 'Failed to post message. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReplySubmit(e: React.FormEvent, messageId: string) {
    e.preventDefault();
    if (!replyName.trim() || !replyText.trim()) return;

    setReplySubmitting(true);

    try {
      const { error } = await supabase
        .from('replies')
        .insert([{ 
          message_id: messageId, 
          name: replyName.trim(), 
          reply: replyText.trim() 
        }]);

      if (error) throw error;

      setReplyName('');
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting reply:', error);
      alert('Failed to post reply. Please try again.');
    } finally {
      setReplySubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message.');
    }
  }

  async function handleDeleteReply(id: string) {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;

    try {
      const { error } = await supabase
        .from('replies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert('Failed to delete reply.');
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block p-4 bg-brand-gold/5 rounded-full mb-6"
          >
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center border border-brand-gold/10">
              <MessageSquare className="text-brand-gold w-8 h-8" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif text-brand-navy mb-4 tracking-tight"
          >
            Message Wall
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg font-light max-w-md mx-auto leading-relaxed"
          >
            Leave a note, a wish, or a favorite memory for the happy couple.
          </motion.p>
        </header>

        {/* Message Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 mb-20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-gold/20 via-brand-gold to-brand-gold/20" />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-navy/40 uppercase tracking-widest ml-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah & James"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none transition-all text-brand-navy placeholder:text-gray-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-navy/40 uppercase tracking-widest ml-1">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your love, emojis are welcome! ✨❤️"
                  rows={4}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none transition-all resize-none text-brand-navy placeholder:text-gray-300 leading-relaxed"
                  required
                />
              </div>
            </div>
            
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-2xl text-sm text-center font-medium ${
                    status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                  }`}
                >
                  {status.text}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-navy text-white py-5 rounded-2xl font-semibold hover:bg-brand-navy/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-brand-navy/10 group"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Post to the Wall
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Messages List */}
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-serif text-brand-navy flex items-center gap-3">
              The Wall
              <span className="text-xs font-sans font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full uppercase tracking-wider">
                {messages.length} Notes
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-brand-gold/40" />
              <p className="text-gray-400 text-sm animate-pulse">Curating messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <Heart size={24} />
              </div>
              <p className="text-gray-400 font-medium">Be the first to leave a message ❤️</p>
            </motion.div>
          ) : (
            <div className="grid gap-8">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 100, 
                      damping: 15,
                      delay: index < 5 ? index * 0.1 : 0 
                    }}
                    className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-50 relative group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-gold/5 rounded-2xl flex items-center justify-center text-brand-gold border border-brand-gold/10 group-hover:bg-brand-gold group-hover:text-white transition-colors duration-500">
                          <User size={22} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-brand-navy tracking-tight">{msg.name}</h4>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">
                            <Clock size={10} />
                            {getRelativeTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-2.5 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          title="Delete message"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-[17px] font-light mb-6">
                        {msg.message}
                      </p>

                      <div className="flex items-center gap-4 border-t border-gray-50 pt-4">
                        <button 
                          onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                          className="flex items-center gap-2 text-xs font-bold text-brand-gold uppercase tracking-wider hover:opacity-70 transition-opacity"
                        >
                          <ReplyIcon size={14} />
                          {replyingTo === msg.id ? 'Cancel' : 'Reply'}
                        </button>
                        {msg.replies && msg.replies.length > 0 && (
                          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                            {msg.replies.length} {msg.replies.length === 1 ? 'Reply' : 'Replies'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reply Form */}
                    <AnimatePresence>
                      {replyingTo === msg.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 pt-6 border-t border-gray-50"
                        >
                          <form onSubmit={(e) => handleReplySubmit(e, msg.id)} className="space-y-4">
                            <input
                              type="text"
                              value={replyName}
                              onChange={(e) => setReplyName(e.target.value)}
                              placeholder="Your Name"
                              className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none transition-all text-sm"
                              required
                            />
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write your reply..."
                              rows={2}
                              className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none transition-all text-sm resize-none"
                              required
                            />
                            <button
                              type="submit"
                              disabled={replySubmitting}
                              className="bg-brand-gold text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-gold/90 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                              {replySubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Send Reply'}
                            </button>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Replies List */}
                    {msg.replies && msg.replies.length > 0 && (
                      <div className="mt-6 space-y-4 ml-4 md:ml-8 border-l-2 border-gray-50 pl-4 md:pl-6">
                        {msg.replies.map((reply) => (
                          <div key={reply.id} className="bg-gray-50/50 p-4 rounded-2xl relative group/reply">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-brand-navy">{reply.name}</span>
                                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                                  {getRelativeTime(reply.created_at)}
                                </span>
                              </div>
                              {isAdmin && (
                                <button
                                  onClick={() => handleDeleteReply(reply.id)}
                                  className="text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover/reply:opacity-100"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm font-light leading-relaxed">
                              {reply.reply}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <footer className="mt-24 text-center">
          <div className="inline-flex items-center gap-2 text-gray-300 text-sm font-light">
            <div className="w-8 h-[1px] bg-gray-100" />
            <span>Thank you for your warm wishes</span>
            <div className="w-8 h-[1px] bg-gray-100" />
          </div>
        </footer>
      </div>
    </div>
  );
}
