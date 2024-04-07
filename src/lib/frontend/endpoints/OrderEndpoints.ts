import type {OrderDetailsPresentation} from '$lib/frontend/presentations/OrderDetailsPresentation'
import {toastError} from '$lib/frontend/core/ToasterUtils'
import {API_BASE_ENDPOINT, BASE_HEADERS} from '$lib/frontend/Constants'

export async function getOrderDetails(id: string): Promise<OrderDetailsPresentation | undefined> {
    const response = await fetch(
        `${API_BASE_ENDPOINT}/order/${id}`,
        {
            method: 'GET',
            headers: BASE_HEADERS,
        }
    )

    if (response.status === 200) {
        return await response.json()
    } else {
        toastError(await response.text())
    }
}

