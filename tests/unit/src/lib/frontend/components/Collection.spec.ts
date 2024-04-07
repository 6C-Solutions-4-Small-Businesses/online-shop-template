import Collection from '$lib/frontend/components/Collection.svelte'
import {render} from '@testing-library/svelte'
import {describe, expect} from 'vitest'

describe('Collection', () => {
    it('should have match snapshot', () => {
        const {container} = render(Collection, {
            id: 'collection-id',
            name: 'collection-name',
            products: [
                {
                    id: 'a-product-id-1',
                    name: 'a-product-1-name',
                    price: 100,
                    image: 'image-1',
                    description: 'a product description',
                    quantity: 5,
                    isSoldByQuantities: false,
                    unit: 'Centiliter',
                },
                {
                    id: 'a-product-id-2',
                    name: 'a-product-2-name',
                    price: 100,
                    image: 'image-2',
                    description: 'a product description',
                    quantity: 10,
                    isSoldByQuantities: true,
                    unit: 'Centiliter',
                }
            ]
        })

        expect(container).toMatchSnapshot()
    })
})
