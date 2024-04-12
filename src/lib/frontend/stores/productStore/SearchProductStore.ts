import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'
import {writable, type Writable} from 'svelte/store'
import type {PaginationPresentation} from '$lib/frontend/core/PaginationPresentation'

export const searchedProductName: Writable<string> = writable()

export const submittedProductName: Writable<string> = writable()

export const searchedProductResult: Writable<PaginationPresentation<OfferSummaryPresentation>> =
    writable()
