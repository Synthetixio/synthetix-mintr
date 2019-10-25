import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translations from 'synthetix-translations';

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: translations['synthetix-mintr'],
		fallbackLng: 'en',
		detection: {
			order: ['navigator'],
		},
		debug: true,
		react: {
			useSuspense: true,
			wait: true,
		},
	});

export default i18n;
