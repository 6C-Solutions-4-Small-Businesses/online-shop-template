import type {ServerLoadEvent} from '@sveltejs/kit'
import {afterEach, describe, expect, vi} from 'vitest'
import {anyObject, anyString, mock, type MockProxy} from 'vitest-mock-extended'
import {load, prerender} from '$routes/category/[id]/+page.server'
import {mockedFetch} from '$mocks/packages/fetch'
import type {RouteParams} from '$svelteKitTypes/src/routes/category/[id]/$types'
import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'
import {PRODUCT_DISPLAY_LIMIT} from '$lib/frontend/core/Helper'
import type {LayoutPageData} from "$routes/+layout.server";

describe('Category Page Data Server', () => {

    describe('configuration', () => {

        it('should NOT have pre-rendering', () => {
            expect(prerender).toBe(false)
        })
    })

    describe('loads', () => {

        let response: any
        let event: MockProxy<
            ServerLoadEvent<
                RouteParams,
                LayoutPageData,
                '/category/[id]'
            >
        >

        beforeEach(async () => {

            event = mock({
                fetch: mockedFetch,
            })
        })

        describe('then selected category offers', () => {

            beforeEach(() => {
                mockedFetch.mockResolvedValueOnce({
                    ok: true,
                    json: async () => ([] as OfferSummaryPresentation[])
                })
            })

            describe('when successful', () => {

                const selectedCategoryId = 'category-id'
                const fetchedOffers = [] satisfies OfferSummaryPresentation[]

                beforeEach(async () => {
                    mockedFetch.mockResolvedValue({
                        ok: true,
                        json: async () => (fetchedOffers)
                    })
                    event = mock({
                        params: {id: selectedCategoryId},
                        fetch: mockedFetch,
                    })

                    response = await load(event)
                })

                it('should fetch endpoint "/api/v1/offer"', async () => {
                    expect(mockedFetch).toHaveBeenCalledWith(expect.stringContaining('/api/v1/offer'), anyObject())
                })

                it(`should add query param "&categoryId=${selectedCategoryId}"`, async () => {
                    expect(mockedFetch).toHaveBeenCalledWith(expect.stringContaining(`&categoryId=${selectedCategoryId}`), anyObject())
                })

                it(`should limit the number of offers to "&limit=${selectedCategoryId}"`, async () => {
                    expect(mockedFetch).toHaveBeenCalledWith(expect.stringContaining(`&limit=${PRODUCT_DISPLAY_LIMIT}`), anyObject())
                })

                it('should use "GET" method when fetching', () => {
                    expect(mockedFetch).toHaveBeenCalledWith(anyString(), {method: 'GET'})
                })

                it('should return a response with the offers', () => {
                    expect(response)
                        .toStrictEqual(expect.objectContaining({offers: fetchedOffers}))
                })
            })

            describe('on failure', () => {

                it('should throw COULD_NOT_FETCH_CATEGORY_OFFERS 400 error if response is not "ok"', async () => {
                    event = mock({
                        params: {id: 'category-id'},
                        fetch: vi.fn().mockResolvedValue({ok: false}),
                    })

                    await expect(load(event)).rejects.toEqual({
                        status: 400,
                        body: {message: 'COULD_NOT_FETCH_CATEGORY_OFFERS'}
                    })
                })

                it('should throw COULD_NOT_FETCH_CATEGORY_OFFERS 500 error if fetch failed', async () => {
                    event = mock({
                        params: {id: 'category-id'},
                        fetch: vi.fn().mockRejectedValue(new Error('Network error')),
                    })

                    await expect(load(event)).rejects.toEqual({
                        status: 500,
                        body: {message: 'COULD_NOT_FETCH_CATEGORY_OFFERS'}
                    })
                })
            })
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
})
