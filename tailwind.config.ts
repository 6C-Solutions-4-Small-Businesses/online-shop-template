import {skeleton} from '@skeletonlabs/tw-plugin'
import {join} from 'path'
import type {Config} from 'tailwindcss'
import aspect_ratio from '@tailwindcss/aspect-ratio'
import forms from '@tailwindcss/forms'
import {
    DOUBLE_XL_SCREEN_SIZE,
    LG_SCREEN_SIZE,
    MD_SCREEN_SIZE,
    SM_SCREEN_SIZE,
    TRIPLE_XL_SCREEN_SIZE,
    XL_SCREEN_SIZE,
} from "./config/ScreenSizeConfig";
import plugin from 'tailwindcss/plugin'

const themeColors = {
    'primary': '#0A3B2F',
    'secondary': '#70C247',
    'neutral': '#EEEDF0',
    'stone': '#1D1D1D',
    'amber-900': '#78350F',
    'amber-500': '#F59E0B',
    'neutral-400': '#999999',
    'neutral-100': '#F7F7F7',
    'orange-800': '#9A3412',
    'orange-700': '#C2410C',
    'error': '#FF0000',
    'gray': '#F2F2F2',
    'red': '#EF4444',
    'transparent': 'transparent',
    'promotion-low': '#a67b5b',
    'promotion-medium': '#fd7e14',
    'promotion-high': '#ff0000',
}

export default {
    darkMode: 'class',
    content: [
        './src/**/*.{html,js,svelte,ts}',
        join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
    ],
    theme: {
        screens: {
            xs: '0',
            sm: `${SM_SCREEN_SIZE}px`,
            md: `${MD_SCREEN_SIZE}px`,
            lg: `${LG_SCREEN_SIZE}px`,
            xl: `${XL_SCREEN_SIZE}px`,
            '2xl': `${DOUBLE_XL_SCREEN_SIZE}px`,
            '3xl': `${TRIPLE_XL_SCREEN_SIZE}px`,
        },
        extend: {
            aspectRatio: {
                1: '1',
            },
            colors: themeColors,
            fontSize: {
                8: '8px',
                10: '10px',
                15: '15px',
                16: '16px',
                28: '28px',
                32: '32px',
            },
            height: {
                22: '91px',
                30: '120px',
                42: '150px'
            },
            blur: {
                xs: '2px',
            },
            borderRadius: {
                10: '10px',
                '4xl': '30px'
            },
            margin: {
                13: '50px'
            },
            lineHeight: {
                12: '60px'
            }
        },
    },
    plugins: [
        skeleton({
            themes: {
                preset: [
                    {
                        name: 'skeleton',
                        enhancements: true,
                    },
                ],
            },
        }),
        forms,
        aspect_ratio,
        plugin(function ({addUtilities}) {
            const newUtilities = {
                '.text-primary': {
                    textAlign: 'center',
                    color: themeColors.primary,
                    fontWeight: 'bold',
                },
                '.text-secondary': {
                    textAlign: 'center',
                    color: themeColors.primary,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                },
                '.text-accent': {
                    color: themeColors.stone,
                    fontWeight: '400',
                    fontSize: '0.75rem',
                    lineHeight: 'normal'
                },
                '.odd': {
                    backgroundColor: 'white',
                }
            };

            const options = {
                respectPrefix: true,
                respectImportant: true,
            };

            addUtilities(newUtilities, options);
        }),
    ],
} satisfies Config
