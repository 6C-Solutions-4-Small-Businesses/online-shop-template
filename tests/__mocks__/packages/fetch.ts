import {vi} from 'vitest'

export const mockedFetch = vi.fn()
global.fetch = mockedFetch

export default {
    mockedFetch,
}
