import {API_BASE_ENDPOINT, BASE_HEADERS} from '$lib/frontend/Constants'
import type {OffersManagementRequest} from '$lib/frontend/requests/OffersManagementRequest'
import type {OffersManagementResultPresentation} from '$lib/frontend/presentations/OffersManagementResultPresentation'

export async function sendOffersManagementRequests(request: OffersManagementRequest): Promise<OffersManagementResultPresentation | undefined> {
    const response = await fetch(`${API_BASE_ENDPOINT}/management/offers`, {
        method: 'POST',
        headers: BASE_HEADERS,
        body: JSON.stringify(request),
    })

    if (response.status === 201) {
        return await response.json()
    }
}
