import type {PageServerLoad} from './$types'
import type {CollectionPresentation} from '$lib/frontend/presentations/CollectionPresentation'

export const prerender = true

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
