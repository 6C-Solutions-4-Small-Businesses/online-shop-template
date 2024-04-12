import adapter from '@sveltejs/adapter-vercel';
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';

/** @type {import("@sveltejs/kit").Config} */
const config = {
    extensions: ['.svelte'],
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [vitePreprocess()],
    vitePlugin: {
        inspector: true
    },
    kit: {
        adapter: adapter({
            images: {
                sizes: [160,640,],
                domains: [
                    //TODO(https://github.com/6C-Solutions-4-Small-Businesses/online-shop-template/issues/2)
                    '5jc9cdsla9yvcq5o.public.blob.vercel-storage.com',
                    //TODO(https://github.com/6C-Solutions-4-Small-Businesses/online-shop-template/issues/2)
                    'qqxrnh4alr9dw5wn.public.blob.vercel-storage.com',
                ],
                minimumCacheTTL: 60,
                formats: ["image/avif", "image/webp"],
            }
        }),
        alias: {
            $routes: 'src/routes',
            $tests: 'tests',
            $mocks: './tests/__mocks__',
            $scripts: 'scripts',
            $data: './example-data',
        },
        prerender: {
            handleHttpError: ({path, referrer, message}) => {
                console.log('handleHttpError', {path, referrer, message})

                throw new Error(message)
            }
        }
        // In local development only
        // csrf: {
        // 	checkOrigin: false
        // }
    }
};
export default config;
