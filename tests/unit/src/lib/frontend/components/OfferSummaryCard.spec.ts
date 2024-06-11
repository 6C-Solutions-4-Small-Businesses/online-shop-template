import {cleanup, render, type RenderResult} from '@testing-library/svelte'
import {afterEach, describe, expect} from 'vitest'
import OfferSummaryCard from '$lib/frontend/components/OfferSummaryCard.svelte'

describe('OfferSummaryCard', () => {

    const offerId = 'ordered-item-id'
    const onClick = vi.fn()

    let view: RenderResult<OfferSummaryCard, typeof import('@testing-library/dom/types/queries')>

    beforeEach(() => {

        view = render(OfferSummaryCard, {
            props: {
                id: offerId,
                name: 'ordered-item-name',
                price: 10099,
                image: 'https://cdn-cemal.nitrocdn.com/iwTMUnSsYeigzDpMWgwdBZhpcIeWwszq/assets/images/optimized/rev-59c8081/www.aaronfaber.com/wp-content/uploads/2017/03/product-placeholder-wp-95907_800x675.jpg',
                onClickHandler: onClick,
            },
        })
    })

    describe('Structure', () => {

        it('should have match snapshot', () => {

            expect(view.container).toMatchSnapshot()
        })
    })

    describe('Behavior', () => {

        it('should call onClickHandler when clicked', () => {

            const card = view.getByTestId(offerId)
            card.click()

            expect(onClick).toHaveBeenCalled()
        })
    })

    afterEach(() => {
        cleanup()
    })
})
