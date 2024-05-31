import {skeleton} from '@skeletonlabs/tw-plugin'
import {join} from 'path'
import type {Config} from 'tailwindcss'
import forms from '@tailwindcss/forms'
import {
    DOUBLE_XL_SCREEN_SIZE,
    LG_SCREEN_SIZE,
    MD_SCREEN_SIZE,
    SM_SCREEN_SIZE,
    TRIPLE_XL_SCREEN_SIZE,
    XL_SCREEN_SIZE
} from "./config/ScreenSizeConfig";

export default {
    darkMode: 'class',
    content: [
        './src/**/*.{html,js,svelte,ts}',
        join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
    ],
    theme: {
        screens: {
            sm: `${SM_SCREEN_SIZE}px`,
            md: `${MD_SCREEN_SIZE}px`,
            lg: `${LG_SCREEN_SIZE}px`,
            xl: `${XL_SCREEN_SIZE}px`,
            '2xl': `${DOUBLE_XL_SCREEN_SIZE}px`,
            '3xl': `${TRIPLE_XL_SCREEN_SIZE}px`
        },
        extend: {
            aspectRatio: {
                1: '1',
            },
            colors: {
                'teal-950': '#0A3B2F',
                'teal-900': '#114E3F',
                'teal-800': '#1E6C59',
                'stone-900': '#1D1D1D',
                'stone-500': '#F8F8F8',
                'amber-900': '#78350F',
                'amber-500': '#F59E0B',
                'neutral-400': '#999999',
                'neutral-100': '#F7F7F7',
                'orange-800': '#9A3412',
                'orange-700': '#C2410C',
                'zinc-500': '#EEEDF0',
                'zinc-300': '#D9D9D9',
                'zinc-100': '#EEEEEE',
                gray: '#F2F2F2',
                red: '#EF4444',
                'red-600': '#FF0000',
                transparent: 'transparent',
            },
            fontSize: {
                8: '8px',
                10: '10px',
                15: '15px',
            },
            blur: {
                xs: '2px',
            }
        }
    },
    plugins: [
        skeleton({
            themes: {
                preset: [
                    {
                        name: 'skeleton',
                        enhancements: true
                    }
                ]
            }
        }),
        forms,
    ]
} satisfies Config
