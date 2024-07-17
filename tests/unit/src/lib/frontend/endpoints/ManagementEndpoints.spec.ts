//@vitest-environment node
/* eslint-disable @typescript-eslint/no-explicit-any */
import {API_BASE_ENDPOINT, BASE_HEADERS} from '$lib/frontend/Constants'
import {sendOffersManagementRequests} from '$lib/frontend/endpoints/ManagementEndpoints'
import {anyObject, anyString, mock, type MockProxy} from 'vitest-mock-extended'
import {afterEach} from 'vitest'
import type {
    OfferAdditionRequest,
    OfferEditionRequest,
    OffersManagementRequest,
} from '$lib/frontend/requests/OffersManagementRequest'
import type {OffersManagementResultPresentation} from '$lib/frontend/presentations/OffersManagementResultPresentation'

const fetchSpy = vi.fn()

describe('Management Endpoint', () => {

    beforeEach(() => {
        fetchSpy.mockResolvedValue({
            ok: true,
            json: async () => ({}),
        })
    })

    describe('for Offers', () => {

        const offersManagementEndpoint = `${API_BASE_ENDPOINT}/management/offers`

        let request: MockProxy<OffersManagementRequest>

        beforeEach(async () => {
            request = {
                additions: [mock<OfferAdditionRequest>({
                    name: 'a new offer',
                })],
                editions: [mock<OfferEditionRequest>({
                    name: 'an edited offer',
                })],
                suppressions: ['an old offer'],
            }
            await sendOffersManagementRequests(request)
        })

        describe('api call request', () => {

            it(`should call url ${offersManagementEndpoint}`, () => {

                expect(fetch).toHaveBeenCalledWith(offersManagementEndpoint, anyObject())
            })

            it('should use the "POST" method', () => {

                expect(fetch).toHaveBeenCalledWith(anyString(), expect.objectContaining({
                    method: 'POST',
                }))
            })

            it('should use BASE_HEADERS', () => {

                expect(fetch).toHaveBeenCalledWith(anyString(), expect.objectContaining({
                    headers: BASE_HEADERS,
                }))
            })

            it('should pass the request as a JSON string in the body', () => {

                expect(fetch).toHaveBeenCalledWith(anyString(), expect.objectContaining({
                    body: JSON.stringify(request),
                }))
            })
        })

        describe('response', () => {

            const responseDataStub: OffersManagementResultPresentation = {
                "totalRequests": 1,
                "offersCreated": 1,
                "offersEdited": 0,
                "offersDeleted": 0,
                "failedRequests": [],
                "successfulRequests": [],
            }
            let fetchResponse: { json: () => Promise<{}>; ok: boolean; status?: number }

            beforeEach(async () => {
                fetchResponse = {
                    ok: true,
                    json: async () => responseDataStub,
                }
                fetchSpy.mockResolvedValue(fetchResponse)
            })

            it('should be return the data in the payload when status is 201', async () => {

                fetchResponse.status = 201

                const response = await sendOffersManagementRequests(request)

                expect(response).toStrictEqual(responseDataStub)
            })

            it('should be undefined if status is not 201', () => {

                fetchResponse.status = 400

                expect(sendOffersManagementRequests(request)).resolves.toBeUndefined()
            })
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
})

global.fetch = fetchSpy
/* eslint-enable @typescript-eslint/no-explicit-any */
