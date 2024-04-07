import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'

export type CollectionPresentation = {
    id: string
    name: string
    description: string | null
    type: 'Spotlight' | 'Sale' | 'Common'
    offers: OfferSummaryPresentation[]
}
