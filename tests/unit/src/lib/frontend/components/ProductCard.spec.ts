import ProductCard from '$lib/frontend/components/ProductCard.svelte'
import {render} from '@testing-library/svelte'
import {describe, expect} from 'vitest'

describe('Product card', () => {
    it('should have match snapshot', () => {
        const {container} = render(ProductCard, {
            id: 'a-product-id',
            name: 'a-product-name',
            image: 'a-product-image',
            regularPrice: 250,
            salePrice: 150,
            isSoldByQuantities: false,
            unit: 'Centiliter',
            width: 'w-20',
            height: 'h-screen'
        })

        expect(container).toMatchSnapshot()
    })
})
