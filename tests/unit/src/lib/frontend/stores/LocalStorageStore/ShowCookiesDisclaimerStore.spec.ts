import {localStorageStore} from "@skeletonlabs/skeleton";
import {anyBoolean, anyObject, anyString} from "vitest-mock-extended";
import {afterAll} from "vitest";
import {localStorageStubs} from "$mocks/src/lib/frontend/stores/LocalStorageStore";
import {showCookiesDisclaimer} from "$lib/frontend/stores/localStorageStore/ShowCookiesDisclaimerStore";

describe('showCookiesDisclaimer', () => {

    beforeAll(async () => {
        await import('$lib/frontend/stores/localStorageStore/ShowCookiesDisclaimerStore')
    })

    it('should be false by default', () => {
        expect(localStorageStore).toHaveBeenCalledWith(anyString(), true, anyObject())
    })

    it('should be read from the local storage key "showCookiesDisclaimer"', async () => {
        expect(localStorageStore).toHaveBeenCalledWith('showCookiesDisclaimer', anyBoolean(), anyObject())
    })

    it('should use the local storage type', () => {
        expect(localStorageStore).toHaveBeenCalledWith(anyString(), anyBoolean(), {storage: 'local'})
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
        localStorageStore: vi.fn((key, defaultValue, options) => {
            if (key === 'cookiesAccepted') {
                return localStorageStubs.cookiesAccepted
            }
            //@ts-ignore
            return actual.localStorageStore(key, defaultValue, options)
        })
    }
})
