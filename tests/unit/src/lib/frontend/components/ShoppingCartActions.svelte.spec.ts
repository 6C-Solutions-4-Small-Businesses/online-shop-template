import {describe, expect} from 'vitest'
import {render} from '@testing-library/svelte'
import ShoppingCartActions from '$lib/frontend/components/ShoppingCartActions.svelte'

describe('Spotlight product card', () => {
    let container: HTMLElement

    beforeEach(() => {
        ({container} = render(ShoppingCartActions, {
            props: {
                productId: 'product-id',
                image: 'product-image',
                name: 'product-name',
                regularPrice: 24.99,
                salePrice: 19.99,
            }
        }))
    })

    it('should have match snapshot', () => {

        expect(container).toMatchSnapshot()
    })
})