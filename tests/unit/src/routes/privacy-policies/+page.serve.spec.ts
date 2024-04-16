import {render, type RenderResult} from '@testing-library/svelte'
import PrivacyPolicies from '$routes/privacy-policies/+page.svelte'

describe('TermsAndConditions', () => {
    let view: RenderResult<PrivacyPolicies>

    describe('statically', () => {
        beforeEach(() => {
            view = render(PrivacyPolicies)
        })

        it('should have the expected HTML structure', () => {
            expect(view.container).toMatchSnapshot()
        })
    })
})
