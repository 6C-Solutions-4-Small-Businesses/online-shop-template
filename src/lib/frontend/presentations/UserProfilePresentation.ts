import type {UserAccountSummaryPresentation} from '$lib/frontend/presentations/UserAccountSummaryPresentation'
import type {OrderDetailsPresentation} from '$lib/frontend/presentations/OrderDetailsPresentation'
import type {AddressPresentation} from '$lib/frontend/presentations/AddressPresentation'

export type UserProfilePresentation = {
    account: UserAccountSummaryPresentation,
    deliveryAddress: AddressPresentation,
    billingAddress: AddressPresentation,
    orders: {
        completed: OrderDetailsPresentation[],
        current: OrderDetailsPresentation[],
        canceled: OrderDetailsPresentation[],
    },
}
