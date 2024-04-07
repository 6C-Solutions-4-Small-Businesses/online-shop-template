import {afterEach} from 'vitest'
import {cleanup, render, type RenderResult, screen} from '@testing-library/svelte'
import AddressFormComponent from '$lib/frontend/components/AddressForm.svelte'
import '@testing-library/jest-dom'
import type {AddressPresentation} from '$lib/frontend/presentations/AddressPresentation'

describe('Address Form Component', () => {
    const inputContainerId = 'test-id'
    const initialAddress = {
        streetAddressLine1: '123 Main St',
        streetAddressLine2: 'Apt 1',
        city: 'Anytown',
        state: 'NY',
        postalCode: '12345',
        country: 'USA',
    }
    const address = initialAddress as AddressPresentation

    let rendering: RenderResult<AddressFormComponent, typeof import('@testing-library/dom/types/queries')>

    describe('html structure', () => {

        beforeEach(() => {
            rendering = render(AddressFormComponent, {
                props: {
                    id: inputContainerId,
                    address,
                },
            })
        })

        it('should map the "id" property to the "data-testid" of the containing div', () => {

            expect(screen.getByTestId(inputContainerId)).toBeInTheDocument()
        })

        test.each([
            ['street-address-line1', 'streetAddressLine1'],
            ['street-address-line2', 'streetAddressLine2'],
            ['city', 'city'],
            ['postal-code', 'postalCode'],
            ['state', 'state'],
            ['country', 'country'],
        ])('should set the value of form element "%s" to the initial value "%s" of the address property',
            (formElementId, property) => {

                const formElement = rendering.getByTestId(formElementId) as HTMLSelectElement | HTMLInputElement

                expect(formElement.value).toBeDefined()
                // @ts-ignore
                expect(formElement.value).toStrictEqual(initialAddress[property])
            })
    })

    describe('when in readonly', () => {

        beforeEach(() => {
            rendering = render(AddressFormComponent, {
                props: {
                    address,
                    readonly: true,
                },
            })
        })

        test.each([
            ['street-address-line1',],
            ['street-address-line2',],
            ['city',],
            ['state',],
            ['postal-code',],
            ['country',],
        ])('should disable "%s" when component is in readonly', async (testId) => {

            expect(screen.getByTestId(testId)).toBeDisabled()
        })

        afterEach(() => {
            rendering.unmount()
        })

        afterEach(() => {
            rendering.unmount()
        })
    })

    describe('when not in readonly', () => {

        beforeEach(() => {
            rendering = render(AddressFormComponent, {
                props: {
                    address,
                    readonly: false,
                },
            })
        })

        test.each([
            ['streetAddressLine1', 'street-address-line1',],
            ['streetAddressLine2', 'street-address-line2',],
            ['city', 'city',],
            ['state', 'state',],
            ['state', 'state',],
            ['country', 'country',],
        ])('should update "%s" store when form element "%s" is changed',
            (store, formElementId) => {

                const newValue = 'new value'
                const formElement = rendering.getByTestId(formElementId) as HTMLSelectElement | HTMLInputElement
                formElement.value = newValue

                rendering.component[store]?.subscribe((value: string) => {
                    expect(value).toStrictEqual(newValue)
                })
            })

        afterEach(() => {
            rendering.unmount()
        })
    })

    describe('address-updated event', () => {

        beforeEach(() => {

            rendering = render(AddressFormComponent, {
                props: {
                    address,
                    readonly: false,
                },
            })
        })

        test.each([
            ['street-address-line1',],
            ['street-address-line2',],
            ['city',],
            ['postal-code',],
            ['state',],
            ['country',],
        ])('is raised when form element "%s" is changed', (formElementId) => {

            const formElement = rendering.getByTestId(formElementId) as HTMLSelectElement | HTMLInputElement
            formElement.value = 'new value'

            rendering.component['address-updated']?.subscribe((value: string) => {
                expect(value).toBeDefined()
            })
        })

        it('should be raised on component creation', () => {

            rendering.component['address-updated']?.subscribe((value: string) => {
                expect(value).toBeDefined()
            })
        })
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })
})
