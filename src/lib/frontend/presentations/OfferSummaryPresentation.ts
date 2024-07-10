import type {PromotionSummaryPresentation} from '$lib/frontend/presentations/PromotionSummaryPresentation'
import type {CategorySummaryPresentation} from '$lib/frontend/presentations/CategorySummaryPresentation'

export type OfferSummaryPresentation = {
    id: string
    name: string
    price: number
    image: string
    description: string
    isSoldByQuantities: boolean
    unit: string | null
    promotion?: PromotionSummaryPresentation | null
    categories?: CategorySummaryPresentation[] | null
}
