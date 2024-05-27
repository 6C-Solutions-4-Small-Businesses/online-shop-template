import type {PageServerLoad} from './$types'
import type {CollectionPresentation} from '$lib/frontend/presentations/CollectionPresentation'
import {FORCE_INCREMENTAL_STATIC_REGENERATION_TOKEN} from '$env/static/private'

export const config = {
    isr: {
        expiration: false,
        bypassToken: FORCE_INCREMENTAL_STATIC_REGENERATION_TOKEN,
    },
}

export const load: PageServerLoad = async (event): Promise<{ collections: CollectionPresentation[] }> => {
    let response: Response
    try {
        response = await event.fetch('/api/v1', {method: 'GET'})
    } catch (e) {
        return {collections: []}
    }

    if (!response.ok) {
        return {collections: []}
    }

    const collections = await response.json()
    return {collections}
}
