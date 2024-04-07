import {render} from '@testing-library/svelte'
import {expect} from 'vitest'
import ContactPage from '$routes/contact/+page.svelte'
import {mock} from 'vitest-mock-extended'
import type {BusinessContactPresentation} from '$lib/frontend/presentations/BusinessContactPresentation'
import {getDemoMerchantPresentedOpeningHours} from '$tests/unit/src/routes/contact/ContactPageTestHelper'

describe('Contact Page', () => {

    describe('HTML', () => {

        it('should match snapshot', () => {
            const {container} = render(ContactPage, {
                data: mock<BusinessContactPresentation>({
                    openingHours: getDemoMerchantPresentedOpeningHours(),
                })
            })

            expect(container).toMatchSnapshot()
        })
    })
})
