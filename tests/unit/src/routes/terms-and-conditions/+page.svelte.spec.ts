import {render, type RenderResult} from '@testing-library/svelte'
import TermsAndConditionsPage from '$routes/terms-and-conditions/+page.svelte'

describe('TermsAndConditions', () => {
    let view: RenderResult<TermsAndConditionsPage>

    describe('statically', () => {
        beforeEach(() => {
            view = render(TermsAndConditionsPage)
        })

        it('should have the expected HTML structure', () => {
            expect(view.container).toMatchSnapshot()
        })
    })
})
