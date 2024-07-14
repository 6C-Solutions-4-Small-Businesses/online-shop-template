import {describe, expect} from 'vitest'
import {render} from '@testing-library/svelte'
import SpotlightedProductCard from '$lib/frontend/components/SpotlightedProductCard.svelte'

describe('Spotlight product card', () => {
    let container: HTMLElement

    beforeEach(() => {
        ({container} = render(SpotlightedProductCard, {
            props: {
                id: 'product-id',
                name: 'product-name',
                image: 'product-image',
                regularPrice: 24.99,
                isSoldByQuantities: false,
                unit: 'unit',
                salePrice: 19.99,
            }
        }))
    })

    it('should have match snapshot', () => {
        expect(container).toMatchSnapshot()
    })
})