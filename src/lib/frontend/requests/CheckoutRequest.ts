import type {CartItemPresentation} from '$lib/frontend/presentations/CartItemPresentation'

export type CheckoutRequest = {
    user: {
        customerId: string,
    },
    products: CartItemPresentation[],
}

export type CheckoutResponse = { clientSecret: string }
