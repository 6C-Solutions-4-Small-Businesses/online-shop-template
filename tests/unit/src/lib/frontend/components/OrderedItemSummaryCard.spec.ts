import {render} from '@testing-library/svelte'
import {describe, expect} from 'vitest'
import OrderedItemSummaryCard from '$lib/frontend/components/OrderedItemSummaryCard.svelte'

describe('OrderedItemSummaryCard', () => {
    it('should have match snapshot', () => {
        const {container} = render(OrderedItemSummaryCard)

        expect(container).toMatchSnapshot()
    })
})
