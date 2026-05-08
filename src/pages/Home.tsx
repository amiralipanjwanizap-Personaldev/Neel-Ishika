import { useOutletContext } from 'react-router-dom';
import { ClassicTemplate, ModernTemplate, LuxuryTemplate, CinematicTemplate, EditorialTemplate, GlassTemplate, RomanticTemplate, MonogramTemplate } from '../components/home/Templates';

export const dynamic = "force-dynamic";

interface Settings {
  logo_url?: string;
  music_url?: string;
  music_enabled?: boolean;
  tagline?: string;
  wedding_date?: string;
  homepage_template?: string;
  homepage_bg_url?: string;
  font_family?: string;
  logo_size?: string;
}

export default function Home() {
  const { settings } = useOutletContext<{ settings: Settings | null }>();

  const template = settings?.homepage_template || 'classic';
  const names = "Neel & Ishika"; // In a real CMS, this could also be in settings
  const date = settings?.wedding_date || "August 24, 2024";
  const tagline = settings?.tagline || "A Celebration of Love";
  const bgUrl = settings?.homepage_bg_url || "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?q=80&w=2574&auto=format&fit=crop";

  const renderTemplate = () => {
    const logoUrl = settings?.logo_url;
    const logoSize = settings?.logo_size;
    const props = { names, date, tagline, bgUrl, logoUrl, logoSize };
    switch (template) {
      case 'modern':
        return <ModernTemplate {...props} />;
      case 'luxury':
        return <LuxuryTemplate {...props} />;
      case 'cinematic':
        return <CinematicTemplate {...props} />;
      case 'editorial':
        return <EditorialTemplate {...props} />;
      case 'glass':
        return <GlassTemplate {...props} />;
      case 'romantic':
        return <RomanticTemplate {...props} />;
      case 'monogram':
        return <MonogramTemplate {...props} />;
      case 'classic':
      default:
        return <ClassicTemplate {...props} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderTemplate()}
    </div>
  );
}
