import {load, prerender} from '$routes/contact/+page.server'
import {anyObject, anyString, mock, type MockProxy} from 'vitest-mock-extended'
import {afterEach, describe, vi} from 'vitest'
import type {ServerLoadEvent} from '@sveltejs/kit'
import {mockedFetch} from '$mocks/packages/fetch'
import type {BusinessContactPresentation} from '$lib/frontend/presentations/BusinessContactPresentation'
import type {RouteParams} from 'types/src/routes/contact/$types'

describe('Contact page at "/contact" server script', () => {

    const fetchedBusinessContactPresentation = {} as BusinessContactPresentation

    describe('configuration', () => {

        it('should be pre-rendered', () => {
            expect(prerender).toBe(true)
        })
    })

    describe('loads data', () => {

        let event: MockProxy<
            ServerLoadEvent<
                RouteParams,
                any,
                '/contact'
            >
        >

        describe('when successful', () => {

            let response: any

            beforeEach(async () => {
                mockedFetch.mockResolvedValue({
                    ok: true,
                    json: async () => (fetchedBusinessContactPresentation)
                })
                event = mock({
                    fetch: mockedFetch,
                })

                response = await load(event)
            })

            it('should fetch "/api/v1/contact"', async () => {
                expect(mockedFetch).toHaveBeenCalledWith('/api/v1/contact', anyObject())
            })

            it('should use "GET" method when fetching', () => {
                expect(mockedFetch).toHaveBeenCalledWith(anyString(), {method: 'GET'})
            })

            it('should return the contact of the business', () => {
                expect(response).toStrictEqual(fetchedBusinessContactPresentation)
            })
        })

        describe('on failure', () => {

            it('should throw COULD_NOT_FETCH_BUSINESS_CONTACT when response status is not OK', async () => {
                mockedFetch.mockResolvedValue({ok: false})
                await expect(load(event)).rejects.toEqual({
                    status: 400,
                    body: {message: 'COULD_NOT_FETCH_BUSINESS_CONTACT'}
                })
            })

            it('should throw COULD_NOT_FETCH_BUSINESS_CONTACT when fetch throws', async () => {
                mockedFetch.mockRejectedValue(new Error('Network error'))
                await expect(load(event)).rejects.toEqual({
                    status: 500,
                    body: {message: 'COULD_NOT_FETCH_BUSINESS_CONTACT'}
                })
            })
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
})
