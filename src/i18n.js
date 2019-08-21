import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';
// import Backend from 'i18next-locize-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ['navigator'],
    },
    // debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: true,
      wait: true,
    },
    // backend: {
    //   projectId: '08a9281f-25bb-4476-b41a-7792c3b32b54',
    //   apiKey: 'bf557373-0f9d-4bed-9ac1-5427c3265cb7',
    //   referenceLng: 'en',
    // },
  });

export default i18n;
