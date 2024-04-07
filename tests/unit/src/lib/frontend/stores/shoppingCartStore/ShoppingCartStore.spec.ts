import {
    cart,
    clearShoppingCartStore,
    LOCAL_STORAGE_SHOPPING_CART_STORE_KEY
} from '$lib/frontend/stores/shoppingCartStore/ShoppingCartStore'
import {afterEach} from 'vitest'

describe('ShoppingCartStore', () => {

    describe('clearShoppingCartStore', () => {

        it('should set the cart store to empty array', () => {

            const spy = vi.spyOn(cart, 'set')

            clearShoppingCartStore()

            expect(spy).toHaveBeenCalledWith(new Map())
        })

        it('should remove the cart items serialized in the local storage', () => {

            localStorage.setItem(LOCAL_STORAGE_SHOPPING_CART_STORE_KEY, 'some value')
            expect(localStorage.getItem(LOCAL_STORAGE_SHOPPING_CART_STORE_KEY)).toBeDefined()

            clearShoppingCartStore()

            expect(localStorage.getItem(LOCAL_STORAGE_SHOPPING_CART_STORE_KEY)).toBeNull()
        })
    })

    afterEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })
})
