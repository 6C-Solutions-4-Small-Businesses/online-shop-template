import type {AddressPresentation} from '$lib/frontend/presentations/AddressPresentation'

export type CustomerProfileEditionRequest = {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    details: {
        shippingAddress: AddressPresentation,
        billingAddress: AddressPresentation,
    },
}

export type CustomerProfilePresentation = CustomerProfileEditionRequest & {
    userId: string,
    customerId: string,
}
