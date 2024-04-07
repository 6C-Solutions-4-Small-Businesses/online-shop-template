import type {PromotionSummaryPresentation} from '$lib/frontend/presentations/PromotionSummaryPresentation'

export type OfferSummaryPresentation = {
    id: string
    name: string
    price: number
    image: string
    description: string
    isSoldByQuantities: boolean
    unit: string | null
    promotion?: PromotionSummaryPresentation | null
}
