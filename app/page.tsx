'use client';

import { useSettings } from '@/context/SettingsContext';
import { ClassicTemplate, ModernTemplate, LuxuryTemplate } from '@/components/home/Templates';

export default function Home() {
  const { settings } = useSettings();

  const template = settings?.homepage_template || 'classic';
  const names = "Neel & Ishika";
  const date = settings?.wedding_date || "August 24, 2024";
  const tagline = settings?.tagline || "A Celebration of Love";
  const bgUrl = settings?.homepage_bg_url || "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?q=80&w=2574&auto=format&fit=crop";

  const renderTemplate = () => {
    const logoUrl = settings?.logo_url;
    const logoSize = settings?.logo_size;
    switch (template) {
      case 'modern':
        return <ModernTemplate names={names} date={date} tagline={tagline} bgUrl={bgUrl} logoUrl={logoUrl} logoSize={logoSize} />;
      case 'luxury':
        return <LuxuryTemplate names={names} date={date} tagline={tagline} bgUrl={bgUrl} logoUrl={logoUrl} logoSize={logoSize} />;
      case 'classic':
      default:
        return <ClassicTemplate names={names} date={date} tagline={tagline} bgUrl={bgUrl} logoUrl={logoUrl} logoSize={logoSize} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderTemplate()}
    </div>
  );
}
