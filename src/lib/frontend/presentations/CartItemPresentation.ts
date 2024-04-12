import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'

export type CartItemPresentation = OfferSummaryPresentation & {
    selectedQuantity: number,
}
