<script lang="ts">
    import ShoppingCartActions from '$lib/frontend/components/ShoppingCartActions.svelte'
    import {getAbbreviatedUnit} from "$lib/frontend/core/Helper";
    import Image from '$lib/frontend/components/Image.svelte'
    import PromotionSticker from '$lib/frontend/components/PromotionSticker.svelte'

    export let id: string
    export let name: string
    export let image: string
    export let regularPrice: number
    export let isSoldByQuantities: boolean
    export let unit: string | null
    export let salePrice: number | undefined | null = null
    export let percentage: number | null | undefined = null
    
    function getPriceFirstPart(price: number | undefined | null): string {
        const pricePart = price ? (price / 100).toString().split('.')[0] : null

        return pricePart ? pricePart : '00'
    }

    function getPriceSecondPart(price: number | undefined | null): string {
        const pricePart = price ? (price / 100).toFixed(2).toString().split('.')[1] : null

        return pricePart ? pricePart : '00'
    }
</script>

<div class="relative h-[326px] p-4 bg-white rounded-[10px] shadow flex-col justify-start items-start gap-[25px] inline-flex">
    {#if (percentage)}
        <PromotionSticker percentage={percentage}/>
    {/if}

    <div class="w-[238px] h-[200px] mt-10 self-center justify-between items-center flex">
        <Image imageRemoteUrl="{image}" name={name} classes="w-[238px] h-[200px] object-contain scale"/>
    </div>

    <div class="w-full absolute flex justify-end top-0 right-0">
        <ShoppingCartActions
                image={image}
                name={name}
                productId={id}
                regularPrice={regularPrice}
                salePrice={salePrice}
        />
    </div>

    <div class="w-full flex-col justify-start items-start gap-2.5 flex">
        <div class="w-full justify-between items-center flex">
            <div class="text-accent pl-1.5 overflow-hidden max-h-[35px]">{name}</div>

            {#if (!percentage)}
                <div class="text-primary text-15 flex ml-3">
                    CAD${getPriceFirstPart(regularPrice)}.{getPriceSecondPart(regularPrice)}
                    {#if (isSoldByQuantities)}
                        <span>/{getAbbreviatedUnit(unit)}</span>
                    {/if}
                </div>
            {:else}
                <div class="flex-col justify-start items-end gap-0.5 inline-flex">
                    <div class="flex items-end leading-normal flex-col">
                        <span class="text-primary text-[8px] line-through">
                            CAD${getPriceFirstPart(regularPrice)}.{getPriceSecondPart(regularPrice)}
                        </span>
                        <div class="text-center text-error text-15 font-bold flex flex-row ml-3">
                            CAD${getPriceFirstPart(salePrice)}.{getPriceSecondPart(salePrice)}
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