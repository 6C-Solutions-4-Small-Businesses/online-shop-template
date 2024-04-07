import {readable} from 'svelte/store'
import type {Navigation, Page} from '@sveltejs/kit'

type Stores = typeof import('$app/stores')

export const currentPageParams: Record<string, any> = { }
export const currentPageUrlProvider = vi.fn(() => new URL('http://localhost'))

export const getStores: Stores['getStores'] = () => {
    const navigating = readable<Navigation | null>(null)
    const page = readable<Page>({
        url: currentPageUrlProvider(),
        params: currentPageParams,
        form: undefined,
        route: {
            id: '',
        },
        state: {},
        status: 200,
        error: null,
        data: {}
    })
    const updated = {
        subscribe: readable(false).subscribe,
        check: () => Promise.resolve(false)
    }

    return {navigating, page, updated}
}

export const page: Stores['page'] = {
    subscribe(fn) {
        return getStores().page.subscribe((data) => {
            fn(data)
        })
    }
}

export const navigating: Stores['navigating'] = {
    subscribe(fn) {
        return getStores().navigating.subscribe(fn)
    }
}

export const updated: Stores['updated'] = {
    subscribe(fn) {
        return getStores().updated.subscribe(fn)
    },
    check: () => {
        return Promise.resolve(false)
    }
}

export default {
    getStores,
    navigating,
    page,
    updated
}
