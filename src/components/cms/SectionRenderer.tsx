import React from 'react';
import Home from '../../pages/Home';
import Schedule from '../../pages/Schedule';
import Travel from '../../pages/Travel';
import Explore from '../../pages/Explore';
import Accommodation from '../../pages/Accommodation';
import SpecialRequirements from '../../pages/SpecialRequirements';
import Gallery from '../../pages/Gallery';
import Story from '../../pages/Story';
import PhotoChallenge from '../../pages/PhotoChallenge';
import MessageWall from '../../pages/MessageWall';
import { EditableText } from './CMSComponents';
import { useCMS } from '../../lib/CMSProvider';

export const SectionRenderer = ({ section, pageId }: { section: any, pageId: string }) => {
  const { cmsData, saveCmsData, isEditMode } = useCMS();

  // Reusable inline text edit
  const handleChange = (field: string) => (val: string) => {
    const newCms = { ...cmsData };
    const p = newCms.pages.find(p => p.id === pageId);
    if (!p) return;
    const s = p.sections.find(s => s.id === section.id);
    if (!s) return;
    s.data[field] = val;
    saveCmsData(newCms);
  }

  switch (section.type) {
    case 'hero':
      return (
        <div className="py-20 text-center bg-brand-navy text-white relative h-screen flex flex-col justify-center">
           {section.data.bgUrl && (
             <div className="absolute inset-0 opacity-40">
               <img src={section.data.bgUrl} className="w-full h-full object-cover" alt="Hero background" />
             </div>
           )}
           <div className="relative z-10">
             <EditableText value={section.data.title || "Hero Title"} onChange={handleChange('title')} render={v => <h1 className="text-5xl font-serif">{v}</h1>} />
             <EditableText value={section.data.subtitle || "Your subtitle here"} onChange={handleChange('subtitle')} render={v => <p className="text-xl mt-4 max-w-2xl mx-auto">{v}</p>} />
           </div>
        </div>
      );
    case 'text':
      return (
        <div className="py-24 px-4 max-w-4xl mx-auto text-center">
          <EditableText 
            value={section.data.title || "Section Title"} 
            onChange={handleChange('title')}
            render={(v) => <h2 className="text-4xl md:text-5xl font-serif text-brand-primary mb-6">{v}</h2>}
          />
          <div className="w-24 h-1 bg-brand-gold mx-auto mb-8" />
          <EditableText 
            value={section.data.content || "Write your content here..."} 
            onChange={handleChange('content')}
            multiline
            render={(v) => <p className="text-lg text-gray-700 leading-relaxed disabled:opacity-50 whitespace-pre-wrap">{v}</p>}
          />
        </div>
      );
    case 'gallery':
      return (
        <div className="py-24 px-4 max-w-6xl mx-auto">
          <EditableText 
            value={section.data.title || "Gallery"} 
            onChange={handleChange('title')}
            render={(v) => <h2 className="text-4xl md:text-5xl font-serif text-brand-primary mb-12 text-center">{v}</h2>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
             {/* Stub for gallery */}
             <div className="aspect-square bg-gray-200 rounded"></div>
             <div className="aspect-square bg-gray-200 rounded"></div>
             <div className="aspect-square bg-gray-200 rounded"></div>
             {isEditMode && (
               <div className="aspect-square bg-brand-gold/10 rounded flex items-center justify-center border-2 border-dashed border-brand-gold cursor-pointer text-brand-gold font-medium">
                 + Add Image
               </div>
             )}
          </div>
        </div>
      );
    // Standard pages wrapped as sections
    case 'schedule': return <Schedule />;
    case 'travel': return <Travel />;
    case 'explore': return <Explore />;
    case 'accommodation': return <Accommodation />;
    case 'special_req': return <SpecialRequirements />;
    case 'gallery': return <Gallery />;
    case 'story': return <Story />;
    case 'photo_challenge': return <PhotoChallenge />;
    case 'message_wall': return <MessageWall />;
    default:
      return <div className="p-8 text-center text-gray-400">Unknown Section Type: {section.type}</div>;
  }
}
