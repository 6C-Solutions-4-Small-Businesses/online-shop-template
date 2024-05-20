import {render, type RenderResult} from '@testing-library/svelte'
import PrivacyPolicies from '$routes/privacy-policies/en/+page.svelte'

describe('Privacy Policies', () => {
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
