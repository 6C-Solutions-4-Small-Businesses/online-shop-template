import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {anyObject, mock} from 'vitest-mock-extended'
import {
    createCheckoutSession,
    createCustomerProfile,
    finalizeCheckoutSession,
    findUser
} from '$lib/frontend/endpoints/Endpoints'
import type {UserAccountSummaryPresentation} from '$lib/frontend/presentations/UserAccountSummaryPresentation'
import type {CheckoutRequest} from '$lib/frontend/requests/CheckoutRequest'
import type {IShoppingCartProductState} from '$lib/frontend/stores/shoppingCartStore/IShoppingCartProductState'
import type {
    CustomerProfileEditionRequest,
    CustomerProfilePresentation
} from '$lib/frontend/presentations/CustomerProfilePresentation'
import '$mocks/packages/svelte-french-toast'
import {customerProfileEditionRequest as request} from '$mocks/src/lib/frontend/requests/UserRequestsStubs'
import {
    email,
    errorResponseText,
    expectedHeaders,
    prepareResponseStub
} from '$tests/unit/src/lib/frontend/FrontendTestHelpers'
import {mockedFetch} from '$mocks/packages/fetch'
import {toastError} from '$lib/frontend/core/ToasterUtils'
import {Email, PhoneNumber} from '$lib/frontend/requests/FindUserRequest'

describe('findUser', () => {

    let findParameters = Email.create(email)

    describe('fetch request', () => {
        let requestInitialization: NonNullable<unknown>

        beforeEach(async () => {

            mockedFetch.mockResolvedValue(mock<Response>())

            await findUser(mock())

            requestInitialization = mockedFetch.mock.calls.at(0)[1]
        })

        it('should call backend endpoint /api/v1/user/find', () => {

            expect(fetch).toHaveBeenCalledWith('/api/v1/user/find', anyObject())
        })

        it('should make a post to backend endpoint /api/v1/user/find', () => {

            expect(requestInitialization).toHaveProperty('method', 'POST')
        })

        it('should send the "Content-Type" of "application/json" and "X-App-Source" of "SvelteKit" to endpoint', () => {

            expect(requestInitialization).toHaveProperty('headers', expectedHeaders)
        })
    })

    describe('using email', () => {

        beforeEach(async () => {
            vi.clearAllMocks()
            findParameters = Email.create(email)
            await findUser(findParameters)
        })

        it('should send the email parameter in a json structure to endpoint', () => {

            const expectedBody = {
                'email': findParameters.value,
            }

            const requestInitialization = mockedFetch.mock.calls.at(0)[1]

            expect(requestInitialization).toHaveProperty('body', JSON.stringify(expectedBody))
        })
    })

    describe('using phone number', () => {

        beforeEach(async () => {
            vi.clearAllMocks()
            findParameters = PhoneNumber.create('11111111')
            await findUser(findParameters)
        })

        it('should send the "phoneNumber" parameter in a json structure to endpoint', () => {

            const expectedBody = {
                'phoneNumber': findParameters.value,
            }

            const requestInitialization = mockedFetch.mock.calls.at(0)[1]

            expect(requestInitialization).toHaveProperty('body', JSON.stringify(expectedBody))
        })
    })

    describe('returns user presentation', () => {

        beforeEach(async () => {
            vi.clearAllMocks()
        })

        it('should return user summary presentation when response status code is 200', async () => {

            const expectedPresentation = mock<UserAccountSummaryPresentation>()
            mockedFetch.mockResolvedValue(prepareResponseStub(200, expectedPresentation))

            const presentation = await findUser(mock())

            expect(presentation).toBe(expectedPresentation)
        })

        it('should return nothing when response status code is 404', async () => {
            mockedFetch.mockResolvedValue(prepareResponseStub(404, {}))

            const presentation = await findUser(mock())

            expect(presentation).toBeUndefined()
        })

        it('should throw BackendError when response status code is something else', async () => {

            const stubResponse = prepareResponseStub(500, {})
            mockedFetch.mockResolvedValue(stubResponse)

            await findUser(mock())

            expect(toastError).toHaveBeenCalledWith(errorResponseText)
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
})

describe('createCheckoutSession', () => {

    const userInfo: CheckoutRequest = {
        user: {
            customerId: 'cu_XyZ',
        },
        products: [
            mock<IShoppingCartProductState>(),
        ],
    }

    beforeEach(async () => {
        mockedFetch.mockResolvedValue(mock<Response>())

        await createCheckoutSession(userInfo)
    })

    describe('fetch request', () => {

        it('should call /api/v1/cart/checkout', async () => {

            const requestUrl = mockedFetch.mock.calls.at(0)[0]

            expect(requestUrl).toStrictEqual('/api/v1/cart/checkout')
        })

        it('should use post method', async () => {

            const requestParameters = mockedFetch.mock.calls.at(0)[1]

            expect(requestParameters).toHaveProperty('method', 'POST')
        })

        it('should pass headers "Content-Type" as "application/json" and "X-App-Source" as "SvelteKit"', async () => {

            const requestParameters = mockedFetch.mock.calls.at(0)[1]

            expect(requestParameters).toHaveProperty('headers', expectedHeaders)
        })

        it('should pass cart products items in body as json property "item"', async () => {

            const requestParameters = mockedFetch.mock.calls.at(0)[1]

            expect(requestParameters).toHaveProperty('body', JSON.stringify(userInfo))
        })
    })

    describe('handle response', () => {

        const expectedClientSecret = 'a-secret'
        const expectedResponse = {
            clientSecret: expectedClientSecret,
        }

        it('in case of 200 and should return fetched clientSecret', async () => {
            mockedFetch.mockResolvedValue(mock<Response>({
                status: 200,
                json(): Promise<any> {
                    return Promise.resolve(expectedResponse)
                },
            }))

            const response = await createCheckoutSession(userInfo)

            expect(response).toStrictEqual(expectedResponse)
        })

        it('and in case of error return undefined', async () => {
            mockedFetch.mockResolvedValue(mock<Response>({
                status: 400,
            }))

            const response = await createCheckoutSession(userInfo)

            expect(response).toBeUndefined()
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
})

describe('finalizeCheckoutSession', () => {

    const sessionId = 'cs_XcvA'
    const finalizeCheckoutEndpoint = `/api/v1/cart/checkout/${sessionId}`

    beforeEach(async () => {
        mockedFetch.mockResolvedValue(mock<Response>())

        await finalizeCheckoutSession(sessionId)
    })

    describe('fetch request', () => {

        it(`should call ${finalizeCheckoutEndpoint}`, async () => {

            const requestUrl = mockedFetch.mock.calls.at(0)[0]

            expect(requestUrl).toStrictEqual(finalizeCheckoutEndpoint)
        })

        it('should use post method', async () => {

            const requestParameters = mockedFetch.mock.calls.at(0)[1]

            expect(requestParameters).toHaveProperty('method', 'POST')
        })

        it('should pass headers "Content-Type" as "application/json" and "X-App-Source" as "SvelteKit"', async () => {

            const requestParameters = mockedFetch.mock.calls.at(0)[1]

            expect(requestParameters).toHaveProperty('headers', expectedHeaders)
        })

        it('should not pass anything in body', async () => {

            const requestParameters = mockedFetch.mock.calls.at(0)[1]

            expect(requestParameters.body).toBeUndefined()
        })
    })

    describe('handle response', () => {

        const orderIdResponse = {
            orderId: 'an-order-id',
        }

        it('in case of 200 and should return order id', async () => {
            mockedFetch.mockResolvedValue(mock<Response>({
                status: 200,
                json(): Promise<any> {
                    return Promise.resolve(orderIdResponse)
                },
            }))

            const response = await finalizeCheckoutSession(sessionId)

            expect(response).toStrictEqual(orderIdResponse)
        })

        it('and in case of error return undefined', async () => {
            mockedFetch.mockResolvedValue(mock<Response>({
                status: 400,
            }))

            const response = await finalizeCheckoutSession(sessionId)

            expect(response).toBeUndefined()
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
})

describe('createCustomerProfile', () => {

    describe('fetch request', () => {
        let requestInitialization: NonNullable<unknown>

        beforeEach(async () => {

            mockedFetch.mockResolvedValue(mock<Response>())

            await createCustomerProfile(mock())

            requestInitialization = mockedFetch.mock.calls.at(0)[1]
        })

        it('should call backend endpoint /api/v1/user/customerProfile', () => {

            expect(fetch).toHaveBeenCalledWith('/api/v1/user/customerProfile', anyObject())
        })

        it('should make a post to backend endpoint /api/v1/user/customerProfile', () => {

            expect(requestInitialization).toHaveProperty('method', 'POST')
        })

        it('should send the "Content-Type" of "application/json" and "X-App-Source" of "SvelteKit" to endpoint', () => {

            expect(requestInitialization).toHaveProperty('headers', expectedHeaders)
        })
    })

    describe('using request', () => {

        beforeEach(async () => {
            vi.clearAllMocks()
            mockedFetch.mockResolvedValue(prepareResponseStub(201, {}))
            await createCustomerProfile(request)
        })

        test.each([
            ['email', ],
            ['firstName',],
            ['lastName',],
            ['phoneNumber',],
            ['details'],
        ])('should send the "%s" value in a json structure to endpoint', (property: string) => {

            // @ts-ignore
            const payloadValue = request[property as keyof CustomerProfileEditionRequest]
            const expectedBody = {
                [property]: payloadValue,
            }

            const requestInitialization = mockedFetch.mock.calls.at(0)[1]

            expect(payloadValue).toBeDefined()
            expect(JSON.parse(requestInitialization.body)).toEqual(expect.objectContaining(expectedBody))
        })
    })

    describe('returns "CustomerProfilePresentation"', () => {

        beforeEach(async () => {
            vi.clearAllMocks()
        })

        it('should return "CustomerProfilePresentation" when response status code is 201', async () => {

            const expectedPresentation = mock<CustomerProfilePresentation>()
            mockedFetch.mockResolvedValue(prepareResponseStub(201, expectedPresentation))

            const presentation = await createCustomerProfile(mock())

            expect(presentation).toBe(expectedPresentation)
        })

        test.each([
            [400,],
            [404,],
            [500,],
        ])('should toast error when response status code is "%d"', async (statusCode: number) => {

            const stubResponse = prepareResponseStub(statusCode, {})
            mockedFetch.mockResolvedValue(stubResponse)

            await createCustomerProfile(mock())

            expect(toastError).toHaveBeenCalledWith(errorResponseText)
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
    })
})

vi.mock('$lib/frontend/core/ToasterUtils', () => {
    return {
        toastError: vi.fn(),
    }
})
