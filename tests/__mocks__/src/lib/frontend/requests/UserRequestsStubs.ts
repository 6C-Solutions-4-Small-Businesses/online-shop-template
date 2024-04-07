import type {CustomerProfileEditionRequest} from '$lib/frontend/presentations/CustomerProfilePresentation'

function getCustomerProfileEditionRequestData() {
    return {
        firstName: 'a-first-name',
        lastName: 'a-last-name',
        email: 'a@mail.com',
        phoneNumber: '11111111',
        details: {
            shippingAddress: {
                streetAddressLine1: 'a-street',
                streetAddressLine2: 'a-street-2',
                city: 'a-city',
                postalCode: 'a-zip-code',
                country: 'a-country',
                state: 'a-state',
            },
            billingAddress: {
                streetAddressLine1: 'another-street',
                streetAddressLine2: '',
                city: 'another-city',
                postalCode: 'another-zip-code',
                country: 'another-country',
                state: 'another-state',
            },
        },
    }
}

export const customerProfileEditionRequest: CustomerProfileEditionRequest = getCustomerProfileEditionRequestData()

export function resetRouteUserCustomerProfileStubs() {
    Object.assign(customerProfileEditionRequest, getCustomerProfileEditionRequestData())
}
