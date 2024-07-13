<script lang="ts">
    import Image from '$lib/frontend/components/Image.svelte'
    import ShoppingCartActions from '$lib/frontend/components/ShoppingCartActions.svelte'
    import PromotionSticker from '$lib/frontend/components/PromotionSticker.svelte'
    import {
        cart,
        decreaseProductSelectedQuantity,
        increaseProductSelectedQuantity,
        modifyProductSelectedQuantity
    } from "$lib/frontend/stores/shoppingCartStore/ShoppingCartStore";
    import {writable, type Writable} from "svelte/store";

    export let id: string
    export let name: string
    export let image: string
    export let price: number
    export let percentage: number | null | undefined = null
    export let salePrice: number | null | undefined = null

    let selectedQuantity: Writable<number>
    $:selectedQuantity = writable(cart && $cart.has(id) ? $cart.get(id)?.selectedQuantity : 0)

    function changeSelectedQuantity(event: Event): void {
        const quantity = parseInt((event.target as HTMLInputElement).value)
        if (!isNaN(quantity)) {

            modifyProductSelectedQuantity(
                id,
                name,
                image,
                quantity,
                salePrice,
                price,
            )
        }
    }
</script>

<div class="relative w-[367px] h-[149px] p-[15px] flex gap-4 bg-white rounded-10">
    {#if (percentage)}
        <PromotionSticker percentage={percentage}/>
    {/if}
    <Image classes="w-[161px] h-[119px] object-contain scale" imageRemoteUrl="{image}" name={name}/>
    <div class="w-[161px] h-[119px] flex flex-col justify-between">
        <div class="w-full h-[12px] flex justify-end">
            <div class={`font-bold flex items-center text-sm ${percentage ? 'text-error' : 'text-primary'}`}>
                CAD${((salePrice ?? price) / 100).toFixed(2)}</div>
        </div>
        <div class="w-full h-[100px] flex flex-col justify-end gap-1">
            <div class="flex items-center w-full min-h-12 h-12">
                <p class="w-full text-stone text-16 leading-6 font-bold line-clamp-2">{name}</p>
            </div>
            <div class="w-full h-[50px] pb-2.5">
                <ShoppingCartActions
                        selectedQuantity={$selectedQuantity}
                        changeSelectedQuantityHandler={changeSelectedQuantity}
                        decreaseSelectedQuantityHandler={() => decreaseProductSelectedQuantity(id)}
                        full
                        height={50}
                        increaseSelectedQuantityHandler={() =>increaseProductSelectedQuantity(id,name,image,salePrice,price)}
                        width={161}
                />
            </div>
        </div>
    </div>
</div>