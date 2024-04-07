import type {ServerLoadEvent} from '@sveltejs/kit'
import {afterEach, describe, expect, vi} from 'vitest'
import {anyObject, anyString, mock, type MockProxy} from 'vitest-mock-extended'
import {type CategoryPageData, load, prerender} from '$routes/category/[id]/+page.server'
import type {CollectionPresentation} from '$lib/frontend/presentations/CollectionPresentation'
import {mockedFetch} from '$mocks/packages/fetch'
import type {RouteParams} from 'types/src/routes/category/[id]/$types'
import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'
import {PRODUCT_DISPLAY_LIMIT} from '$lib/frontend/core/Helper'

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
                CategoryPageData,
                '/category/[id]'
            >
        >

        beforeEach(async () => {

            event = mock({
                fetch: mockedFetch,
            })
        })

        describe('all categories first', () => {

            const fetchedCollections = [] satisfies CollectionPresentation[]

            beforeEach(() => {
                mockedFetch.mockResolvedValue({
                    json: async () => (fetchedCollections)
                })
            })

            describe('when successful', () => {

                beforeEach(async () => {
                    mockedFetch.mockResolvedValue({
                        ok: true,
                        json: async () => (fetchedCollections)
                    })
                    event = mock({
                        fetch: mockedFetch,
                    })

                    response = await load(event)
                })

                it('should fetch "/api/v1/category/all"', async () => {
                    expect(mockedFetch).toHaveBeenCalledWith('/api/v1/category/all', anyObject())
                })

                it('should use "GET" method when fetching', () => {
                    expect(mockedFetch).toHaveBeenCalledWith(anyString(), {method: 'GET'})
                })

                it('should return a response with the collections', () => {
                    expect(response)
                        .toStrictEqual(expect.objectContaining({categories: fetchedCollections}))
                })
            })

            describe('on failure', () => {

                it('should throw COULD_NOT_FETCH_ALL_CATEGORIES 400 error if response is not "ok"', async () => {
                    mockedFetch.mockResolvedValue({ok: false})
                    await expect(load(event)).rejects.toEqual({
                        status: 400,
                        body: {message: 'COULD_NOT_FETCH_ALL_CATEGORIES'}
                    })
                })

                it('should throw COULD_NOT_FETCH_ALL_CATEGORIES 500 error if fetch failed', async () => {
                    mockedFetch.mockRejectedValue(new Error('Network error'))
                    await expect(load(event)).rejects.toEqual({
                        status: 500,
                        body: {message: 'COULD_NOT_FETCH_ALL_CATEGORIES'}
                    })
                })
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

                it('should return a response with the collections', () => {
                    expect(response)
                        .toStrictEqual(expect.objectContaining({currentCategoryOffers: fetchedOffers}))
                })
            })

            describe('on failure', () => {

                it('should throw COULD_NOT_FETCH_CATEGORY_OFFERS 400 error if response is not "ok"', async () => {
                    mockedFetch.mockResolvedValue({ok: false})
                    await expect(load(event)).rejects.toEqual({
                        status: 400,
                        body: {message: 'COULD_NOT_FETCH_CATEGORY_OFFERS'}
                    })
                })

                it('should throw COULD_NOT_FETCH_CATEGORY_OFFERS 500 error if fetch failed', async () => {
                    mockedFetch.mockRejectedValue(new Error('Network error'))
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
