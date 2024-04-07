import type {PaginatedResponse} from '$lib/backend/core/PaginatedResponse';
import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation';
import {writable, type Writable} from 'svelte/store';

export const searchedProductName: Writable<string> = writable();

export const submittedProductName: Writable<string> = writable();

export const searchedProductResult: Writable<PaginatedResponse<OfferSummaryPresentation>> =
	writable();
