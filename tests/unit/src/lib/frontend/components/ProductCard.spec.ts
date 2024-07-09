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
        })

        expect(container).toMatchSnapshot()
    })
})

describe('Product card with promotion', () => {
    it('should have match snapshot', () => {
        const {container} = render(ProductCard, {
            id: 'a-product-id',
            name: 'a-product-name',
            image: 'a-product-image',
            regularPrice: 250,
            salePrice: 150,
            isSoldByQuantities: false,
            unit: 'Centiliter',
            percentage: 85
        })

        expect(container).toMatchSnapshot()
    })
})
