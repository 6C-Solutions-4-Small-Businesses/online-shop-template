import {render, type RenderResult} from "@testing-library/svelte"
import CookiesDisclaimerModal from "$lib/frontend/components/CookiesDisclaimerModal.svelte"
import {localStorageStubs} from "$mocks/src/lib/frontend/stores/LocalStorageStore";
import {afterEach} from "vitest";
import {showCookiesDisclaimer} from "$lib/frontend/stores/localStorageStore/ShowCookiesDisclaimerStore";

describe('Cookies Disclaimer', () => {
    let rendering: RenderResult<CookiesDisclaimerModal>

    beforeEach(() => {
        rendering = render(CookiesDisclaimerModal);
    })

    describe('statically', () => {

        it('should have matching snapshot', () => {

            expect(rendering.container).toMatchSnapshot()
        })
    })

    describe('on user interaction', () => {

        describe('updates CookiesAccepted store', () => {

            it('should set the "true" if "accept" button is selected', () => {

                rendering.getByTestId('accept').click()

                expect(localStorageStubs.cookiesAccepted.set).toHaveBeenCalledWith(true)
            })

            it('should set the "false" if "decline" button is selected', () => {

                rendering.getByTestId('decline').click()

                expect(localStorageStubs.cookiesAccepted.set).toHaveBeenCalledWith(false)
            })
        })

        describe('updates showCookiesDisclaimer store', () => {

            it('should set show disclaimer to false when decline button is selected', () => {

                rendering.getByTestId('accept').click()

                expect(localStorageStubs.showCookiesDisclaimer.set).toHaveBeenCalledWith(false)
            })

            it('should set show disclaimer to false when decline button is selected', () => {

                rendering.getByTestId('decline').click()

                expect(localStorageStubs.showCookiesDisclaimer.set).toHaveBeenCalledWith(false)
            })

            it('should be set to true if cookies accepted is undefined', () => {
                localStorageStubs.cookiesAccepted.set(undefined)
                showCookiesDisclaimer.subscribe(value => {
                    expect(value).toBe(true)
                })
            })
        })
    })

    afterEach(() => {
        rendering.unmount()
        vi.clearAllMocks()
    })
})


vi.mock('@skeletonlabs/skeleton', async () => {
    const actual = await vi.importActual('@skeletonlabs/skeleton')
    const {localStorageStubs} = await import('$mocks/src/lib/frontend/stores/LocalStorageStore')
    return {
        ...actual,
        localStorageStore: vi.fn((key, initialValue, options) => {
            if (key === 'cookiesAccepted') {
                return localStorageStubs.cookiesAccepted
            }
            if (key === 'showCookiesDisclaimer') {
                return localStorageStubs.showCookiesDisclaimer
            }
            //@ts-ignore
            return actual.localStorageStore(key, initialValue, options)
        })
    }
})
