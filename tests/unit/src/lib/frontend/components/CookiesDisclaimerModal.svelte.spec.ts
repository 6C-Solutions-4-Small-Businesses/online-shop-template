import {render} from "@testing-library/svelte"
import CookiesDisclaimerModal from "$lib/frontend/components/CookiesDisclaimerModal.svelte"

describe('Cookies Disclaimer', () => {

    describe('statically', () => {

        it('should have matching snapshot', () => {

            const {container} = render(CookiesDisclaimerModal)

            expect(container).toMatchSnapshot()
        })
    })
})
