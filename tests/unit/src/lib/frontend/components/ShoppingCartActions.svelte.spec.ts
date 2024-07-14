import {describe, expect, vi} from 'vitest'
import {render} from '@testing-library/svelte'
import ShoppingCartActions from '$lib/frontend/components/ShoppingCartActions.svelte'

describe('Spotlight product card', () => {
    let container: HTMLElement

    beforeEach(() => {
        ({container} = render(ShoppingCartActions, {
            props: {
                selectedQuantity: 1,
                increaseSelectedQuantityHandler: vi.fn(),
                changeSelectedQuantityHandler: vi.fn(),
                decreaseSelectedQuantityHandler: vi.fn(),
            }
        }))
    })

    it('should have match snapshot', () => {

        expect(container).toMatchSnapshot()
    })
})