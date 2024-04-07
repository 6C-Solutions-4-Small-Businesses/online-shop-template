import {skeleton} from '@skeletonlabs/tw-plugin'
import {join} from 'path'
import type {Config} from 'tailwindcss'
import {
    DOUBLE_XL_SCREEN_SIZE,
    LG_SCREEN_SIZE,
    MD_SCREEN_SIZE,
    SM_SCREEN_SIZE,
    TRIPLE_XL_SCREEN_SIZE,
    XL_SCREEN_SIZE
} from './config/ScreenSizeConfig'
import forms from '@tailwindcss/forms'

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
