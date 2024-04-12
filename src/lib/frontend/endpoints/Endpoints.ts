import type {CheckoutRequest, CheckoutResponse} from '$lib/frontend/requests/CheckoutRequest'
import {toastError} from '$lib/frontend/core/ToasterUtils'
import {Email, type FindUserRequest} from '$lib/frontend/requests/FindUserRequest'
import type {UserAccountSummaryPresentation} from '$lib/frontend/presentations/UserAccountSummaryPresentation'
import type {
    CustomerProfileEditionRequest,
    CustomerProfilePresentation
} from '$lib/frontend/presentations/CustomerProfilePresentation'
import type {OrderDetailsPresentation} from '$lib/frontend/presentations/OrderDetailsPresentation'
import {API_BASE_ENDPOINT, BASE_HEADERS} from '$lib/frontend/Constants'
import type {BusinessContactRequest} from '$lib/frontend/requests/BusinessContactRequest'
import type {GenericSuccessResponsePresentation} from '$lib/frontend/presentations/GenericSuccessResponsePresentation'

export async function createCheckoutSession(parameters: CheckoutRequest): Promise<CheckoutResponse | undefined> {
    const response = await fetch(
        `${API_BASE_ENDPOINT}/cart/checkout`,
        {
            method: 'POST',
            headers: BASE_HEADERS,
            body: JSON.stringify(parameters),
        }
    )

    if (response.status === 200) {
        return await response.json()
    } else {
        const message = await response.text()
        console.log(message)
        toastError(message)
    }
}

export async function findUser(parameters: FindUserRequest): Promise<UserAccountSummaryPresentation | undefined> {

    const response = await fetch(`${API_BASE_ENDPOINT}/user/find`, {
        method: 'POST',
        headers: BASE_HEADERS,
        body: JSON.stringify(
            parameters instanceof Email
                ? {email: parameters.value}
                : {phoneNumber: parameters.value}
        ),
    })

    switch (response.status) {
        case 200:
            return await response.json()
        case 404:
            return undefined
        case 500:
            toastError(await response.text())
    }
}

export async function finalizeCheckoutSession(sessionId: string): Promise<OrderDetailsPresentation | undefined> {
    const response = await fetch(
        `${API_BASE_ENDPOINT}/cart/checkout/${sessionId}`,
        {
            method: 'POST',
            headers: BASE_HEADERS,
        }
    )

    if (response.status === 200) {
        return await response.json()
    } else {
        toastError(await response.text())
    }
}

export async function createCustomerProfile(
    request: CustomerProfileEditionRequest
): Promise<CustomerProfilePresentation | undefined> {
    const response = await fetch(`${API_BASE_ENDPOINT}/user/customerProfile`, {
        method: 'POST',
        headers: BASE_HEADERS,
        body: JSON.stringify(request),
    })

    switch (response.status) {
        case 200:
        case 201:
            return await response.json()
        case 500:
        default:
            toastError(await response.text())
    }
}

export async function contactBusiness(
    request: BusinessContactRequest
): Promise<GenericSuccessResponsePresentation | undefined> {
    const response = await fetch(`${API_BASE_ENDPOINT}/contact/owner`, {
        method: 'POST',
        headers: BASE_HEADERS,
        body: JSON.stringify(request),
    })

    switch (response.status) {
        case 200:
        case 201:
            return await response.json()
        case 500:
        default:
            toastError('Malheureusement, nous n\'avons pas pu envoyer votre message. Veuillez réessayer plus tard.')
    }
}
