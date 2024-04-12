import {type Writable, writable} from 'svelte/store'
import {mock} from 'vitest-mock-extended'
import type {ShoppingCartProductState} from '$lib/frontend/stores/shoppingCartStore/ShoppingCartProductState'

export const mockedCartProducts: ShoppingCartProductState[] = [
    mock<ShoppingCartProductState>({
        id: 'product-1',
    })
]

function getCartData() {
    return new Map(mockedCartProducts.map((item) => [item.id, item]))
}

export const cartWritable: Writable<Map<string, ShoppingCartProductState>> = writable(getCartData())

export const cart = {
    subscribe: cartWritable.subscribe,
    set: vi.fn(),
}

export function resetShoppingCartStubs() {
    cartWritable.set(getCartData())
}
