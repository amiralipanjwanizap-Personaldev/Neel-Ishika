import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';
import { CMSData, defaultCMSData } from './cmsUtils';
import { useAuth } from './AuthProvider';

interface CMSContextType {
  cmsData: CMSData;
  setCmsData: (data: CMSData) => void;
  saveCmsData: (data: CMSData) => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
  isEditMode: boolean;
  setIsEditMode: (v: boolean) => void;
}

const CMSContext = createContext<CMSContextType | null>(null);

export const CMSProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin } = useAuth();
  const [cmsData, setCmsData] = useState<CMSData>(defaultCMSData);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // If user loses admin privileges, disable edit mode
    if (!isAdmin) {
      setIsEditMode(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('content')
          .eq('slug', 'cms-config')
          .maybeSingle();

        if (error) throw error;
        
        if (data && data.content) {
          try {
            const parsed = JSON.parse(data.content);
            if (parsed && typeof parsed === 'object' && parsed.pages) {
              setCmsData(parsed as CMSData);
            }
          } catch (e) {
            console.error('Invalid CMS config JSON', e);
          }
        } else {
          // ensure rows exists
          await supabase.from('pages').upsert({
            title: 'CMS Config',
            slug: 'cms-config',
            content: JSON.stringify(defaultCMSData)
          });
        }
      } catch (err) {
        console.error('Error fetching CMS config', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCMS();
  }, []);

  const saveCmsData = async (newData: CMSData) => {
    if (!isAdmin) {
      console.error('Unauthorized: CMS saving disabled for non-admins');
      return;
    }
    try {
      setCmsData(newData);
      await supabase.from('pages').upsert({
        title: 'CMS Config',
        slug: 'cms-config',
        content: JSON.stringify(newData)
      });
    } catch (e) {
      console.error('Error saving CMS:', e);
      throw e;
    }
  };

  return (
    <CMSContext.Provider value={{ cmsData, setCmsData, saveCmsData, isLoading, isAdmin, isEditMode, setIsEditMode }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error('useCMS must be used within CMSProvider');
  return ctx;
};
