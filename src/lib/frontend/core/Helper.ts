import {toastGenericError} from '$lib/frontend/core/ToasterUtils'
import type {Writable} from 'svelte/store'

export type AsyncFunction<T> = () => Promise<T>

export const PRODUCT_DISPLAY_LIMIT = 18

export async function executeAction(
    isLoading: Writable<boolean>,
    actionCallback: (arg1: string, arg2?: number) => Promise<void>,
    arg1: string,
    arg2?: number
): Promise<void> {
    isLoading.set(true)
    try {
        await actionCallback(arg1, arg2)
    } catch {
        toastGenericError()
    }
    isLoading.set(false)
}

export async function executeFunction<T>(
    isLoading: Writable<boolean>,
    aFunction: AsyncFunction<T>,
): Promise<T | undefined> {

    isLoading.set(true)
    try {
        return await aFunction()
    } catch (e) {
        toastGenericError()
    } finally {
        isLoading.set(false)
    }
}

export function isEmailInvalid(email: string): boolean {
    return !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
}

export function getAbbreviatedUnit(unit: string | null): string {
    switch (unit) {
        case 'Centiliter':
            return 'cl'
        case 'Gramme':
            return 'g'
        case 'Kilogram':
            return 'kg'
        case 'Liter':
            return 'l'
        case 'Milliliter':
            return 'ml'
        case 'Once':
            return 'oz'
        case 'Pound':
            return 'lb'
        case 'Portion':
            return 'portion'
        case 'Unit':
        default:
            return ''
    }
}
