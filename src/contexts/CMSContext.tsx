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

const LEGACY_STORAGE_KEYS = ['btm_cms_client_store_v1', 'btm_cms_client_store_v2', 'btm_cms_client_store_v3'];
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

  // Server data is the source of truth. When the server sends fresher props (after an admin save
  // revalidates the layout), adopt them instead of keeping the first render's values.
  useEffect(() => {
    if (initialSettings) setSettings(initialSettings);
  }, [initialSettings]);
  useEffect(() => {
    if (initialExperiencesList) setExperiences(initialExperiencesList);
  }, [initialExperiencesList]);
  useEffect(() => {
    if (initialAttractionsList) setAttractions(initialAttractionsList);
  }, [initialAttractionsList]);
  useEffect(() => {
    if (initialGalleryList) setGallery(initialGalleryList);
  }, [initialGalleryList]);

  // Older builds cached CMS content in localStorage and replayed it over server data. Clear it.
  useEffect(() => {
    try {
      for (const key of LEGACY_STORAGE_KEYS) localStorage.removeItem(key);
    } catch {}
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

    return () => {
      channel?.close();
    };
  }, []);

  // Handler to update data locally & broadcast to all tabs
  const updateCMSData = useCallback((type: string, data: unknown) => {
    try {
      if (type === 'settings' && data) {
        setSettings((prev) => {
          return { ...prev, ...(data as Partial<SiteSettings>) };
        });
        setLiveUpdated((prev) => ({ ...prev, settings: true }));
      } else if (type === 'experiences' && Array.isArray(data)) {
        setExperiences(data as SacredExperience[]);
        setLiveUpdated((prev) => ({ ...prev, experiences: true }));
      } else if (type === 'attractions' && Array.isArray(data)) {
        setAttractions(data as RishikeshAttraction[]);
        setLiveUpdated((prev) => ({ ...prev, attractions: true }));
      } else if (type === 'gallery' && Array.isArray(data)) {
        setGallery(data as GalleryItem[]);
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

// Lets other open tabs of this browser show an admin save instantly (in memory only, nothing persisted).
export function broadcastCMSUpdate(type: string, data: unknown) {
  if (typeof window === 'undefined') return;
  try {
    const bc = new BroadcastChannel(CHANNEL_NAME);
    bc.postMessage({ type, data });
    bc.close();
  } catch (err) {
    console.warn('broadcastCMSUpdate error:', err);
  }
}
