'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SiteSettings,
  SacredExperience,
  RishikeshAttraction,
  GalleryItem,
  CustomContactLink,
} from '@/types';
import {
  initialSiteSettings,
  initialExperiences,
  initialAttractions,
} from '@/lib/data/initialData';

interface CMSContextType {
  settings: SiteSettings;
  experiences: SacredExperience[];
  attractions: RishikeshAttraction[];
  gallery: GalleryItem[];
  customContacts: CustomContactLink[];
  liveUpdated: Record<string, boolean>;
  updateCMSData: (type: string, data: unknown) => void;
}

const CMSContext = createContext<CMSContextType>({
  settings: initialSiteSettings,
  experiences: initialExperiences,
  attractions: initialAttractions,
  gallery: [],
  customContacts: [],
  liveUpdated: {},
  updateCMSData: () => {},
});

const STORAGE_KEY = 'btm_cms_client_store_v3';
const CHANNEL_NAME = 'btm_cms_sync_channel';

export function CMSProvider({
  children,
  initialSettings,
  initialExperiencesList,
  initialAttractionsList,
  initialGalleryList,
}: {
  children: React.ReactNode;
  initialSettings?: SiteSettings;
  initialExperiencesList?: SacredExperience[];
  initialAttractionsList?: RishikeshAttraction[];
  initialGalleryList?: GalleryItem[];
}) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings || initialSiteSettings);
  const [experiences, setExperiences] = useState<SacredExperience[]>(
    initialExperiencesList || initialExperiences
  );
  const [attractions, setAttractions] = useState<RishikeshAttraction[]>(
    initialAttractionsList || initialAttractions
  );
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGalleryList || []);
  const [liveUpdated, setLiveUpdated] = useState<Record<string, boolean>>({});

  // Purge any stale legacy localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('btm_cms_client_store_v1');
        localStorage.removeItem('btm_cms_client_store_v2');
      }
    } catch {}
  }, []);

  // Hydrate from localStorage on client mount ONLY when an active admin editing session exists
  // For standard site visitors, authoritative server/build-time data must never be overwritten
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;

      const isAdminSession = !!(
        localStorage.getItem('btm_admin_session') ||
        sessionStorage.getItem('btm_admin_session') ||
        window.location.pathname.startsWith('/admin')
      );

      // Public visitors always receive the fresh SSR/build data directly
      if (!isAdminSession) return;

      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.settings) {
          setSettings((prev) => ({ ...prev, ...parsed.settings }));
          setLiveUpdated((prev) => ({ ...prev, settings: true }));
        }
        if (parsed.experiences && Array.isArray(parsed.experiences)) {
          setExperiences(parsed.experiences);
          setLiveUpdated((prev) => ({ ...prev, experiences: true }));
        }
        if (parsed.attractions && Array.isArray(parsed.attractions)) {
          setAttractions(parsed.attractions);
          setLiveUpdated((prev) => ({ ...prev, attractions: true }));
        }
        if (parsed.gallery && Array.isArray(parsed.gallery)) {
          setGallery(parsed.gallery);
          setLiveUpdated((prev) => ({ ...prev, gallery: true }));
        }
      }
    } catch (e) {
      console.warn('CMS localStorage hydration error:', e);
    }
  }, []);

  // Listen for real-time BroadcastChannel updates across all tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event) => {
        const { type, data } = event.data || {};
        if (type === 'settings' && data) {
          setSettings((prev) => ({ ...prev, ...data }));
          setLiveUpdated((prev) => ({ ...prev, settings: true }));
        } else if (type === 'experiences' && Array.isArray(data)) {
          setExperiences(data);
          setLiveUpdated((prev) => ({ ...prev, experiences: true }));
        } else if (type === 'attractions' && Array.isArray(data)) {
          setAttractions(data);
          setLiveUpdated((prev) => ({ ...prev, attractions: true }));
        } else if (type === 'gallery' && Array.isArray(data)) {
          setGallery(data);
          setLiveUpdated((prev) => ({ ...prev, gallery: true }));
        }
      };
    } catch {
      // BroadcastChannel not supported in older browser
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.settings) {
            setSettings((prev) => ({ ...prev, ...parsed.settings }));
            setLiveUpdated((prev) => ({ ...prev, settings: true }));
          }
          if (parsed.experiences) {
            setExperiences(parsed.experiences);
            setLiveUpdated((prev) => ({ ...prev, experiences: true }));
          }
          if (parsed.attractions) {
            setAttractions(parsed.attractions);
            setLiveUpdated((prev) => ({ ...prev, attractions: true }));
          }
          if (parsed.gallery) {
            setGallery(parsed.gallery);
            setLiveUpdated((prev) => ({ ...prev, gallery: true }));
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', onStorage);

    return () => {
      channel?.close();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Handler to update data locally & broadcast to all tabs
  const updateCMSData = useCallback((type: string, data: unknown) => {
    try {
      if (type === 'settings' && data) {
        setSettings((prev) => {
          const updated = { ...prev, ...(data as Partial<SiteSettings>) };
          saveToStorage({ settings: updated });
          return updated;
        });
        setLiveUpdated((prev) => ({ ...prev, settings: true }));
      } else if (type === 'experiences' && Array.isArray(data)) {
        setExperiences(data as SacredExperience[]);
        saveToStorage({ experiences: data });
        setLiveUpdated((prev) => ({ ...prev, experiences: true }));
      } else if (type === 'attractions' && Array.isArray(data)) {
        setAttractions(data as RishikeshAttraction[]);
        saveToStorage({ attractions: data });
        setLiveUpdated((prev) => ({ ...prev, attractions: true }));
      } else if (type === 'gallery' && Array.isArray(data)) {
        setGallery(data as GalleryItem[]);
        saveToStorage({ gallery: data });
        setLiveUpdated((prev) => ({ ...prev, gallery: true }));
      }

      // Broadcast to other open tabs
      try {
        const bc = new BroadcastChannel(CHANNEL_NAME);
        bc.postMessage({ type, data });
        bc.close();
      } catch {
        // ignore
      }
    } catch (err) {
      console.warn('updateCMSData error:', err);
    }
  }, []);

  const saveToStorage = (partial: Record<string, unknown>) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const current = raw ? JSON.parse(raw) : {};
      const updated = { ...current, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('saveToStorage error:', e);
    }
  };

  const customContacts = settings.custom_contacts || [];

  return (
    <CMSContext.Provider
      value={{
        settings,
        experiences,
        attractions,
        gallery,
        customContacts,
        liveUpdated,
        updateCMSData,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  return useContext(CMSContext);
}

// Helper to broadcast from Admin or external components
export function broadcastCMSUpdate(type: string, data: unknown) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const current = raw ? JSON.parse(raw) : {};
    current[type] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

    const bc = new BroadcastChannel(CHANNEL_NAME);
    bc.postMessage({ type, data });
    bc.close();
  } catch (err) {
    console.warn('broadcastCMSUpdate error:', err);
  }
}
