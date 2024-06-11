import {cleanup, render} from '@testing-library/svelte'
import {afterEach, describe, expect} from 'vitest'
import OrderedItemSummaryCard from '$lib/frontend/components/OrderedItemSummaryCard.svelte'

describe('OrderedItemSummaryCard', () => {
    it('should have match snapshot', () => {
        const {container} = render(OrderedItemSummaryCard, {
            props: {
                id: 'ordered-item-id',
                name: 'ordered-item-name',
                price: 100,
                image: 'image',
                selectedQuantity: 1,
            }
        })

        expect(container).toMatchSnapshot()
    })

    afterEach(() => {
        cleanup()
    })
})
