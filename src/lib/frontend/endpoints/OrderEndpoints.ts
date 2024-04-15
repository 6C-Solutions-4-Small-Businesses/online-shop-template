import type {OrderDetailsPresentation} from '$lib/frontend/presentations/OrderDetailsPresentation'
import {API_BASE_ENDPOINT, BASE_HEADERS} from '$lib/frontend/Constants'
import {EndpointError} from '$lib/frontend/endpoints/EndpointError'

export async function getOrderDetails(id: string): Promise<OrderDetailsPresentation> {
    const response = await fetch(
        `${API_BASE_ENDPOINT}/order/${id}`,
        {
            method: 'GET',
            headers: BASE_HEADERS
        }
    )

    switch (response.status) {
        case 200:
            return await response.json()
        default:
            throw new EndpointError(await response.text())
    }
}

