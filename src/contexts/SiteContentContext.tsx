import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSiteContent, SiteContent } from '../lib/db';

interface SiteContentContextType {
  content: SiteContent | null;
  settings: SiteContent | null;
  loading: boolean;
  refreshContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: null,
  settings: null,
  loading: true,
  refreshContent: async () => {},
});

export const SiteContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [settings, setSettings] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshContent = async () => {
    try {
      const [mainData, settingsData] = await Promise.all([
        getSiteContent('main'),
        getSiteContent('settings')
      ]);
      setContent(mainData || { id: 'main' });
      setSettings(settingsData || { id: 'settings' });
    } catch (error) {
      console.error("Failed to load site content", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshContent();
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, settings, loading, refreshContent }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(SiteContentContext);
