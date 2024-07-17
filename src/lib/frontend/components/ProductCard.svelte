<script lang="ts">
    import ShoppingCartActions from '$lib/frontend/components/ShoppingCartActions.svelte'
    import {getAbbreviatedUnit} from '$lib/frontend/core/Helper'
    import Image from '$lib/frontend/components/Image.svelte'
    import PromotionSticker from '$lib/frontend/components/PromotionSticker.svelte'
    import {
        cart,
        decreaseProductSelectedQuantity,
        increaseProductSelectedQuantity,
        modifyProductSelectedQuantity
    } from '$lib/frontend/stores/shoppingCartStore/ShoppingCartStore.js'
    import {writable, type Writable} from "svelte/store";

    export let id: string
    export let name: string
    export let image: string
    export let regularPrice: number
    export let isSoldByQuantities: boolean
    export let unit: string | null
    export let salePrice: number | undefined  = undefined
    export let percentage: number | null | undefined = null

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
                regularPrice,
                percentage,
                isSoldByQuantities,
                unit
            )
        }
    }
</script>

<div class="relative h-[326px] p-4 bg-white rounded-10 shadow flex-col justify-start items-start gap-[25px] inline-flex">
    {#if (percentage)}
        <PromotionSticker percentage={percentage}/>
    {/if}

    <div class="w-[238px] h-[200px] mt-10 self-center justify-between items-center flex">
        <Image classes="w-[238px] h-[200px] object-contain scale" imageRemoteUrl="{image}" name={name}/>
    </div>

    <div class="w-full absolute flex justify-end top-0 right-0">
        <ShoppingCartActions
                changeSelectedQuantityHandler={changeSelectedQuantity}
                decreaseSelectedQuantityHandler={() => decreaseProductSelectedQuantity(id)}
                increaseSelectedQuantityHandler={() =>
                    increaseProductSelectedQuantity(
                        id,
                        name,
                        image,
                        regularPrice,
                        salePrice,
                        percentage,
                        isSoldByQuantities,
                        unit
                        )
                }
                selectedQuantity={$selectedQuantity}
        />
    </div>

    <div class="w-full flex-col justify-start items-start gap-2.5 flex">
        <div class="w-full justify-between items-center flex">
            <div class="text-accent pl-1.5 overflow-hidden max-h-[35px]">{name}</div>

            {#if (!percentage)}
                <div class="text-primary text-15 flex ml-3">
                    CAD${(regularPrice / 100).toFixed(2)}
                    {#if (isSoldByQuantities)}
                        <span>/{getAbbreviatedUnit(unit)}</span>
                    {/if}
                </div>
            {:else}
                <div class="flex-col justify-start items-end gap-0.5 inline-flex">
                    <div class="flex items-end leading-normal flex-col">
                        <span class="text-primary text-[8px] line-through">
                            CAD${(regularPrice / 100).toFixed(2)}
                        </span>
                        <div class="text-center text-sale-price text-15 font-bold flex flex-row ml-3">
                            CAD${salePrice && (salePrice / 100).toFixed(2)}
                            {#if (isSoldByQuantities)}
                                <span>/{getAbbreviatedUnit(unit)}</span>
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
