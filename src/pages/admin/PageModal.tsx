import React, { FormEvent } from 'react';
import { motion } from 'motion/react';
import { X, Save } from 'lucide-react';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  is_visible?: boolean;
  order_index?: number;
}

interface PageFormState {
  title: string;
  slug: string;
  content: string;
  is_visible: boolean;
  order_index: number;
}

interface PageModalProps {
  editingPage: Page | null;
  pageForm: PageFormState;
  setPageForm: React.Dispatch<React.SetStateAction<PageFormState>>;
  setIsPageModalOpen: (open: boolean) => void;
  handleSavePage: (e: FormEvent) => void;
}

export default function PageModal({
  editingPage,
  pageForm,
  setPageForm,
  setIsPageModalOpen,
  handleSavePage
}: PageModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-serif text-brand-navy">
            {editingPage ? 'Edit Page' : 'Create New Page'}
          </h3>
          <button onClick={() => setIsPageModalOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSavePage} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Page Title</label>
              <input
                required
                type="text"
                value={pageForm.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  setPageForm({ ...pageForm, title, slug: editingPage ? pageForm.slug : slug });
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                placeholder="e.g. Gift Registry"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">/</span>
                <input
                  required
                  type="text"
                  value={pageForm.slug}
                  onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') })}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                  placeholder="gift-registry"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order</label>
              <input
                type="number"
                value={pageForm.order_index}
                onChange={(e) => setPageForm({ ...pageForm, order_index: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
              />
            </div>
            <div className="flex items-center h-full pt-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pageForm.is_visible}
                  onChange={(e) => setPageForm({ ...pageForm, is_visible: e.target.checked })}
                  className="rounded text-brand-navy focus:ring-brand-gold"
                />
                <span className="text-sm font-medium text-gray-700">Visible in Navigation</span>
              </label>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Content (Markdown/HTML supported)</label>
            <textarea
              required
              value={pageForm.content}
              onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none min-h-[400px] font-mono text-sm"
              placeholder="Write your page content here..."
            />
          </div>
          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-brand-navy text-white py-3 rounded-lg font-medium hover:bg-brand-gold transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {editingPage ? 'Update Page' : 'Create Page'}
            </button>
            <button
              type="button"
              onClick={() => setIsPageModalOpen(false)}
              className="px-6 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
