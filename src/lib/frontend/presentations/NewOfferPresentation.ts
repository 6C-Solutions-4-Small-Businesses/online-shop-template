import type {NewCategoryPresentation} from '$lib/frontend/presentations/NewCategoryPresentation'
import type {CategorySummaryPresentation} from '$lib/frontend/presentations/CategorySummaryPresentation'

export type NewOfferPresentation = {
    imageData: string
    name: string
    price: number
    quantity: number
    unit:string
    categories: (NewCategoryPresentation | CategorySummaryPresentation)[]
    description: string
    inventory: number
    barCode: string
    taxCategory: string
}
