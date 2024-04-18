import {localStorageStore} from "@skeletonlabs/skeleton";
import {anyObject, anyString} from "vitest-mock-extended";
import {afterAll} from "vitest";

describe('wereCookiesAccepted', () => {

    beforeAll(async() => {
        await import('$lib/frontend/stores/localStorageStore/AcceptCookiesStore')
    })

    it('should be undefined by default', () => {
        expect(localStorageStore).toHaveBeenCalledWith(anyString(), undefined, anyObject())
    })

    it('should be read from the local storage key "cookiesAccepted"', async () => {
        expect(localStorageStore).toHaveBeenCalledWith('cookiesAccepted', undefined, anyObject())
    })

    it('should use the local storage type', () => {
        expect(localStorageStore).toHaveBeenCalledWith(anyString(), undefined, {storage: 'local'})
    })

    afterAll(() => {
        vi.clearAllMocks()
    })
})

vi.mock('@skeletonlabs/skeleton', async () => {
    const actual = await vi.importActual('@skeletonlabs/skeleton')
    const { localStorageStubs } = await import('$mocks/src/lib/frontend/stores/LocalStorageStore')
    return {
        ...actual,
        localStorageStore: vi.fn(() => localStorageStubs.cookiesAccepted)
    }
})
