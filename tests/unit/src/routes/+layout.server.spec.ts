import {type LayoutPageData, load, prerender} from '$routes/+layout.server'
import {afterEach, describe} from 'vitest'
import {anyObject, anyString, mock, type MockProxy} from 'vitest-mock-extended'
import type {ServerLoadEvent} from '@sveltejs/kit'
import type {CollectionPresentation} from '$lib/frontend/presentations/CollectionPresentation'
import {mockedFetch} from '$mocks/packages/fetch'
import type {RouteParams} from '$svelteKitTypes/src/routes/$types'

describe('Layout Data Server', () => {

    describe('configuration', () => {

        it('should NOT have pre-rendering', () => {
            expect(prerender).toBe(false)
        })
    })

    describe('loads data', () => {

        const fetchedCollections = [] satisfies CollectionPresentation[]

        let event: MockProxy<
            ServerLoadEvent<
                RouteParams,
                LayoutPageData,
                '/'
            >
        >

        describe('data', () => {

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

                it('should fetch "/api/v1/category/all"', async () => {
                    expect(mockedFetch).toHaveBeenCalledWith('/api/v1/category/all', anyObject())
                })

                it('should use "GET" method when fetching', () => {
                    expect(mockedFetch).toHaveBeenCalledWith(anyString(), {method: 'GET'})
                })

                it('should return the collections', () => {
                    expect(response).toEqual(expect.objectContaining({categories: fetchedCollections}))
                })
            })

            describe('on failure', () => {

                it('should return an empty array of collections if response status is not 200', async () => {
                    mockedFetch.mockResolvedValue({status: 500})
                    await expect(load(event)).resolves.toEqual(expect.objectContaining({categories: []}))
                })

                it('should return an empty array of collection', async () => {
                    mockedFetch.mockRejectedValue(new Error('Network error'))
                    await expect(load(event)).resolves.toEqual(expect.objectContaining({categories: []}))
                })
            })
        })

        describe('application information', () => {

            it('should set the application version from the package json', async () => {
                const response = await load(event)

                expect(response).toEqual(expect.objectContaining({
                    version: anyString(),
                }))
            })
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
})
