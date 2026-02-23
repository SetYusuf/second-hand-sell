'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type Language = 'eng' | 'cam';

interface LanguageContextType {
  currentLang: Language;
  switchLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  eng: {
    'post_computer': 'Post Computer',
    'photo': 'Photo',
    'add_photo': 'Add Photo',
    'computer_details': 'Computer Details',
    'title_placeholder': 'Title (e.g. MacBook Pro M1 2020)',
    'type': 'Type',
    'laptop': 'Laptop',
    'desktop': 'Desktop',
    'monitor': 'Monitor',
    'accessories': 'Accessories',
    'parts': 'Parts',
    'brand_placeholder': 'Brand (e.g. Apple, Dell, Asus)',
    'specs_placeholder': 'Specs (RAM, Storage, Processor)',
    'condition_placeholder': 'Condition (e.g. New, Used, Like New)',
    'price': 'Price',
    'description_placeholder': 'Description (Defects, Warranty, etc.)',
    'location': 'Location',
    'contact_details': 'Contact Detail',
    'name_placeholder': 'Your Name',
    'phone_placeholder': 'Phone number',
    'email_placeholder': 'Email',
    'post_computer_btn': 'Post Computer'
  },
  cam: {
    'post_computer': 'បង្កិចកុម្មនុកុម្មនុកុម្មន',
    'photo': 'រូបិច',
    'add_photo': 'បន្ថែរូបិច',
    'computer_details': 'ព័ត៌តាកុម្មនុកុម្មនុកុម្មន',
    'title_placeholder': 'ចំណងជើង (ឧ. MacBook Pro M1 2020)',
    'type': 'ប្រភេទ',
    'laptop': 'កុម្មនុពិកុម្មន',
    'desktop': 'កុម្មនុធំ',
    'monitor': 'អេក្រង',
    'accessories': 'គ្រឿងបរិក',
    'parts': 'គ្រឿងបរិក',
    'brand_placeholder': 'ម៉ាក (ឧ. Apple, Dell, Asus)',
    'specs_placeholder': 'លក្ខណូល (RAM, Storage, Processor)',
    'condition_placeholder': 'ស្ថានភាព (ឧ. New, Used, Like New)',
    'price': 'តំលៃ',
    'description_placeholder': 'ពិព្ណនា (Defects, Warranty, etc.)',
    'location': 'ទីតាំង',
    'contact_details': 'ព័ត៌តាទំនាទំន',
    'name_placeholder': 'ឈ្មោះអ្នក',
    'phone_placeholder': 'លេខទន្ថុក',
    'email_placeholder': 'អ៊ីមែល',
    'post_computer_btn': 'បង្កិចកុម្មនុកុម្មនុកុម្មន'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLang, setCurrentLang] = useState<Language>('eng');

  // Initialize language from localStorage
  useEffect(() => {
    try {
      const storedLang = window.localStorage.getItem('language') as Language | null;
      if (storedLang === 'eng' || storedLang === 'cam') {
        setCurrentLang(storedLang);
        return;
      }
    } catch {
      // Ignore access errors (e.g. private mode)
    }
    setCurrentLang('eng');
  }, []);

  // Persist language to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem('language', currentLang);
    } catch {
      // Ignore storage failures
    }
  }, [currentLang]);

  const switchLanguage = (lang: Language) => {
    setCurrentLang(lang);
  };

  const t = (key: string): string => {
    return translations[currentLang][key as keyof typeof translations.eng] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
