import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Trash2, User, Clock, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function MessageWall() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchMessages();
    checkAdmin();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
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
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
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
      setStatus({ type: 'success', text: 'Your message has been posted to the wall!' });
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error('Error posting message:', error);
      setStatus({ type: 'error', text: 'Failed to post message. Please try again.' });
    } finally {
      setSubmitting(false);
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

  return (
    <div className="min-h-screen bg-brand-cream pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-3 bg-brand-gold/10 rounded-full mb-4"
          >
            <MessageSquare className="text-brand-gold w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif text-brand-navy mb-4"
          >
            Message Wall
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 italic"
          >
            Leave a note, a wish, or a favorite memory for the happy couple.
          </motion.p>
        </header>

        {/* Message Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How should we call you?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none transition-all resize-none"
                required
              />
            </div>
            
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-3 rounded-lg text-sm text-center font-medium ${
                    status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {status.text}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-navy text-white py-4 rounded-xl font-medium hover:bg-brand-navy/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  Post Message
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Messages List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-brand-navy mb-6 flex items-center gap-2">
            Recent Messages
            <span className="text-sm font-sans font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {messages.length}
            </span>
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400">No messages yet. Be the first to post!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg text-brand-navy">{msg.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={12} />
                          {new Date(msg.created_at).toLocaleDateString()} at {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
