import type {NewCategoryPresentation} from '$lib/frontend/presentations/NewCategoryPresentation'
import type {CategorySummaryPresentation} from '$lib/frontend/presentations/CategorySummaryPresentation'

export type OffersModificationPresentation = {
    id?: string | null
    imageData?: string | null
    image?: string | null
    deleted?: boolean | null
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
