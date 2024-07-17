import type {CategorySummaryPresentation} from '$lib/frontend/presentations/CategorySummaryPresentation'
import type {NewCategoryPresentation} from '$lib/frontend/presentations/NewCategoryPresentation'

export type OfferAdditionRequest = {
    type: string
    name: string
    price: number
    image: string
    description: string
    isSoldByQuantities: boolean
    quantity: number
    unit: string
    categories: (CategorySummaryPresentation | NewCategoryPresentation)[]
    barCode: string
    isTaxable: boolean
    inventory: number
}
export type OfferEditionRequest = OfferAdditionRequest & {
    id: string
}
export type OffersManagementRequest = {
    additions: OfferAdditionRequest[],
    editions: OfferEditionRequest[],
    suppressions: string[]
}
