<script lang="ts">
    import ShoppingCartActions from '$lib/frontend/components/ShoppingCartActions.svelte'
    import Image from '$lib/frontend/components/Image.svelte'
    import {writable, type Writable} from "svelte/store";
    import {
        cart,
        decreaseProductSelectedQuantity,
        increaseProductSelectedQuantity,
        modifyProductSelectedQuantity
    } from "$lib/frontend/stores/shoppingCartStore/ShoppingCartStore";

    export let id: string
    export let name: string
    export let image: string
    export let regularPrice: number
    export let isSoldByQuantities: boolean
    export let unit: string | null
    export let salePrice: number | undefined  = undefined
    export let percentage: number | null | undefined = null

    let isProductHovered = false
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

<div class="relative h-[326px] p-4 bg-white rounded-[10px] shadow flex-col justify-start items-start gap-[25px]"
     on:focus={() => isProductHovered = true}
     on:mouseleave={()=> isProductHovered = false}
     on:mouseover={()=> isProductHovered = true}
     role="none"
>
    <div class={`${isProductHovered ? 'w-full absolute flex justify-end top-0 right-0' : 'hidden'}`}>
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

    <div class="w-[238px] h-[200px] mt-10 self-center justify-between items-center flex mx-auto">
        <Image imageRemoteUrl="{image}" name={name} classes="w-[238px] h-[200px] object-contain"/>
    </div>

    <div class="w-full flex-col justify-start items-start gap-2.5 flex mt-6">
        <div class="w-full justify-between items-center flex">
            <div class="text-accent pl-1.5 overflow-hidden max-h-[35px]">{name}</div>

            <div class="text-primary text-15 flex ml-3">
                {regularPrice / 100 >= 1 ? "$" : "¢"}{regularPrice / 100}
            </div>
        </div>
    </div>
</div>
