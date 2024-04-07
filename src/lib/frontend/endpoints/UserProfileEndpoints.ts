import type {UserProfilePresentation} from '$lib/frontend/presentations/UserProfilePresentation'
import type {UserAccountSummaryPresentation} from '$lib/frontend/presentations/UserAccountSummaryPresentation'
import type {AddressPresentation} from '$lib/frontend/presentations/AddressPresentation'

export async function getUserProfile(): Promise<UserProfilePresentation | undefined> {
    //TODO(https://github.com/6C-Solutions-4-Small-Businesses/static-web-site/issues/274)
    return Promise.resolve({
        account: {
            id: 'usr_1234567890',
            firstName: 'John',
            lastName: 'Doe',
            email: 'account@mail.com',
            phoneNumber: '5148907685',
            customerId: 'cus_XyX',
        } as UserAccountSummaryPresentation,
        deliveryAddress: {
            streetAddressLine1: '1234 Main St',
            streetAddressLine2: '',
            city: 'Anytown',
            state: 'CA',
            postalCode: '12345',
            country:'USA',
        } as AddressPresentation,
        billingAddress: {
            streetAddressLine1: '1234 Main St',
            streetAddressLine2: '',
            city: 'Anytown',
            state: 'CA',
            postalCode: '12345',
            country:'USA',
        } as AddressPresentation,
        orders: {
            completed: [],
            current: [],
            canceled: [],
        },
    } as UserProfilePresentation)
}
