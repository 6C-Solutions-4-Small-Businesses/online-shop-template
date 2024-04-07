export const expectedHeaders = {
    'Content-Type': 'application/json',
    'X-App-Source': 'SvelteKit'
}
export const errorResponseText = 'error-response-text'
export const email = 'a@mail.com'
export const anOrderId = '000000-0000-0000-0000-000000000000'

import {vi} from 'vitest'

export function prepareResponseStub(status: number, responseJson: any) {
    const stubResponse = new Response(null, {status,})
    vi.spyOn(stubResponse, 'json').mockImplementation(() => Promise.resolve(responseJson))
    vi.spyOn(stubResponse, 'text').mockImplementation(() => Promise.resolve(errorResponseText))
    return stubResponse
}
