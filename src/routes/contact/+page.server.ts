import type {BusinessContactPresentation} from '$lib/frontend/presentations/BusinessContactPresentation'
import {throwInternalServerError, throwInvalidRequestError} from '$lib/shared/ErrorsHandling'

export const prerender = true

export const load = async (event): Promise<BusinessContactPresentation> => {
    let response: Response
    try {
        response = await event.fetch('/api/v1/contact', {method: 'GET'})
    } catch (e) {
        throwInternalServerError({message: 'COULD_NOT_FETCH_BUSINESS_CONTACT', cause: e as Error})
    }

    if (!response.ok) {
        throwInvalidRequestError({message: 'COULD_NOT_FETCH_BUSINESS_CONTACT'})
    }

    return await response.json()
}



