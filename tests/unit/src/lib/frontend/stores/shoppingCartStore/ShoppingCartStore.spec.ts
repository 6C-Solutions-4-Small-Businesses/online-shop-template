import {
    cart,
    clearShoppingCartStore,
    increaseProductSelectedQuantity,
    LOCAL_STORAGE_SHOPPING_CART_STORE_KEY,
    modifyProductSelectedQuantity
} from '$lib/frontend/stores/shoppingCartStore/ShoppingCartStore'
import {mock} from "vitest-mock-extended";
import type {ShoppingCartProductState} from "$lib/frontend/stores/shoppingCartStore/ShoppingCartProductState";
import {afterEach} from "vitest";

describe('ShoppingCartStore', () => {

    describe('increaseProductSelectedQuantity', () => {

        it('should increase the quantity of an existing product', () => {
            const productId = 'product-1'
            const initialCart = new Map([[productId, mock<ShoppingCartProductState>({selectedQuantity: 5})]])
            cart.set(initialCart)

            increaseProductSelectedQuantity(productId, 'Product 1', 'image.png', 100)

            const unsubscribe = cart.subscribe((value) => {
                expect(value.get(productId)?.selectedQuantity).toBe(6)
            })
            unsubscribe()
        })

        it('should add a new product if it does not exist in the cart', () => {
            const productId = 'product-2'
            cart.set(new Map())

            increaseProductSelectedQuantity(productId, 'Product 2', 'image.png', 100)


            const unsubscribe = cart.subscribe((value) => {
                expect(value.get(productId)?.selectedQuantity).toBe(1)
            })
            unsubscribe()
        })
    })

    describe('modifyProductSelectedQuantity', () => {

        it('should modify the quantity of an existing product', () => {
            const productId = 'product-1'
            const initialCart = new Map([[productId, mock<ShoppingCartProductState>({selectedQuantity: 1})]])
            cart.set(initialCart)

            modifyProductSelectedQuantity(productId, 'Product 1', 'image.png', 5, 100, 250)

            const unsubscribe = cart.subscribe((value) => {
                expect(value.get(productId)?.selectedQuantity).toBe(5)
            })
            unsubscribe()
        })

        it('should add a new product if it does not exist in the cart', () => {
            const productId = 'product-2'
            cart.set(new Map())

            modifyProductSelectedQuantity(productId, 'Product 2', 'image.png', 4, 100, 250)

            const unsubscribe = cart.subscribe((value) => {
                expect(value.get(productId)?.selectedQuantity).toBe(4)
            })
            unsubscribe()
        })
    })

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
