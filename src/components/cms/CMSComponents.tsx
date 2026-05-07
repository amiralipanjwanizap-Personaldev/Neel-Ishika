import React, { useState, useEffect } from 'react';
import { useCMS } from '../../lib/CMSProvider';
import { Settings, Image as ImageIcon, Save, X, Type, LayoutGrid, Plus, ArrowUp, ArrowDown, Copy, Eye, EyeOff, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { CMSPage, CMSSection } from '../../lib/cmsUtils';
import { Link } from 'react-router-dom';

export const AdminBadge = () => {
  const { isAdmin, isEditMode } = useCMS();
  if (!isAdmin) return null;
  return (
    <Link 
      to="/admin" 
      className={`fixed top-4 right-4 z-[100] bg-brand-navy/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-md flex items-center gap-2 border border-brand-navy/10 hover:bg-brand-navy transition-colors ${isEditMode ? 'opacity-0 pointer-events-none' : ''}`}
    >
      <Settings size={14} className="text-brand-gold" />
      Admin Editing Enabled
    </Link>
  );
};

export const CMSToolbar = () => {
  const { isAdmin, isEditMode, setIsEditMode, saveCmsData, cmsData } = useCMS();
  const [showBuilder, setShowBuilder] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center bg-brand-navy text-white rounded-full px-4 py-2 shadow-xl shadow-brand-navy/20 gap-4">
        <div className="flex items-center gap-2 pr-4 border-r border-white/20">
          <Settings size={18} className="text-brand-gold" />
          <span className="font-medium text-sm">Visual CMS</span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <div className={`w-10 h-5 rounded-full transition-colors relative ${isEditMode ? 'bg-brand-gold' : 'bg-gray-600'}`}>
            <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-transform ${isEditMode ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
          <input 
            type="checkbox" 
            checked={isEditMode} 
            onChange={(e) => setIsEditMode(e.target.checked)} 
            className="sr-only" 
          />
          <span className="text-sm">{isEditMode ? 'Edit Mode On' : 'Edit Mode Off'}</span>
        </label>
        {isEditMode && (
           <button 
             onClick={() => setShowBuilder(true)}
             className="ml-2 pl-4 border-l border-white/20 text-brand-gold hover:text-white flex items-center gap-2 text-sm"
           >
             <LayoutGrid size={16} /> Builder
           </button>
        )}
      </div>
      
      {showBuilder && <CMSBuilderPanel onClose={() => setShowBuilder(false)} />}
    </>
  );
};

const CMSBuilderPanel = ({ onClose }: { onClose: () => void }) => {
  const { cmsData, saveCmsData } = useCMS();
  
  // Quick simplified implementation of the section builder for MVP
  const handleTogglePageVisibility = (pageId: string) => {
    const newCms = { ...cmsData };
    const page = newCms.pages.find(p => p.id === pageId);
    if(page) page.isHidden = !page.isHidden;
    saveCmsData(newCms);
  }

  const handleToggleSection = (pageId: string, sectionId: string) => {
    const newCms = { ...cmsData };
    const page = newCms.pages.find(p => p.id === pageId);
    if (!page) return;
    const sec = page.sections.find(s => s.id === sectionId);
    if (sec) sec.isHidden = !sec.isHidden;
    saveCmsData(newCms);
  };
  
  const moveSection = (pageId: string, idx: number, dir: -1 | 1) => {
    const newCms = { ...cmsData };
    const page = newCms.pages.find(p => p.id === pageId);
    if (!page) return;
    if (idx + dir < 0 || idx + dir >= page.sections.length) return;
    const temp = page.sections[idx];
    page.sections[idx] = page.sections[idx + dir];
    page.sections[idx + dir] = temp;
    saveCmsData(newCms);
  }

  const addSection = (pageId: string) => {
    const type = prompt("Section Type (hero, text, gallery, schedule, travel, accommodation, explore):", "text");
    if (!type) return;
    const newCms = { ...cmsData };
    const page = newCms.pages.find(p => p.id === pageId);
    if (!page) return;
    page.sections.push({
      id: `sec-${Date.now()}`,
      type,
      isHidden: false,
      data: {}
    });
    saveCmsData(newCms);
  }

  const handleAddPage = () => {
    const name = prompt("Page Name:");
    const path = prompt("Page Path (e.g. 'gifts')");
    if (!name || !path) return;
    const newCms = { ...cmsData };
    newCms.pages.push({
      id: `p-${Date.now()}`,
      name,
      path,
      slug: path,
      isHidden: false,
      sections: []
    });
    saveCmsData(newCms);
  }

  const handleEditPage = (pageId: string) => {
    const page = cmsData.pages.find(p => p.id === pageId);
    if (!page) return;
    const name = prompt("Page Name:", page.name);
    if (!name) return;
    const newCms = { ...cmsData };
    const p = newCms.pages.find(p => p.id === pageId);
    if(p) p.name = name;
    saveCmsData(newCms);
  }

  const movePage = (idx: number, dir: -1 | 1) => {
    const newCms = { ...cmsData };
    if (idx + dir < 0 || idx + dir >= newCms.pages.length) return;
    const temp = newCms.pages[idx];
    newCms.pages[idx] = newCms.pages[idx + dir];
    newCms.pages[idx + dir] = temp;
    saveCmsData(newCms);
  }

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[150] overflow-y-auto border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
        <h3 className="font-serif text-xl text-brand-navy">Site Builder</h3>
        <button onClick={onClose} className="p-1 text-gray-500 hover:text-black">
          <X size={20} />
        </button>
      </div>
      <div className="p-4 space-y-6 flex-1">
        {cmsData.pages.map((page, pIdx) => (
           <div key={page.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
             <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center group/page">
               <span 
                 className="font-medium text-brand-navy cursor-pointer hover:underline"
                 onClick={() => handleEditPage(page.id)}
                 title="Click to rename"
               >
                 {page.name}
               </span>
               <div className="flex items-center gap-1 opacity-0 group-hover/page:opacity-100 transition-opacity">
                 <button onClick={() => movePage(pIdx, -1)} disabled={pIdx === 0} className="p-1 text-gray-400 hover:text-black disabled:opacity-30"><ArrowUp size={14} /></button>
                 <button onClick={() => movePage(pIdx, 1)} disabled={pIdx === cmsData.pages.length - 1} className="p-1 text-gray-400 hover:text-black disabled:opacity-30"><ArrowDown size={14} /></button>
                 <button onClick={() => handleTogglePageVisibility(page.id)} className="p-1 text-gray-400 hover:text-brand-primary">
                   {page.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                 </button>
               </div>
             </div>
             <div className="divide-y divide-gray-100 bg-white">
               {page.sections.map((sec, idx) => (
                 <div key={sec.id} className="p-3 flex items-center justify-between hover:bg-gray-50 group">
                   <div className="flex items-center gap-2">
                     <span className={`text-sm ${sec.isHidden ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                       {sec.type.toUpperCase()}
                     </span>
                   </div>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => moveSection(page.id, idx, -1)} disabled={idx === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowUp size={14} /></button>
                     <button onClick={() => moveSection(page.id, idx, 1)} disabled={idx === page.sections.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowDown size={14} /></button>
                     <button onClick={() => handleToggleSection(page.id, sec.id)} className="p-1 hover:bg-gray-200 rounded text-gray-600"><Eye size={14} /></button>
                   </div>
                 </div>
               ))}
               <div className="p-3">
                 <button 
                   onClick={() => addSection(page.id)}
                   className="w-full py-2 border border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-brand-gold hover:text-brand-gold flex items-center justify-center gap-2"
                 >
                   <Plus size={16} /> Add Section
                 </button>
               </div>
             </div>
           </div>
        ))}
        <button 
           onClick={handleAddPage}
           className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:border-brand-navy hover:text-brand-navy flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add New Page
        </button>
      </div>
    </div>
  )
}


export const EditableText = ({
  value,
  onChange,
  render,
  multiline = false
}: {
  value: string;
  onChange: (val: string) => void;
  render: (val: string) => React.ReactNode;
  multiline?: boolean;
}) => {
  const { isEditMode } = useCMS();
  const [isEditing, setIsEditing] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  if (!isEditMode) return <>{render(value)}</>;

  if (isEditing) {
    return (
      <div className="relative group/edit">
        {multiline ? (
          <textarea
            autoFocus
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            onBlur={() => { onChange(internalValue); setIsEditing(false); }}
            className="w-full bg-white/10 border-2 border-brand-gold text-inherit rounded p-2 focus:outline-none"
            rows={4}
          />
        ) : (
          <input
            autoFocus
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            onBlur={() => { onChange(internalValue); setIsEditing(false); }}
            className="w-full bg-white/10 border-2 border-brand-gold text-inherit rounded px-2 py-1 focus:outline-none min-w-[200px]"
          />
        )}
      </div>
    );
  }

  return (
    <div 
      className="relative group cursor-pointer hover:ring-2 hover:ring-brand-gold hover:ring-offset-4 rounded transition-all"
      onClick={() => setIsEditing(true)}
    >
      {render(value)}
      <div className="absolute -top-3 -right-3 bg-brand-gold text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
        <Type size={12} />
      </div>
    </div>
  );
};

export const EditableImage = ({
  value,
  onChange,
  className = "",
  style = {}
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { isEditMode } = useCMS();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data, error } = await supabase.storage.from('branding').upload(fileName, file);
      
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('branding').getPublicUrl(fileName);
      onChange(publicUrl);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isEditMode) {
    return <img src={value} className={className} style={{ objectFit: 'cover', ...style }} alt="CMS Image" />;
  }

  return (
    <div className={`relative group ${className}`} style={style}>
      <img src={value || 'https://images.unsplash.com/photo-1542042211-583ebbe2acdb?auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt="CMS Editable" />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        <div className="bg-white text-brand-navy px-4 py-2 rounded-lg font-medium flex items-center gap-2 pointer-events-auto cursor-pointer relative overflow-hidden">
          {isUploading ? (
            <span className="animate-pulse">Uploading...</span>
          ) : (
            <>
              <ImageIcon size={18} />
              Change Image
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
