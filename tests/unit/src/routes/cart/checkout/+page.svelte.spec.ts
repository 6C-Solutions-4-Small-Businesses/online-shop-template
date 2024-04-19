import {afterEach, beforeEach, describe, expect, it, type Mock} from 'vitest'
import CartCheckoutPage from '$routes/cart/checkout/+page.svelte'
import {cleanup, render, type RenderResult, screen, waitFor} from '@testing-library/svelte'
import '@testing-library/jest-dom'
import {anyObject, anyString, mock, type MockProxy} from 'vitest-mock-extended'
import {mockedCartProducts} from '$mocks/src/lib/frontend/stores/ShoppingCartStore'
import {type Stripe, type StripeEmbeddedCheckout} from '@stripe/stripe-js'
import {PUBLIC_STRIPE_BUSINESS_CONNECT_ACCOUNT_ID, PUBLIC_STRIPE_KEY} from '$env/static/public'
import {createCheckoutSession, createCustomerProfile} from '$lib/frontend/endpoints/Endpoints'
import {currentPageUrlProvider} from '$mocks/src/lib/frontend/stores/PageStore'
import * as timers from 'timers'
import {type Writable, writable} from 'svelte/store'
import type {AddressPresentation} from '$lib/frontend/presentations/AddressPresentation'
import type {CustomerProfilePresentation} from '$lib/frontend/presentations/CustomerProfilePresentation'
import {goto} from '$app/navigation'
import type {ToastStore} from '@skeletonlabs/skeleton'

const customerId = 'cu_XyZ'

describe('/cart/checkout', () => {
    const clientSecret = 'a-secret'
    const mockCreateCheckoutSession = createCheckoutSession as Mock

    let loadStripeSpy: any
    let mockStripe: MockProxy<Stripe>
    let mockedCheckoutSession: MockProxy<StripeEmbeddedCheckout>

    beforeEach(async () => {
        mockStripe = mock<Stripe>()
        mockedCheckoutSession = mock<StripeEmbeddedCheckout>()
        loadStripeSpy = vi.spyOn(await import('@stripe/stripe-js'), 'loadStripe')
        loadStripeSpy.mockResolvedValue(mockStripe)
    })

    describe('when user is already a customer', () => {
        beforeEach(() => {
            currentPageUrlProvider.mockReturnValue(new URL(`http://localhost?customerId=${customerId}`))
        })

        describe('rendering the page', () => {
            beforeEach(() => {
                render(CartCheckoutPage)
            })

            it('should execute function createCheckoutSession using the provided customerId', () => {
                const parameters = mockCreateCheckoutSession.mock.calls.at(0)[0]

                expect(parameters).toHaveProperty('user', {customerId})
                expect(parameters).toHaveProperty('products', mockedCartProducts)
            })
        })

        describe('and then', () => {
            beforeEach(async () => {
                (createCheckoutSession as Mock).mockResolvedValue(
                    mock({
                        clientSecret
                    })
                )
                mockStripe.initEmbeddedCheckout.mockResolvedValue(mockedCheckoutSession)
            })

            describe('show checkout session', () => {
                beforeEach(async () => {
                    render(CartCheckoutPage)
                })

                it('should initialize Stripe with public key', async () => {
                    await waitFor(() => {
                        expect(loadStripeSpy).toHaveBeenCalledWith(PUBLIC_STRIPE_KEY, anyObject())
                    })
                })

                it('should initialize Stripe with business connect account id', async () => {
                    await waitFor(() => {
                        expect(loadStripeSpy).toHaveBeenCalledWith(anyString(), expect.objectContaining({
                            stripeAccount: PUBLIC_STRIPE_BUSINESS_CONNECT_ACCOUNT_ID,
                        }))
                    })
                })

                it('should load embedded Stripe checkout form with client secret of checkout session', async () => {
                    await waitFor(() => {
                        expect(mockStripe.initEmbeddedCheckout).toHaveBeenCalledWith({
                            clientSecret
                        })
                    })
                })

                it('should mount the checkout session component in div "checkout-session-container"', async () => {
                    await waitFor(() => {
                        expect(mockedCheckoutSession.mount).toHaveBeenCalledWith('#checkout-session-container')
                    })
                })
            })

            describe('finally, when destroyed', () => {
                it('should unmount Stripe checkout session', async () => {
                    const view = render(CartCheckoutPage)
                    await new Promise((resolve) => timers.setTimeout(resolve, 500))

                    cleanup()

                    await waitFor(() => expect(mockedCheckoutSession.destroy).toHaveBeenCalled(), {
                        container: view.container
                    })
                })
            })
        })
    })

    describe('when user is not a customer yet', () => {
        const email = 'a@mail.com'

        beforeEach(() => {
            currentPageUrlProvider.mockReturnValue(new URL(`http://localhost?email=${email}`))
        })

        describe('rendering the page', () => {
            let view: RenderResult<CartCheckoutPage>

            describe('firstly, shows a stepper of 3 steps', () => {
                it('should have the stepper with data-testid "stepper"', () => {
                    view?.unmount()
                    view = render(CartCheckoutPage)

                    expect(screen.getByTestId('stepper')).toBeInTheDocument()
                })

                describe('step #1 (index 0)', () => {
                    beforeEach(() => {
                        view = render(CartCheckoutPage, {
                            props: {
                                startingStep: 0
                            }
                        })
                    })

                    test.each([['email-input'], ['first-name'], ['last-name'], ['phone-number']])(
                        'should show the input "%s" in the form for the user info',
                        (inputId) => {
                            expect(screen.getByTestId(inputId)).toBeInTheDocument()
                        }
                    )

                    it('should disabled the "email-input" in the form for the user info', () => {
                        const emailInput = screen.getByTestId('email-input')

                        expect(emailInput).toBeDisabled()
                    })

                    it('should not let user go to next step because Next button is disabled', async () => {
                        expect(await findNextButton()).toBeDisabled()
                    })

                    it('should enable Next button when all user info is provided', async () => {
                        fillUserInfo()

                        expect(await findNextButton()).not.toBeDisabled()
                    })
                })

                describe('step #2 (index 1)', () => {
                    const isShippingAddressIncomplete = writable(true)
                    const pageProperties = {
                        startingStep: 1
                    }

                    beforeEach(() => {
                        view?.unmount()
                        view = render(CartCheckoutPage, {
                            props: {
                                ...pageProperties,
                                isShippingAddressIncomplete
                            }
                        })
                    })

                    it('should show the AddressInput with data-testid "shipping"', async () => {
                        expect(await screen.findByTestId('shipping')).toBeInTheDocument()
                    })

                    it('should not let user go to next step because Next button is disabled', async () => {
                        const nextButton = await findNextButton()

                        expect(nextButton).toBeDisabled()
                    })

                    it('should enable Next button when shipping info is provided', async () => {
                        isShippingAddressIncomplete.set(false)

                        expect(await findNextButton()).not.toBeDisabled()
                    })

                    it('should be possible to back to Step#1', async () => {
                        expect(await findPreviousButton()).not.toBeDisabled()
                    })
                })

                describe('step #3 (index 2)', () => {
                    const address = {
                        streetAddressLine1: '123 Main St',
                        streetAddressLine2: 'Apt 1',
                        city: 'Anytown',
                        state: 'NY',
                        country: 'USA',
                        postalCode: '12345'
                    } as AddressPresentation
                    const anotherAddress = {
                        streetAddressLine1: '456 Elm St',
                        city: 'Othertown',
                        state: 'NY',
                        country: 'USA',
                        postalCode: '12345'
                    } as AddressPresentation
                    const isBillingAddressIncomplete = writable(true)
                    const pageProperties = {
                        startingStep: 2
                    }

                    beforeEach(() => {
                        view?.unmount()
                        view = render(CartCheckoutPage, {
                            props: {
                                ...pageProperties,
                                isBillingAddressIncomplete,
                                shippingAddress: address,
                                billingAddress: anotherAddress
                            }
                        })
                    })

                    describe('billing details info', () => {
                        it('should show the AddressInput with data-testid "billing"', async () => {
                            expect(await screen.findByTestId('billing')).toBeInTheDocument()
                        })

                        it('should not let user click Complete button is disabled', async () => {
                            expect(await findCompleteButton()).toBeDisabled()
                        })

                        it('should enable Complete button when shipping info is provided', async () => {
                            isBillingAddressIncomplete.set(false)

                            expect(await findCompleteButton()).not.toBeDisabled()
                        })

                        it('should be possible to back to Step#2', async () => {
                            expect(await findPreviousButton()).not.toBeDisabled()
                        })
                    })

                    describe('use shipping address checkbox', () => {
                        beforeEach(() => {
                            view.component.shippingAddress = address
                            view.component.billingAddress = {} as AddressPresentation
                        })

                        it('should automatically set billing address to shipping address when checked', async () => {
                            const checkbox = (await screen.findByRole('checkbox')) as HTMLInputElement
                            checkbox.checked = true
                            checkbox.dispatchEvent(new Event('change'))

                            expect(view.component.billingAddress).toEqual(address)
                        })

                        it('should clear billing address when unchecked', async () => {
                            const checkbox = (await screen.findByRole('checkbox')) as HTMLInputElement
                            checkbox.checked = false
                            checkbox.dispatchEvent(new Event('change'))

                            expect(view.component.billingAddress).toEqual({
                                streetAddressLine1: '',
                                streetAddressLine2: '',
                                city: '',
                                postalCode: '',
                                state: 'Québec',
                                country: 'Canada'
                            })
                        })
                    })

                    describe('on complete', () => {
                        const firstName = 'John'
                        const lastName = 'Doe'
                        const phoneNumber = '+121343433'

                        let completeButton: HTMLButtonElement

                        beforeEach(async () => {
                            view.component.firstName?.set(firstName)
                            view.component.lastName?.set(lastName)
                            view.component.phoneNumber?.set(phoneNumber)
                            view.component.shippingAddress = address
                            view.component.billingAddress = anotherAddress

                            isBillingAddressIncomplete.set(false)

                            completeButton = await findCompleteButton()
                        })

                        it('should execute "createCustomerProfile"', async () => {
                            completeButton.click()

                            expect(createCustomerProfile).toHaveBeenCalledWith({
                                email,
                                firstName: firstName,
                                lastName: lastName,
                                phoneNumber: phoneNumber,
                                details: {
                                    shippingAddress: address,
                                    billingAddress: anotherAddress
                                }
                            })
                        })

                        it('should update the store "userCustomerProfile" upon profile creation', async () => {
                            const mockCreateCustomerProfile = createCustomerProfile as Mock
                            mockCreateCustomerProfile.mockResolvedValue({
                                customerId
                            } as CustomerProfilePresentation)
                            const spy = vi.spyOn(view.component['customerId'] as Writable<string>, 'set')

                            completeButton.click()

                            await waitFor(() => expect(spy).toHaveBeenCalledWith(customerId), {
                                timeout: 1000
                            })
                        })
                    })
                })

                async function findNextButton() {
                    return await findButtonByText('Suivant')
                }

                async function findPreviousButton() {
                    return await findButtonByText('Précédent')
                }

                async function findCompleteButton() {
                    return (await screen.findByText('Terminer')) as HTMLButtonElement
                }

                async function findButtonByText(text: string) {
                    const nextButtonSpan = await screen.findByText(text)
                    return nextButtonSpan.parentElement as HTMLButtonElement
                }

                function fillUserInfo() {
                    const emailInput = screen.getByTestId('email-input') as HTMLInputElement
                    const firstNameInput = screen.getByTestId('first-name') as HTMLInputElement
                    const lastNameInput = screen.getByTestId('last-name') as HTMLInputElement
                    const phoneNumberInput = screen.getByTestId('phone-number') as HTMLInputElement

                    const email = 'a@mail.com'
                    const firstName = 'John'
                    const lastName = 'Doe'
                    const phoneNumber = '+1234567890'
                    const keyboardEvent = new KeyboardEvent('input', {key: 'return'})

                    emailInput.value = email
                    firstNameInput.value = firstName
                    firstNameInput.dispatchEvent(keyboardEvent)
                    lastNameInput.value = lastName
                    lastNameInput.dispatchEvent(keyboardEvent)
                    phoneNumberInput.value = phoneNumber
                    phoneNumberInput.dispatchEvent(keyboardEvent)
                }
            })
        })
    })

    describe('when creation of checkout session return nothing', () => {
        beforeEach(() => {
            mockCreateCheckoutSession.mockResolvedValue(undefined)
            currentPageUrlProvider.mockReturnValue(new URL(`http://localhost?customerId=${customerId}`))
        })

        it('should redirect the user to the cart', async () => {
            render(CartCheckoutPage)

            await waitFor(() => expect(goto).toHaveBeenCalledWith('/cart'))
        })
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })
})

vi.mock('$lib/frontend/core/Helper', async () => {
    const actual = await import('$lib/frontend/core/Helper')
    return {
        ...actual,
        executeFunction: vi.fn(async (isLoading, asyncFunction) => {
            return await asyncFunction()
        })
    }
})

vi.mock('$lib/frontend/endpoints/Endpoints', async () => {
    const actual = await import('$lib/frontend/endpoints/Endpoints')
    return {
        ...actual,
        createCheckoutSession: vi.fn(),
        createCustomerProfile: vi.fn()
    }
})

vi.mock('$app/stores', async () => {
    return await import('$mocks/src/lib/frontend/stores/PageStore')
})

vi.mock('$lib/frontend/stores/shoppingCartStore/ShoppingCartStore', async () => {
    const {cart} = await import('$mocks/src/lib/frontend/stores/ShoppingCartStore')
    return {
        cart
    }
})

vi.mock('@stripe/stripe-js', () => {
    return {
        loadStripe: vi.fn()
    }
})

vi.mock('$app/navigation', async () => {
    return {
        goto: vi.fn()
    }
})

vi.mock('@skeletonlabs/skeleton', async () => {
    const actual = await import('@skeletonlabs/skeleton')
    const {toastStore} = await import('$mocks/src/lib/frontend/stores/ToastStore')
    return {
        ...actual,
        getToastStore: (): ToastStore => toastStore
    }
})
