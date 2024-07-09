import type {ShoppingCartProductState} from '$lib/frontend/stores/shoppingCartStore/ShoppingCartProductState'
import {writable, type Writable} from 'svelte/store'
import {browser} from '$app/environment'

export const LOCAL_STORAGE_SHOPPING_CART_STORE_KEY = 'shopping-cart-store'

export const cart: Writable<Map<string, ShoppingCartProductState>> = writable(
    getInitialCartStoreValue()
)

cart.subscribe((newShoppingCartStoreMapValue: Map<string, ShoppingCartProductState>) => {
    if (browser && localStorage) {
        localStorage.setItem(
            LOCAL_STORAGE_SHOPPING_CART_STORE_KEY,
            JSON.stringify(Array.from(newShoppingCartStoreMapValue))
        )
    }
})

function getInitialCartStoreValue(): Map<string, ShoppingCartProductState> {
    if (browser && localStorage) {
        const localStorageCartStore = localStorage.getItem(LOCAL_STORAGE_SHOPPING_CART_STORE_KEY)
        if (localStorageCartStore) {
            const parsedLocalStorageCartStore = JSON.parse(localStorageCartStore)
            if (parsedLocalStorageCartStore && Object.keys(parsedLocalStorageCartStore).length > 0) {
                return new Map(parsedLocalStorageCartStore)
            }
        }
    }
    return new Map<string, ShoppingCartProductState>()
}

export function upsertProductToShoppingCartStore(
    id: string,
    name: string,
    image: string,
    selectedQuantity: number,
    price: number,
    description: string | undefined = '',
    isSoldByQuantities: boolean | undefined = false,
    unit: string | undefined = 'Unit',
): void {
    if (cart) {
        cart.update((previousCartValue: Map<string, ShoppingCartProductState>) => {
            if (previousCartValue.has(id)) {
                const state = previousCartValue.get(id)
                // @ts-ignore
                state.selectedQuantity = selectedQuantity
                // @ts-ignore
                previousCartValue.set(id, state)
            } else {
                previousCartValue.set(id, {
                    id,
                    name,
                    image,
                    selectedQuantity,
                    price,
                    description,
                    isSoldByQuantities,
                    unit,
                })
            }

            return previousCartValue
        })
    }
}

export function decreaseProductSelectedQuantityFromShoppingCartStore(
    id: string,
    selectedQuantity: number
): void {
    if (cart) {
        cart.update((previousCartValue: Map<string, ShoppingCartProductState>) => {
            if (previousCartValue.has(id)) {
                const state = previousCartValue.get(id)
                // @ts-ignore
                state.selectedQuantity = selectedQuantity
                // @ts-ignore
                previousCartValue.set(id, state)
            }

            return previousCartValue
        })
    }
}

export function clearShoppingCartStore(): void {
    if (cart) {
        cart.set(new Map())
        localStorage?.removeItem(LOCAL_STORAGE_SHOPPING_CART_STORE_KEY)
    }
}
