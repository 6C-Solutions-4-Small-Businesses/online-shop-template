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
            selectedQuantity: 5
        })

        expect(container).toMatchSnapshot()
    })
})
