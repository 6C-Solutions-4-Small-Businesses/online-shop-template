import {afterEach, describe} from 'vitest'
import {load, prerender} from '$routes/+page.server'
import {mockedFetch} from '$mocks/packages/fetch'
import {anyObject, anyString, mock, type MockProxy} from 'vitest-mock-extended'
import type {ServerLoadEvent} from '@sveltejs/kit'
import type {CollectionPresentation} from '$lib/frontend/presentations/CollectionPresentation'
import type {RouteParams} from 'types/src/routes/$types'
import type {CategorySummaryPresentation} from '$lib/frontend/presentations/CategorySummaryPresentation'

describe('Home page at "/" server script', () => {

    const fetchedCollections = [] satisfies CollectionPresentation[]

    describe('configuration', () => {

        it('should be pre-rendered', () => {
            expect(prerender).toBe(true)
        })
    })

    describe('loads data', () => {

        let event: MockProxy<
            ServerLoadEvent<
                RouteParams,
                { categories: CategorySummaryPresentation[] } & { collections: CollectionPresentation[] },
                '/'
            >
        >

        describe('when successful', () => {

            let response: any

            beforeEach(async () => {
                mockedFetch.mockResolvedValue({
                    json: async () => (fetchedCollections)
                })
                event = mock({
                    fetch: mockedFetch,
                })

                response = await load(event)
            })

            it('should fetch "/api/v1"', async () => {
                expect(mockedFetch).toHaveBeenCalledWith('/api/v1', anyObject())
            })

            it('should use "GET" method when fetching', () => {
                expect(mockedFetch).toHaveBeenCalledWith(anyString(), {method: 'GET'})
            })

            it('should return the collections', () => {
                expect(response).toStrictEqual({collections: fetchedCollections})
            })
        })

        describe('on failure', () => {

            it('should return an empty array of collections if response status is not 200', () => {
                mockedFetch.mockResolvedValue({status: 500})
                expect(load(event)).resolves.toEqual({collections: []})
            })

            it('should return an empty array of collection', async () => {
                mockedFetch.mockRejectedValue(new Error('Network error'))
                await expect(load(event)).resolves.toEqual({collections: []})
            })
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
})
