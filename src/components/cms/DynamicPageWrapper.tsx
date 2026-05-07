import React from 'react';
import { useCMS } from '../../lib/CMSProvider';
import { SectionRenderer } from './SectionRenderer';
import Home from '../../pages/Home';

// This wrapper replaces the static pages to allow dynamic section composition.
// The Home page is treated specially because it already has some CMS logic,
// but for all other pages, we render their sections.
export const DynamicPageWrapper = ({ pageId }: { pageId: string }) => {
  const { cmsData, isEditMode } = useCMS();
  const page = cmsData.pages.find(p => p.id === pageId);

  if (!page) return <div className="p-20 text-center">Page not found</div>;

  // The 'Home' component has its own complex template rendering that we modified earlier.
  // We can still use it for the '/' path, OR we can just render the sections if we updated Home properly.
  // Actually, we modified Home to map over sections, but Home specifically renders `hero` via Templates.
  // For other pages or paths, we use SectionRenderer.
  
  if (page.path === '/') {
    return <Home />;
  }

  return (
    <div className="min-h-screen pb-12">
      {page.sections.filter(s => !s.isHidden || isEditMode).map(section => (
        <div key={section.id} className="relative group">
          <SectionRenderer section={section} pageId={page.id} />
          {isEditMode && section.isHidden && (
            <div className="absolute inset-0 bg-black/20 z-50 flex items-center justify-center pointer-events-none text-white font-bold backdrop-blur-[1px]">
              HIDDEN SECTION
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
