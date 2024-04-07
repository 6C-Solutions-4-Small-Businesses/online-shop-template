import {API_BASE_ENDPOINT, BASE_HEADERS} from '$lib/frontend/Constants'
import {searchedProductResult} from '$lib/frontend/stores/productStore/SearchProductStore'

export async function fetchSearchedOffersResult(
    productName: string,
    page?: number
): Promise<void> {
    const response = await fetch(
        `${API_BASE_ENDPOINT}/offer?productName=${productName}&${page ? `page=${page}&` : ''}limit=18`,
        {
            method: 'GET',
            headers: BASE_HEADERS
        }
    )

    searchedProductResult.set(await response.json())
}
