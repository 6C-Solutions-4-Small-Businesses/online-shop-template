import { dev } from '$app/environment';
import type { Config } from 'sveltekit-i18n';
import i18n from 'sveltekit-i18n';
import lang from './lang.json';

export const config: Config = {
	log: {
		level: dev ? 'warn' : 'error'
	},
	translations: {
		en: { lang },
		fr: { lang }
	},
	loaders: [
		{
			locale: 'en',
			key: 'home',
			loader: async () => (await import('./en/home.json')).default
		},
		{
			locale: 'fr',
			key: 'home',
			loader: async () => (await import('./fr/home.json')).default
		}
	]
};

export const {
	t,
	loading,
	locales,
	locale,
	translations,
	loadTranslations,
	addTranslations,
	setLocale,
	setRoute
} = new i18n(config);

loading.subscribe(($loading) => $loading && console.log('Loading translations...'));
