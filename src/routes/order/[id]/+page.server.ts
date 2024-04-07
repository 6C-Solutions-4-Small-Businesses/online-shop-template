import {throwInternalServerError, throwInvalidRequestError} from '$lib/shared/ErrorsHandling'
import type {OrderDetailsPresentation} from '$lib/frontend/presentations/OrderDetailsPresentation'

export const prerender = false

export const load = async (event): Promise<OrderDetailsPresentation> => {

    let response: Response
    try {
        response = await event.fetch(`/api/v1/order/${event.params.id}`, {method: 'GET'})
    } catch (e) {
        throwInternalServerError({message: 'COULD_NOT_FETCH_ORDER', cause: e as Error})
    }

    if (!response.ok) {
        throwInvalidRequestError({message: 'COULD_NOT_FETCH_ORDER'})
    }

    return await response.json()
}
