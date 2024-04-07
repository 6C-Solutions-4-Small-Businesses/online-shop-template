<script lang="ts">
    import CartIcon from '~icons/mdi/cart-plus'
    import {writable, type Writable} from 'svelte/store'
    import {
        cart,
        decreaseProductSelectedQuantityFromShoppingCartStore,
        upsertProductToShoppingCartStore
    } from '$lib/frontend/stores/shoppingCartStore/ShoppingCartStore'

    export let productId: string
    export let image: string
    export let name: string
    export let regularPrice: number
    export let salePrice: number | undefined | null = null

    let expanded = false
    let selectedQuantity: Writable<number> = writable(cart && $cart.has(productId) ? $cart.get(productId)?.selectedQuantity : 0)

    function changeSelectedQuantity(event: Event): void {
        const quantity = parseInt((event.target as HTMLInputElement).value)
        if (!isNaN(quantity)) {
            selectedQuantity.set(quantity)

            const price = salePrice ?? regularPrice

            upsertProductToShoppingCartStore(productId, name, image, $selectedQuantity, price)
        }
    }

    function increaseSelectedQuantity(): void {
        selectedQuantity.update((previousValue: number) => ++previousValue)

        const price = salePrice ?? regularPrice

        upsertProductToShoppingCartStore(productId, name, image, $selectedQuantity, price)
    }

    function decreaseSelectedQuantity(): void {
        selectedQuantity.update((previousValue: number) => {
            if (previousValue != 0) {
                return --previousValue
            }

            return previousValue
        })

        decreaseProductSelectedQuantityFromShoppingCartStore(productId, $selectedQuantity)
    }

</script>

<div
        class={`text-2xl  ${expanded ? 'w-4/5': 'w-2/12'} h-10 flex items-center justify-center text-red-500`}
        on:mouseenter={()=> expanded = true}
        on:mouseleave={()=> expanded = false}
        role="region"
>
    {#if expanded}
        <button
                class="w-3/12 h-full bg-red-100 border border-y-red-500 border-l-red-500"
                on:click={decreaseSelectedQuantity}
        >-
        </button>
        <input
                class="w-5/12 h-full focus:outline-none outline-none text-black text-center rounded-none border border-red-500"
                type="text"
                bind:value={$selectedQuantity}
                on:input={changeSelectedQuantity}
        >
        <button
                class="w-3/12 h-full bg-red-100 border border-y-red-500"
                on:click={increaseSelectedQuantity}
        >+
        </button>
    {/if}
    <div
            class={`border border-red-500 ${ expanded ? 'w-3/12' : 'w-full'} h-full flex justify-center items-center bg-red-100`}
    >
        <CartIcon/>
    </div>
</div>