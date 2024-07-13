import type {ShoppingCartProductState} from '$lib/frontend/stores/shoppingCartStore/ShoppingCartProductState'
import {writable, type Writable} from 'svelte/store'
import {browser} from '$app/environment'

export const LOCAL_STORAGE_SHOPPING_CART_STORE_KEY = 'shopping-cart-store'

export const cart: Writable<Map<string, ShoppingCartProductState>> = writable(
    getInitialCartStoreValue(),
)

cart.subscribe((newShoppingCartStoreMapValue: Map<string, ShoppingCartProductState>) => {
    if (browser && localStorage) {
        localStorage.setItem(
            LOCAL_STORAGE_SHOPPING_CART_STORE_KEY,
            JSON.stringify(Array.from(newShoppingCartStoreMapValue)),
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

export function modifyProductSelectedQuantity(
    id: string,
    name: string,
    image: string,
    selectedQuantity: number,
    salePrice: number | undefined,
    regularPrice: number,
    percentage: number | null | undefined = null,
    isSoldByQuantities: boolean | undefined = false,
    unit: string | null = 'Unit',
    description: string | undefined = '',
): void {
    if (cart) {
        cart.update((previousCartValue: Map<string, ShoppingCartProductState>) => {
            const productState = previousCartValue.get(id)

            if (productState) {
                productState.selectedQuantity = selectedQuantity
                previousCartValue.set(id, productState)
            } else {
                previousCartValue.set(
                    id,
                    getNewProduct(id, name, image, selectedQuantity, regularPrice, salePrice, percentage, description, isSoldByQuantities, unit),
                )
            }

            return previousCartValue
        })
    }
}

export function increaseProductSelectedQuantity(
    id: string,
    name: string,
    image: string,
    regularPrice: number,
    salePrice: number | undefined = undefined,
    percentage: number | null | undefined = null,
    isSoldByQuantities: boolean | undefined = false,
    unit: string | null = 'Unit',
    description: string | undefined = '',
): void {
    if (cart) {
        cart.update((previousCartValue: Map<string, ShoppingCartProductState>) => {
            const productState = previousCartValue.get(id)

            if (productState) {
                productState.selectedQuantity++
                previousCartValue.set(id, productState)
            } else {
                previousCartValue.set(
                    id,
                    getNewProduct(id, name, image, 1, regularPrice, salePrice, percentage, description, isSoldByQuantities, unit),
                )
            }

            return previousCartValue
        })
    }
}

function getNewProduct(
    id: string,
    name: string,
    image: string,
    selectedQuantity: number,
    regularPrice: number,
    salePrice: number | undefined,
    percentage: number | null | undefined,
    description: string,
    isSoldByQuantities: boolean,
    unit: string | null) {

    return {
        id,
        name,
        image,
        selectedQuantity,
        price: salePrice ?? regularPrice,
        description,
        isSoldByQuantities,
        unit,
        promotion: {
            id: undefined,
            name: undefined,
            salePrice,
            percentage,
        }
    }
}

export function decreaseProductSelectedQuantity(id: string): void {
    if (cart) {
        cart.update((previousCartValue: Map<string, ShoppingCartProductState>) => {
            const productState = previousCartValue.get(id)

            if (productState && productState.selectedQuantity > 0) {
                productState.selectedQuantity--
                previousCartValue.set(id, productState)
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
