<script lang="ts">
    import {
        decreaseProductSelectedQuantityFromShoppingCartStore,
        removeProductFromShoppingCartStore,
        upsertProductToShoppingCartStore
    } from '$lib/frontend/stores/shoppingCartStore/ShoppingCartStore'
    import DeleteIcon from '~icons/mdi/delete-outline'
    import Image from '$lib/frontend/components/Image.svelte'

    export let id: string
    export let name: string
    export let image: string
    export let selectedQuantity: number
    export let price: number

    function changeSelectedQuantity(event: Event) {
        const quantity = parseInt((event.target as HTMLInputElement).value)
        if (!isNaN(quantity)) {
            selectedQuantity = quantity
            upsertProductToShoppingCartStore(id, name, image, selectedQuantity, price)
        }
    }

    function increaseSelectedQuantity(): void {
        ++selectedQuantity
        upsertProductToShoppingCartStore(id, name, image, selectedQuantity, price)
    }

    function decreaseSelectedQuantity(): void {
        if (selectedQuantity != 0) {
            --selectedQuantity
            decreaseProductSelectedQuantityFromShoppingCartStore(id, selectedQuantity)
        }
    }

    function deleteShoppingCartProduct(): void {
        removeProductFromShoppingCartStore(id)
    }
</script>

<div class="h-32 xl:h-36 flex bg-white rounded-md shadow-md">
    <Image imageRemoteUrl="{image}" name={name} classes="w-2/5 p-2 h-full product-image object-contain"/>
    <div class="w-3/5 flex flex-col justify-between hover:bg-orange-100 pl-2">
        <div class="w-full flex justify-between">
            <div class="w-10/12 font-thin flex justify-center items-center">{name}</div>
            <button
                    class="w-9 h-9 flex justify-center items-center text-xl shadow-md border border-orange-500 text-red-500 bg-orange-100"
                    on:click={deleteShoppingCartProduct}
            >
                <DeleteIcon/>
            </button>
        </div>
        <div class="flex justify-between h-10">
            <div class="w-4/12 font-thin flex items-center">${(price / 100).toFixed(2)}</div>
            <div class="w-7/12 flex">
                <button
                        class="w-3/12 text-2xl text-red-500 bg-orange-100"
                        on:click={decreaseSelectedQuantity}
                >-
                </button>
                <input
                        bind:value={selectedQuantity}
                        class="w-6/12 focus:outline-none text-black text-center rounded-none"
                        on:input={changeSelectedQuantity}
                        type="text"
                >
                <button
                        class="w-3/12 text-2xl text-red-500 bg-orange-100"
                        on:click={increaseSelectedQuantity}
                >+
                </button>
            </div>
        </div>
    </div>
</div>
