import {describe, expect} from 'vitest'
import {render} from '@testing-library/svelte'
import SpotlightedProductCard from '$lib/frontend/components/SpotlightedProductCard.svelte'

describe('Spotlight product card', () => {
    let container: HTMLElement

    beforeEach(() => {
        ({container} = render(SpotlightedProductCard, {
            props: {
                id: 'product-id',
                image: 'product-image',
                name: 'product-name',
                price: 24.99,
                salePrice: 19.99,
            }
        }))
    })

    it('should have match snapshot', () => {
        expect(container).toMatchSnapshot()
    })
})