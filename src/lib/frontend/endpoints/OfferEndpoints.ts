import {API_BASE_ENDPOINT, BASE_HEADERS} from '$lib/frontend/Constants'
import type {PaginationPresentation} from '$lib/frontend/core/PaginationPresentation'
import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'

export async function fetchSearchedOffersResult(
    productName: string,
    page?: number,
): Promise<PaginationPresentation<OfferSummaryPresentation> | undefined> {
    const response = await fetch(
        `${API_BASE_ENDPOINT}/offer?productName=${productName}&${page ? `page=${page}&` : ''}limit=18`,
        {
            method: 'GET',
            headers: BASE_HEADERS,
        },
    )

    if (response.status === 200)
        return await response.json()
}

export async function fetchCategoryProducts(
    categoryId: string, page?: number,
): Promise<PaginationPresentation<OfferSummaryPresentation> | undefined> {
    const response = await fetch(`${API_BASE_ENDPOINT}/offer?categoryId=${categoryId}&${page ? `page=${page}&` : ''}limit=18`, {
        method: 'GET',
        headers: {...BASE_HEADERS},
    })

    if (response.status === 200)
        return await response.json()
}
