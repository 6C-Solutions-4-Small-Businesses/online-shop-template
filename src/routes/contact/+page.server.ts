import type {BusinessContactPresentation} from '$lib/frontend/presentations/BusinessContactPresentation'
import {throwInternalServerError, throwInvalidRequestError} from '$lib/shared/ErrorsHandling'
import {FORCE_INCREMENTAL_STATIC_REGENERATION_TOKEN} from '$env/static/private'

export const config = {
    isr: {
        expiration: false,
        bypassToken: FORCE_INCREMENTAL_STATIC_REGENERATION_TOKEN,
    },
}

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



