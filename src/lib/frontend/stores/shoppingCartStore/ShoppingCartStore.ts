import type {IShoppingCartProductState} from '$lib/frontend/stores/shoppingCartStore/IShoppingCartProductState'
import {writable, type Writable} from 'svelte/store'
import {browser} from '$app/environment'

export const LOCAL_STORAGE_SHOPPING_CART_STORE_KEY = 'shopping-cart-store'

export const cart: Writable<Map<string, IShoppingCartProductState>> = writable(
    getInitialCartStoreValue()
)

cart.subscribe((newShoppingCartStoreMapValue: Map<string, IShoppingCartProductState>) => {
    if (browser && localStorage) {
        localStorage.setItem(
            LOCAL_STORAGE_SHOPPING_CART_STORE_KEY,
            JSON.stringify(Array.from(newShoppingCartStoreMapValue))
        )
    }
})

function getInitialCartStoreValue(): Map<string, IShoppingCartProductState> {
    if (browser && localStorage) {
        const localStorageCartStore: any = localStorage.getItem(LOCAL_STORAGE_SHOPPING_CART_STORE_KEY)
        const parsedLocalStorageCartStore = JSON.parse(localStorageCartStore)
        if (parsedLocalStorageCartStore && Object.keys(parsedLocalStorageCartStore).length > 0) {
            return new Map<string, IShoppingCartProductState>(parsedLocalStorageCartStore)
        }
    }
    return new Map<string, IShoppingCartProductState>()
}

export function upsertProductToShoppingCartStore(
    id: string,
    name: string,
    image: string,
    selectedQuantity: number,
    price: number
): void {
    if (cart) {
        cart.update((previousCartValue: Map<string, IShoppingCartProductState>) => {
            if (previousCartValue.has(id)) {
                let state = previousCartValue.get(id)
                // @ts-ignore
                state.selectedQuantity = selectedQuantity
                // @ts-ignore
                previousCartValue.set(id, state)
            } else {
                previousCartValue.set(id, {
                    id,
                    name,
                    image,
                    selectedQuantity: selectedQuantity,
                    price
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
        cart.update((previousCartValue: Map<string, IShoppingCartProductState>) => {
            if (previousCartValue.has(id)) {
                let state = previousCartValue.get(id)
                // @ts-ignore
                state.selectedQuantity = selectedQuantity
                // @ts-ignore
                previousCartValue.set(id, state)
            }

            return previousCartValue
        })
    }
}

export function removeProductFromShoppingCartStore(id: string): void {
    if (cart) {
        cart.update((previousCartValue: Map<string, IShoppingCartProductState>) => {
            if (previousCartValue.has(id)) {
                previousCartValue.delete(id)
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
