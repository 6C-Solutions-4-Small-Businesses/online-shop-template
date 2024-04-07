import type {Address} from '$lib/backend/shared/types/Address'
import type {AddressPresentation} from '$lib/frontend/presentations/AddressPresentation'

export class AddressPresenter {

    present(address: Address): AddressPresentation {
        return {
            city: address.city,
            country: address.countryCode,
            streetAddressLine1: address.line1,
            postalCode: address.postalCode,
            streetAddressLine2: address.line2 ?? '',
            state: address.stateCode,
        }
    }
}
