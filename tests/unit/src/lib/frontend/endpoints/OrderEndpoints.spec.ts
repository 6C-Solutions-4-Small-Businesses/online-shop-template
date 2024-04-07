import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {mockedFetch} from '$mocks/packages/fetch'
import {anyObject, mock} from 'vitest-mock-extended'
import {
    anOrderId,
    errorResponseText,
    expectedHeaders,
    prepareResponseStub
} from '$tests/unit/src/lib/frontend/FrontendTestHelpers'
import '$mocks/packages/svelte-french-toast'
import toast from 'svelte-french-toast'
import {getOrderDetails} from '$lib/frontend/endpoints/OrderEndpoints'
import type {OrderDetailsPresentation} from '$lib/frontend/presentations/OrderDetailsPresentation'

describe('getOrderDetails exposes /api/v1/order/[id]', () => {

    const expectedGetOrderDetailsEndpoint = `/api/v1/order/${anOrderId}`

    describe('fetch request', () => {
        let requestInitialization: {}

        beforeEach(async () => {

            mockedFetch.mockResolvedValue(mock<Response>())

            await getOrderDetails(anOrderId)

            requestInitialization = mockedFetch.mock.calls.at(0)[1]
        })

        it(`should call endpoint "${expectedGetOrderDetailsEndpoint}"`, () => {

            expect(fetch).toHaveBeenCalledWith(expectedGetOrderDetailsEndpoint, anyObject())
        })

        it('should use "GET" verb to call endpoint', () => {

            expect(requestInitialization).toHaveProperty('method', 'GET')
        })

        it('should send the "Content-Type" of "application/json" and "X-App-Source" of "SvelteKit" to endpoint', () => {

            expect(requestInitialization).toHaveProperty('headers', expectedHeaders)
        })
    })

    describe('on success', () => {

        it('should return a "OrderDetailsPresentation" and status code is 200', async () => {

            const expectedPresentation = mock<OrderDetailsPresentation>()
            mockedFetch.mockResolvedValue(prepareResponseStub(200, expectedPresentation))

            const presentation = await getOrderDetails(anOrderId)

            expect(presentation).toBe(expectedPresentation)
        })
    })

    describe('on failure', () => {

        test.each([
            [400,],
            [404,],
            [500,],
        ])('should toast error when response status code is "%d"', async (statusCode) => {

            const stubResponse = prepareResponseStub(statusCode, {})
            mockedFetch.mockResolvedValue(stubResponse)

            await getOrderDetails(anOrderId)

            expect(toast.error).toHaveBeenCalledWith(errorResponseText, anyObject())
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
})
