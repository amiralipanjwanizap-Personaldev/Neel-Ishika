import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';

interface PageData {
  title: string;
  content: string;
}

export default function DynamicPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function fetchPage() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pages')
          .select('title, content')
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setPage(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching page:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-4xl font-serif text-brand-navy mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link href="/" className="bg-brand-navy text-white px-8 py-3 rounded-lg hover:bg-brand-gold transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-6xl font-serif text-brand-navy mb-12 text-center">
          {page.title}
        </h1>
        
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-brand-navy prose-a:text-brand-gold hover:prose-a:text-brand-navy prose-img:rounded-3xl shadow-sm bg-white p-8 md:p-12 rounded-[2rem] border border-brand-navy/5">
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </div>
      </motion.div>
    </div>
  );
}
