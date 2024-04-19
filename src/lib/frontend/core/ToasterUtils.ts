import type {ToastSettings} from '@skeletonlabs/skeleton'

export function getErrorToastSettings(message: string): ToastSettings {
    return {
        message,
        background: 'variant-filled-error'
    } satisfies ToastSettings
}

export function getSuccessToastSettings(message: string): ToastSettings {
    return {
        message,
        background: 'variant-filled-success',
    } satisfies ToastSettings
}
