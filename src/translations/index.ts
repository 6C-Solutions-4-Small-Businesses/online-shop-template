import {dev} from '$app/environment';
import type {Config} from 'sveltekit-i18n';
import i18n from 'sveltekit-i18n';
import lang from './lang.json';

export const initialLocale = 'fr'
export const config: Config = {
    log: {
        level: dev ? 'warn' : 'error'
    },
    translations: {
        en: {lang},
        fr: {lang}
    },
    loaders: [
        {
            locale: 'en',
            key: 'layout',
            loader: async () => (await import('./en/routes/layout.json')).default
        },
        {
            locale: 'en',
            key: 'lib/frontend/components/cookies-disclaimer',
            loader: async () => (await import('./en/lib/frontend/components/cookies-disclaimer.json')).default
        },
        {
            locale: 'fr',
            key: 'layout',
            loader: async () => (await import('./fr/routes/layout.json')).default
        },
        {
            locale: 'fr',
            key: 'lib/frontend/components/cookies-disclaimer',
            loader: async () => (await import('./fr/lib/frontend/components/cookies-disclaimer.json')).default
        },
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
