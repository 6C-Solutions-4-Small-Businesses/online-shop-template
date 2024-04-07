import type {AddressPresentation} from '$lib/frontend/presentations/AddressPresentation'

export type AddressUpdatedEvent = { detail: { address: AddressPresentation } }
