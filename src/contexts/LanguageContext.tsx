'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'ml';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.retreat': 'Retreat',
    'nav.experiences': 'Experiences',
    'nav.programme': 'Programme',
    'nav.rishikesh': 'Rishikesh',
    'nav.dailyMeditation': 'Daily Meditation',
    'nav.more': 'More',
    'nav.enquire': 'Enquire',
    'nav.beginJourney': 'Begin Your Journey',
    'nav.participation': 'Participation',
    'nav.testimonials': 'Testimonials',
    'nav.gallery': 'Gallery',
    'nav.reach': 'How to Reach',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'hero.title': 'Beyond the Mind',
    'hero.subtitle': 'The Divine Retreat • Rishikesh',
    'hero.tagline': 'A Transformative Journey into the Infinite Within',
    'hero.explore': 'Explore the Retreat',
    'hero.begin': 'Begin Your Journey',
    'badge.arrival': 'Arrival: October 5, 2027 • Sessions: October 6–9',
    'badge.food': 'Strict vegetarian food during retreat',
    'guide.name': 'Pradeep Muthukulam',
    'guide.title': 'Lead Spiritual Guide & Founder',
    'footer.rights': 'All sacred rights reserved.',
  },
  hi: {
    'nav.retreat': 'सत्र दर्शन',
    'nav.experiences': 'अनुभव',
    'nav.programme': 'कार्यक्रम',
    'nav.rishikesh': 'ऋषिकेश',
    'nav.dailyMeditation': 'दैनिक ध्यान',
    'nav.more': 'और देखें',
    'nav.enquire': 'पूछताछ',
    'nav.beginJourney': 'यात्रा आरंभ करें',
    'nav.participation': 'सहभागिता',
    'nav.testimonials': 'अनुभव कथाएँ',
    'nav.gallery': 'गैलरी',
    'nav.reach': 'कैसे पहुँचें',
    'nav.faq': 'प्रश्न-उत्तर',
    'nav.contact': 'संपर्क करें',
    'hero.title': 'बियॉन्ड द माइंड',
    'hero.subtitle': 'द डिवाइन रिट्रीट • ऋषिकेश',
    'hero.tagline': 'भीतर की अनंतता में एक रूपांतरणकारी यात्रा',
    'hero.explore': 'रिट्रीट का विवरण',
    'hero.begin': 'पंजीकरण करें',
    'badge.arrival': 'आगमन: 5 अक्टूबर, 2027 • सत्र: 6–9 अक्टूबर',
    'badge.food': 'रिट्रीट के दौरान पूर्णतः सात्विक शाकाहारी भोजन',
    'guide.name': 'प्रदीप मुथुकुलम',
    'guide.title': 'प्रधान आध्यात्मिक मार्गदर्शक एवं संस्थापक',
    'footer.rights': 'सर्वाधिकार सुरक्षित।',
  },
  ml: {
    'nav.retreat': 'ധ്യാനം',
    'nav.experiences': 'അനുഭവങ്ങൾ',
    'nav.programme': 'കാര്യപരിപാടികൾ',
    'nav.rishikesh': 'ഋഷികേശ്',
    'nav.dailyMeditation': 'പ്രതിദിന ധ്യാനം',
    'nav.more': 'കൂടുതൽ',
    'nav.enquire': 'അന്വേഷിക്കുക',
    'nav.beginJourney': 'യാത്ര ആരംഭിക്കുക',
    'nav.participation': 'പങ്കാളിത്തം',
    'nav.testimonials': 'അനുഭവസാക്ഷ്യങ്ങൾ',
    'nav.gallery': 'ചിത്രശാല',
    'nav.reach': 'എത്തിച്ചേരാൻ',
    'nav.faq': 'സംശയനിവാരണം',
    'nav.contact': 'ബന്ധപ്പെടുക',
    'hero.title': 'ബിയോണ്ട് ദി മൈൻഡ്',
    'hero.subtitle': 'ദ ഡിവൈൻ റിട്രീറ്റ് • ഋഷികേശ്',
    'hero.tagline': 'അന്തരംഗത്തിലെ അനന്തതയിലേക്കുള്ള പരിവർത്തന യാത്ര',
    'hero.explore': 'റിട്രീറ്റ് അറിയുക',
    'hero.begin': 'രജിസ്റ്റർ ചെയ്യുക',
    'badge.arrival': 'എത്തിച്ചേരൽ: ഒക്ടോബർ 5, 2027 • സെഷനുകൾ: ഒക്ടോബർ 6–9',
    'badge.food': 'റിട്രീറ്റ് സമയത്ത് പൂർണ്ണമായും സാത്വിക സസ്യാഹാരം മാത്രം',
    'guide.name': 'പ്രദീപ് മുതുകുളം',
    'guide.title': 'മുഖ്യ ആത്മീയ മാർഗ്ഗദർശി',
    'footer.rights': 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('btm_language') as Language | null;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'ml')) {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // Ignore localStorage read errors in private browsing
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('btm_language', lang);
      document.cookie = `btm_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = lang;
    } catch {
      // Ignore storage errors
    }
  };

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || translations.en[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
