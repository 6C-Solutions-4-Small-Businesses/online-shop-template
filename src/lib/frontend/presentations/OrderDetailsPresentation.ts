import type {CartItemPresentation} from '$lib/frontend/presentations/CartItemPresentation'

export type OrderDetailsPresentation = {
    id: string,
    checkoutSessionId: string,
    customerId: string,
    deliveryId: string,
    status: string,
    description: string,
    amount: number,
    createdAt: string,
    canceledAt?: string | null | undefined,
    canceledBy?: string | null | undefined,
    items: CartItemPresentation[],
    delivery: {
        trackingUrl: string,
    },
}
