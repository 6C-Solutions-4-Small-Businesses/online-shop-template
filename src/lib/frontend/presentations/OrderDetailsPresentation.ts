import type {CartItem} from '$lib/backend/cart/CartItem'
import type {ManifestItem} from '$lib/backend/uberDirect/Types'

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
    items: (CartItem & ManifestItem)[],
    delivery: {
        trackingUrl: string,
    },
}
