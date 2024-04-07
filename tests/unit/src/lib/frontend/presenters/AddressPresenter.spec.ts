import {AddressPresenter} from '$lib/frontend/presenters/AddressPresenter'

describe('AddressPresenter presents', () => {

    it('should present an AddressPresentation from an Address', () => {

        const presentation = new AddressPresenter().present({
            city: 'city',
            countryCode: 'country',
            line1: 'line1',
            postalCode: 'postalCode',
            stateCode: 'state',
            line2: 'line2'
        })

        expect(presentation).toStrictEqual({
            city: 'city',
            country: 'country',
            streetAddressLine1: 'line1',
            postalCode: 'postalCode',
            streetAddressLine2: 'line2',
            state: 'state',
        })
    })
})
