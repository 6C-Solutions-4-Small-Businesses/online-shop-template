<script lang="ts">
    import {writable, type Writable} from 'svelte/store'
    import {
        cart,
        decreaseProductSelectedQuantityFromShoppingCartStore,
        upsertProductToShoppingCartStore
    } from '$lib/frontend/stores/shoppingCartStore/ShoppingCartStore'
    import {t} from '$translations/index'

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

<div class="min-w-[40px] h-[50px] px-1 bg-white rounded-bl-[10px] rounded-tr-[10px] shadow justify-center items-center gap-2.5 inline-flex"
     on:mouseenter={() => expanded = true}
     on:mouseleave={() => expanded = false}
     role="region"
>
    {#if expanded}
        <button class="px-2 py-1 focus:outline-none" on:click={decreaseSelectedQuantity}>
            <img class="h-5 w-5" src="remove-button.svg" alt={$t('collection.remove')}>
        </button>

        <input class="w-[78px] h-[30px] rounded-[10px] text-center bg-gray text-xs font-semibold"
               type="text" bind:value={$selectedQuantity}
               on:input={changeSelectedQuantity}/>
    {/if}

    <button class="px-2 py-1 focus:outline-none" on:click={increaseSelectedQuantity}>
        <img alt="add" class="h-6 w-6" src="add-button.svg">
    </button>

</div>