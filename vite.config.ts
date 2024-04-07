import {sveltekit} from '@sveltejs/kit/vite'
import {resolve} from 'path'
import Icons from 'unplugin-icons/vite'
import {defineConfig} from 'vite'
import {purgeCss} from 'vite-plugin-tailwind-purgecss'

export default defineConfig({
    plugins: [
        sveltekit(),
        purgeCss(),
        Icons({
            compiler: 'svelte',
            autoInstall: true
        })
    ],
    test: {
        globals: true,
        dir: 'tests',
        include: ['**/component/**/*.spec.ts', '**/unit/**/*.spec.ts'],
        environment: 'jsdom',
        typecheck: {
            enabled: true
        },
        alias: [
            //With svelte 4.0, in test, onMount is not called
            //https://stackoverflow.com/questions/76577665/vitest-and-svelte-components-onmount
            {find: /^svelte$/, replacement: 'svelte/internal'},
            {find: '$lib', replacement: resolve(__dirname, './src/lib')},
            {find: '$routes', replacement: resolve(__dirname, './src/routes')},
            {find: '$tests', replacement: resolve(__dirname, './tests')},
            {find: '$mocks', replacement: resolve(__dirname, './tests/__mocks__')},
            {find: '$scripts', replacement: resolve(__dirname, './scripts')}
        ]
    },
    resolve: {
        alias: {
            '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js'
        }
    }
})
