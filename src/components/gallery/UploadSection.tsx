import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Image as ImageIcon, Film, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UploadSectionProps {
  onUploadComplete: () => void;
}

interface FilePreview {
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
}

export default function UploadSection({ onUploadComplete }: UploadSectionProps) {
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [uploaderName, setUploaderName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const newPreviews: FilePreview[] = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));

    setSelectedFiles(prev => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].previewUrl);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    if (!uploaderName.trim()) {
      setUploadStatus({ type: 'error', message: 'Please enter your name before uploading.' });
      return;
    }

    setUploading(true);
    setUploadStatus(null);
    let successCount = 0;

    try {
      const uploadPromises = selectedFiles.map(async ({ file, type }) => {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `${fileName}`;

        // 1. Upload to Storage
        const { error: storageError } = await supabase.storage
          .from('gallery')
          .upload(filePath, file);

        if (storageError) throw storageError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        // 3. Insert into Database
        const { error: dbError } = await supabase
          .from('gallery')
          .insert([
            {
              file_url: publicUrl,
              type: type,
              uploaded_by: uploaderName.trim()
            }
          ]);

        if (dbError) throw dbError;
        successCount++;
      });

      await Promise.all(uploadPromises);

      setUploadStatus({
        type: 'success',
        message: `Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''}!`
      });
      
      // Clear files
      selectedFiles.forEach(f => URL.revokeObjectURL(f.previewUrl));
      setSelectedFiles([]);
      onUploadComplete();
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus({
        type: 'error',
        message: error.message || 'Failed to upload some files. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-navy/10 p-6 mb-12">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mb-4">
          <Upload className="text-brand-gold" size={24} />
        </div>
        <h2 className="text-xl font-serif text-brand-navy mb-2">Share your moments</h2>
        <p className="text-sm text-brand-navy/60">
          Upload photos and videos from the wedding to share with everyone.
        </p>
      </div>

      <div className="space-y-6">
        {/* User Name Input */}
        <div className="max-w-sm mx-auto w-full">
          <label className="block text-xs font-bold text-brand-navy/40 uppercase tracking-widest mb-2 ml-1">
            Your Name
          </label>
          <input
            type="text"
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-brand-navy/10 focus:bg-white focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold outline-none transition-all text-sm"
          />
        </div>

        {/* File Input Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-brand-navy/10 rounded-xl p-8 text-center cursor-pointer hover:border-brand-gold/50 transition-colors group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*,video/*"
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <div className="flex -space-x-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 border-2 border-white">
                <ImageIcon size={20} />
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 border-2 border-white">
                <Film size={20} />
              </div>
            </div>
            <p className="text-sm font-medium text-brand-navy group-hover:text-brand-gold transition-colors">
              Click to select photos or videos
            </p>
            <p className="text-xs text-brand-navy/40 mt-1">
              Supports multiple files
            </p>
          </div>
        </div>

        {/* Previews */}
        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4"
            >
              {selectedFiles.map((preview, index) => (
                <motion.div
                  key={preview.previewUrl}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                >
                  {preview.type === 'video' ? (
                    <video src={preview.previewUrl} className="w-full h-full object-cover" />
                  ) : (
                    <img src={preview.previewUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                  {preview.type === 'video' && (
                    <div className="absolute bottom-1 left-1 p-1 bg-black/50 text-white rounded-md">
                      <Film size={10} />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Messages */}
        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl flex items-center gap-3 ${
              uploadStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {uploadStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-medium">{uploadStatus.message}</p>
          </motion.div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || uploading}
          className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            selectedFiles.length === 0 || uploading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-brand-gold text-white hover:bg-brand-gold/90 shadow-lg shadow-brand-gold/20'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={20} />
              Upload {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Photos & Videos
            </>
          )}
        </button>
      </div>
    </div>
  );
}
