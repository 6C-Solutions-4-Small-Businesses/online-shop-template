import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'
import type {OfferAdditionRequest, OfferEditionRequest} from '$lib/frontend/requests/OffersManagementRequest'

export type AnyTypeOfOffersChangeRequest = OfferAdditionRequest | OfferEditionRequest | string
export type OffersChangeOutcome = OfferSummaryPresentation | string
export type OffersManagementResultPresentation = {
    totalRequests: number,
    offersCreated: number,
    offersEdited: number,
    offersDeleted: number,
    failedRequests: AnyTypeOfOffersChangeRequest[],
    successfulRequests: OffersChangeOutcome[],
}
