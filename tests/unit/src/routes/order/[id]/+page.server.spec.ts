import {load, prerender} from '$routes/order/[id]/+page.server'
import {anyObject, anyString, mock, type MockProxy} from 'vitest-mock-extended'
import {afterEach, describe, vi} from 'vitest'
import type {ServerLoadEvent} from '@sveltejs/kit'
import {mockedFetch} from '$mocks/packages/fetch'
import type {RouteParams} from '$svelteKitTypes/src/routes/contact/$types'
import type {OrderDetailsPresentation} from '$lib/frontend/presentations/OrderDetailsPresentation'

describe('Order page at "/order/[id]" server script', () => {

    const orderId = 'order-id'
    const fetchedOrderDetailsPresentation = {} as OrderDetailsPresentation

    describe('configuration', () => {

        it('should NOT be pre-rendered', () => {
            expect(prerender).toBe(false)
        })
    })

    describe('loads data', () => {

        let event: MockProxy<
            ServerLoadEvent<
                RouteParams,
                OrderDetailsPresentation,
                '/contact'
            >
        >

        describe('when successful', () => {

            let response: OrderDetailsPresentation

            beforeEach(async () => {
                mockedFetch.mockResolvedValue({
                    ok: true,
                    json: async () => (fetchedOrderDetailsPresentation)
                })
                event = mock({
                    fetch: mockedFetch,
                    params: mock<RouteParams>({id: orderId})
                })

                response = await load(event)
            })

            it(`should fetch "/api/v1/order/${orderId}"`, async () => {
                expect(mockedFetch).toHaveBeenCalledWith(`/api/v1/order/${orderId}`, anyObject())
            })

            it('should use "GET" method when fetching', () => {
                expect(mockedFetch).toHaveBeenCalledWith(anyString(), {method: 'GET'})
            })

            it('should return the contact of the business', () => {
                expect(response).toStrictEqual(fetchedOrderDetailsPresentation)
            })
        })

        describe('on failure', () => {

            it('should throw COULD_NOT_FETCH_ORDER when response status is not OK', async () => {
                mockedFetch.mockResolvedValue({ok: false})
                await expect(load(event)).rejects.toEqual({
                    status: 400,
                    body: {message: 'COULD_NOT_FETCH_ORDER'}
                })
            })

            it('should throw COULD_NOT_FETCH_ORDER when fetch throws', async () => {
                mockedFetch.mockRejectedValue(new Error('Network error'))
                await expect(load(event)).rejects.toEqual({
                    status: 500,
                    body: {message: 'COULD_NOT_FETCH_ORDER'}
                })
            })
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
})
