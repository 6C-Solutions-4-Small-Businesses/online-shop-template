import {afterEach, beforeEach, describe, type Mock, vi} from 'vitest'
import {cleanup, render, screen, waitFor} from '@testing-library/svelte'
import CheckoutSessionPage from '$routes/cart/checkout/[session_id]/+page.svelte'
import '@testing-library/jest-dom'
import {mock} from 'vitest-mock-extended'
import type {OrderDetailsPresentation} from '$lib/frontend/presentations/OrderDetailsPresentation'
import {finalizeCheckoutSession} from '$lib/frontend/endpoints/Endpoints'
import '$mocks/packages/svelte-french-toast'
import {currentPageParams} from '$mocks/src/lib/frontend/stores/PageStore'
import {resetShoppingCartStubs} from '$mocks/src/lib/frontend/stores/ShoppingCartStore'
import {clearShoppingCartStore} from '$lib/frontend/stores/shoppingCartStore/ShoppingCartStore'
import {toastError} from '$lib/frontend/core/ToasterUtils'

describe('/cart/checkout/[session_id]', () => {

    const mockedFinalizeCheckoutSession = finalizeCheckoutSession as Mock

    beforeEach(() => {
        mockedFinalizeCheckoutSession.mockResolvedValue(mock({
            items: [],
        }))
    })

    describe('initial state', () => {

        it('should show the "loading-indicator" at start', () => {
            render(CheckoutSessionPage)

            expect(screen.getByTestId('progress-bar')).toBeInTheDocument()
        })
    })

    describe('dynamic state', () => {
        const sessionId = 'cs_XcV'

        beforeEach(() => {
            currentPageParams.session_id = sessionId

            render(CheckoutSessionPage)
        })

        it('should invoke "finalizeCheckoutSession" with sessionId from path parameters', async () => {

            expect(mockedFinalizeCheckoutSession).toHaveBeenCalledWith(sessionId)
        })

        it('should clear the cart after the order is finalized successfully', async () => {

            mockedFinalizeCheckoutSession.mockResolvedValue(mock<OrderDetailsPresentation>())

            expect(clearShoppingCartStore).toHaveBeenCalled()
        })
    })

    describe('on failure', () => {

        it('should toast error if call to "finalizeCheckoutSession" fails', async () => {

            const message = 'an error message'
            mockedFinalizeCheckoutSession.mockRejectedValue(new Error(message))

            render(CheckoutSessionPage)

            await waitFor(() => expect(toastError).toHaveBeenCalledWith(message))
        })

        it('should NOT clear the cart if the order was NOT finalized successfully', async () => {

            mockedFinalizeCheckoutSession.mockResolvedValue(undefined)

            render(CheckoutSessionPage)

            expect(clearShoppingCartStore).not.toHaveBeenCalled()
        })
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
        resetShoppingCartStubs()
    })
})

vi.mock('$lib/frontend/endpoints/Endpoints', () => {
    return {
        finalizeCheckoutSession: vi.fn().mockResolvedValue({}),
    }
})

vi.mock('$lib/frontend/core/Helper', () => {
    return {
        executeFunction: vi.fn(async (isLoading, asyncFunction) => {
            return await asyncFunction()
        }),
    }
})

vi.mock('svelte-french-toast', () => {
    return {
        default: {
            error: vi.fn(),
        },
    }
})

vi.mock('$app/stores', async () => {

    return await import('$mocks/src/lib/frontend/stores/PageStore')
})

vi.mock('$lib/frontend/stores/shoppingCartStore/ShoppingCartStore', async () => {
    const mocks = await import('$mocks/src/lib/frontend/stores/ShoppingCartStore')
    return {
        ...mocks,
        clearShoppingCartStore: vi.fn(),
    }
})

vi.mock('$lib/frontend/core/ToasterUtils', () => {
    return {
        toastError: vi.fn(),
    }
})
