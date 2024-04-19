import type {ModalSettings, ModalStore} from '@skeletonlabs/skeleton'
import {writable} from 'svelte/store'

export const currentModalStoreOnResponse = vi.fn()
export const currentModalStoreOnTrigger = vi.fn()
export const currentModalStoreOnClose = vi.fn()
export const currentModalStore = writable([{
    response: currentModalStoreOnResponse,
} as unknown as ModalSettings])

export const modalStore: ModalStore = {
    subscribe: currentModalStore.subscribe,
    set: currentModalStore.set,
    update: currentModalStore.update,
    trigger: currentModalStoreOnTrigger,
    close: currentModalStoreOnClose,
    clear() {
    },
}
