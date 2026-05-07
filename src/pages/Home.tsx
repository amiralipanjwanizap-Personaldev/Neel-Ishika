import { useOutletContext } from 'react-router-dom';
import { ClassicTemplate, ModernTemplate, LuxuryTemplate } from '../components/home/Templates';
import { useCMS } from '../lib/CMSProvider';
import { EditableText } from '../components/cms/CMSComponents';

export default function Home() {
  const { settings } = useOutletContext<{ settings: any | null }>();
  const { cmsData, isEditMode, saveCmsData } = useCMS();

  // Find the home page from CMS
  const homePage = cmsData.pages.find(p => p.path === '/');
  
  if (homePage && homePage.sections && homePage.sections.length > 0) {
    // Dynamic JSON rendering
    return (
      <div className="min-h-screen">
        {homePage.sections.filter(s => !s.isHidden || isEditMode).map(section => {
          if (section.type === 'hero') {
            const template = settings?.homepage_template || 'classic';
            const props = {
              names: section.data.names || "Neel & Ishika",
              date: section.data.date || settings?.wedding_date || "August 24, 2024",
              tagline: section.data.tagline || settings?.tagline || "A Celebration of Love",
              bgUrl: section.data.bgUrl || settings?.homepage_bg_url || "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?q=80&w=2574&auto=format&fit=crop",
              logoUrl: section.data.logoUrl || settings?.logo_url,
              logoSize: settings?.logo_size,
              sectionId: section.id,
              pageId: homePage.id,
              data: section.data
            };
            
            switch (template) {
              case 'modern': return <ModernTemplate key={section.id} {...props} />;
              case 'luxury': return <LuxuryTemplate key={section.id} {...props} />;
               case 'classic': default: return <ClassicTemplate key={section.id} {...props} />;
            }
          }
          
          if (section.type === 'text') {
            return (
              <div key={section.id} className="py-24 px-4 max-w-4xl mx-auto text-center">
                <EditableText 
                  value={section.data.title || "Section Title"} 
                  onChange={(v) => {
                    const newCms = { ...cmsData };
                    const page = newCms.pages.find(p => p.id === homePage.id);
                    if (page) {
                       const s = page.sections.find(s => s.id === section.id);
                       if (s) s.data.title = v;
                    }
                    saveCmsData(newCms);
                  }}
                  render={(v) => <h2 className="text-4xl md:text-5xl font-serif text-brand-primary mb-6">{v}</h2>}
                />
                <div className="w-24 h-1 bg-brand-gold mx-auto mb-8" />
                <EditableText 
                  value={section.data.content || "Write your content here..."} 
                  onChange={(v) => {
                    const newCms = { ...cmsData };
                    const page = newCms.pages.find(p => p.id === homePage.id);
                    if (page) {
                       const s = page.sections.find(s => s.id === section.id);
                       if (s) s.data.content = v;
                    }
                    saveCmsData(newCms);
                  }}
                  multiline
                  render={(v) => <p className="text-lg text-gray-700 leading-relaxed disabled:opacity-50 whitespace-pre-wrap">{v}</p>}
                />
              </div>
            );
          }

          // other sections...
          return null;
        })}
      </div>
    );
  }

  // Fallback
  return null;
}
