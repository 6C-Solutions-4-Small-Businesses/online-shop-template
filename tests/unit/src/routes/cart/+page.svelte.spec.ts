import CartPage from '$routes/cart/+page.svelte'
import '@testing-library/jest-dom'
import {cleanup, render, screen, waitFor} from '@testing-library/svelte'
import type {ModalStore} from '@skeletonlabs/skeleton'
import {mock} from 'vitest-mock-extended'
import type {UserAccountSummaryPresentation} from '$lib/frontend/presentations/UserAccountSummaryPresentation'
import {goto} from '$app/navigation'
import {afterEach, type Mock} from 'vitest'
import {openAuthenticationModal} from '$lib/frontend/stores/authentication/Authentication'

const {cart} = await vi.hoisted(
    () => import('$mocks/src/lib/frontend/stores/ShoppingCartStore')
)

describe('Page at /cart', () => {
    const checkoutButtonTestId = 'checkout-button'

    beforeEach(() => {
        vi.mock('$lib/frontend/stores/shoppingCartStore/ShoppingCartStore', async () => {
            return {
                cart
            }
        })
        vi.mock('@skeletonlabs/skeleton', async () => {
            const actual = await import('@skeletonlabs/skeleton')
            const {modalStore} = await import('$mocks/src/lib/frontend/components/Modals')
            return {
                ...actual,
                getModalStore: (): ModalStore => modalStore
            }
        })
        vi.mock('$app/navigation', async () => {
            return {
                goto: vi.fn()
            }
        })

        render(CartPage)
    })

    describe('Checkout Button', () => {
        describe('behavior', () => {
            it(`should be in the document under testId: "${checkoutButtonTestId}"`, async () => {
                expect(await screen.findByTestId(checkoutButtonTestId)).toBeInTheDocument()
            })

            it(`should be enabled`, async () => {
                expect(await screen.findByTestId(checkoutButtonTestId)).toBeEnabled()
            })
        })

        describe('when clicked', () => {
            const userEmail = 'a@mail.com'
            const existingUserCustomerId = 'cu_Xy1'

            let openAuthenticationModalMock: Mock
            let checkoutButton: HTMLButtonElement

            beforeAll(() => {
                vi.mock('$lib/frontend/stores/authentication/Authentication', async () => {
                    return {
                        openAuthenticationModal: vi.fn()
                    }
                })
            })

            beforeEach(async () => {
                openAuthenticationModalMock = openAuthenticationModal as Mock
                checkoutButton = await screen.findByTestId(checkoutButtonTestId)
            })

            it(`should take the user to "/cart/checkout?customerId=${existingUserCustomerId}" when prompt resolves with an existing user`, async () => {
                openAuthenticationModalMock.mockResolvedValue(
                    mock<UserAccountSummaryPresentation>({
                        email: userEmail,
                        customerId: existingUserCustomerId
                    })
                )

                checkoutButton.click()

                await waitFor(() =>
                    expect(goto).toHaveBeenCalledWith(
                        `/cart/checkout?customerId=${encodeURIComponent(existingUserCustomerId)}`
                    )
                )
            })

            it(`should take the user to "/cart/checkout?email=${userEmail}" when prompt resolves with a non-existing user`, async () => {
                openAuthenticationModalMock.mockResolvedValue(userEmail)

                checkoutButton.click()

                await waitFor(() =>
                    expect(goto).toHaveBeenCalledWith(`/cart/checkout?email=${encodeURIComponent(userEmail)}`)
                )
            })

            it('should take the user to "/cart/checkout?email=${userEmail}&phoneNumber={phoneNumber}" when prompt resolves with a user with an undefined customerId in the account', async () => {
                const phoneNumber = '1234567890'
                openAuthenticationModalMock.mockResolvedValue(mock<UserAccountSummaryPresentation>({
                    email: userEmail,
                    customerId: undefined,
                    phoneNumber,
                }))

                checkoutButton.click()

                await waitFor(() =>
                    expect(goto).toHaveBeenCalledWith(`/cart/checkout?email=${encodeURIComponent(userEmail)}&phoneNumber=${encodeURIComponent(phoneNumber)}`)
                )
            })
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
        cleanup()
    })
})
