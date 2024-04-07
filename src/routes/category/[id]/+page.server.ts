import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'
import {PRODUCT_DISPLAY_LIMIT} from '$lib/frontend/core/Helper'
import type {PageServerLoad, RouteParams} from './$types'
import {throwInternalServerError, throwInvalidRequestError} from '$lib/shared/ErrorsHandling'
import type {ServerLoadEvent} from '@sveltejs/kit'
import type {CategorySummaryPresentation} from '$lib/frontend/presentations/CategorySummaryPresentation'
import type {LayoutPageData} from '$routes/+layout.server'
import type {PaginationPresentation} from '$lib/frontend/core/PaginationPresentation'

export type CategoryPageData = {
    id: string,
    categories: CategorySummaryPresentation[],
    currentCategoryOffers: PaginationPresentation<OfferSummaryPresentation>,
}

export const prerender = false

export const load: PageServerLoad = async (event): Promise<CategoryPageData> => {

    const categories = await fetchAllCategoriesOrThrow(event)

    const currentCategoryOffers = await fetchCategoryOffersOrThrow(event)

    return {
        id: event.params.id,
        categories,
        currentCategoryOffers
    } satisfies CategoryPageData
}

async function fetchAllCategoriesOrThrow(event: ServerLoadEvent<RouteParams, LayoutPageData, '/category/[id]'>) {
    let response: Response
    try {
        response = await event.fetch('/api/v1/category/all', {method: 'GET'})
    } catch (e) {
        throwInternalServerError({message: 'COULD_NOT_FETCH_ALL_CATEGORIES'})
    }

    if (!response.ok) {
        throwInvalidRequestError({message: 'COULD_NOT_FETCH_ALL_CATEGORIES'})
    }

    return await response.json()
}

async function fetchCategoryOffersOrThrow(event: ServerLoadEvent<RouteParams, LayoutPageData, '/category/[id]'>) {
    let response: Response
    try {
        response = await event.fetch(`/api/v1/offer?&categoryId=${event.params.id}&limit=${PRODUCT_DISPLAY_LIMIT}`, {method: 'GET'})
    } catch (e) {
        throwInternalServerError({message: 'COULD_NOT_FETCH_CATEGORY_OFFERS'})
    }

    if (!response.ok) {
        throwInvalidRequestError({message: 'COULD_NOT_FETCH_CATEGORY_OFFERS'})
    }

    return await response.json()
}
