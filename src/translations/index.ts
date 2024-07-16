import {dev} from '$app/environment';
import i18n, {type Config} from 'sveltekit-i18n';
import lang from './lang.json';

interface TranslationLoader {
    locale: string;
    key: string;
    loader: any;
}

export const initialLocale = 'fr';

const locales: string[] = ['en', 'fr'];
const components: string[] = ['cookies-disclaimer', 'collection', 'custom-app-bar', 'category-products'];
const pages: string[] = ['terms-and-conditions', 'cart', 'category'];

async function loadComponentsTranslation(locale: string, key: string): Promise<object> {
    return (await import(`./${locale}/lib/frontend/components/${key}.json`)).default;
}

async function loadPagesTranslation(locale: string, key: string): Promise<object> {
    return (await import(`./${locale}/routes/${key}/page.json`)).default;
}

const loaders: TranslationLoader[] = locales.flatMap((locale) => [
    {
        locale,
        key: 'layout',
        loader: async () => (await import(`./${locale}/routes/layout.json`)).default,
    },
    {
        locale,
        key: 'page',
        loader: async () => (await import(`./${locale}/routes/page.json`)).default,
    },
    ...pages.map((page): TranslationLoader => ({
        locale,
        key: page,
        loader: () => loadPagesTranslation(locale, page)
    })),
    ...components.map((component): TranslationLoader => ({
        locale,
        key: component,
        loader: () => loadComponentsTranslation(locale, component),
    })),
]);

export const config: Config = {
    log: {
        level: dev ? 'warn' : 'error',
    },
    translations: {
        en: {lang},
        fr: {lang},
    },
    loaders,
};

export const {
    t,
    loading,
    locales: loadedLocales,
    locale,
    translations,
    loadTranslations,
    addTranslations,
    setLocale,
    setRoute,
} = new i18n(config);

loading.subscribe(($loading) => $loading && console.log('Loading translations...'));
