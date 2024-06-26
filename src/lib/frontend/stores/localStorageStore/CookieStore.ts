import type { Writable } from 'svelte/store';
import { localStorageStore } from '@skeletonlabs/skeleton'

export const cookieStore: Writable<boolean> = localStorageStore<boolean>('cookiesAccepted', false)