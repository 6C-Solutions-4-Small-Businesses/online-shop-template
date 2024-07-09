import ShoppingCartProductCard from '$lib/frontend/components/ShoppingCartProductCard.svelte'
import {render} from '@testing-library/svelte'
import {describe, expect} from 'vitest'

describe('Shopping card product card', () => {
    it('should have match snapshot', () => {
        const {container} = render(ShoppingCartProductCard, {
            id: 'a-product-id',
            name: 'a-product-name',
            image: 'a-product-image',
            price: 250,
        })

        expect(container).toMatchSnapshot()
    })
})

describe('Shopping card product card with promotion', () => {
    it('should have match snapshot', () => {
        const {container} = render(ShoppingCartProductCard, {
            id: 'a-product-id',
            name: 'a-product-name',
            image: 'a-product-image',
            price: 250,
            percentage: 85,
            salePrice: 299
        })

        expect(container).toMatchSnapshot()
    })
})
