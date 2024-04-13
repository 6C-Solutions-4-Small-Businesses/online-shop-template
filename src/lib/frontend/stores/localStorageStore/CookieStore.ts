import { localStorageStore } from '@skeletonlabs/skeleton'
import type { Writable } from 'svelte/store'
import { get } from 'svelte/store'

export const cookieStore: Writable<boolean | undefined> = localStorageStore<boolean | undefined>('cookiesAccepted', undefined)

export const getCookieStore: boolean | undefined = get(cookieStore)