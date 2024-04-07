import type {CartItem} from '$lib/backend/cart/CartItem'

export type CheckoutRequest = {
    user: {
        customerId: string,
    },
    products: CartItem[],
}

export type CheckoutResponse = { clientSecret: string }
