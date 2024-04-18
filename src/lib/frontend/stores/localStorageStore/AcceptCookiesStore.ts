import {localStorageStore} from '@skeletonlabs/skeleton'
import type {Writable} from 'svelte/store'

export const wereCookiesAccepted: Writable<boolean | undefined> = localStorageStore<boolean | undefined>('cookiesAccepted', undefined, {
    storage: 'local',
})
