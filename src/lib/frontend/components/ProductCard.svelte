<script lang="ts">
    import {getAbbreviatedUnit} from '$lib/frontend/core/Helper'
    import {quintOut} from 'svelte/easing'
    import {scale} from 'svelte/transition'
    import ShoppingCartActions from '$lib/frontend/components/ShoppingCartActions.svelte'

    export let id: string
    export let name: string
    export let image: string
    export let regularPrice: number
    export let isSoldByQuantities: boolean
    export let unit: string | null
    export let salePrice: number | undefined | null = null
    export let percentage: number | null | undefined = null
    export let width: string
    export let height: string

    let expanded = false

    function getPriceFirstPart(price: number | undefined | null): string {
        const pricePart = price ? (price / 100).toString().split('.')[0] : null

        return pricePart ? pricePart : '00'
    }

    function getPriceSecondPart(price: number | undefined | null): string {
        const pricePart = price ? (price / 100).toFixed(2).toString().split('.')[1] : null

        return pricePart ? pricePart : '00'
    }

</script>

<div class={`product-box relative ${width} ${height} bg-white shadow-2xl`}
     on:mouseenter={()=> expanded = true}
     on:mouseleave={()=> expanded = false}
     role="none"
>
    <div
            class={`absolute flex w-12 h-12 top-0 text-white items-center ${percentage ? 'visible z-10' : 'invisible'}`}>
        <svg height="100" viewBox="0 0 490 490" width="100" x="0px" xml:space="preserve" y="0px">
      <polygon points="0,0 490,0 0,490"
               style={`fill: ${percentage && percentage <= 10 ? "#a67b5b" : percentage && percentage <= 50 ? "#fd7e14" : "#ff0000" };`}/>
    </svg>
        <div class="absolute -rotate-45 origin-center top-1 right-2 w-full text-[1rem] text-center font-semibold">
            -{percentage}%
        </div>
    </div>
    <img alt={name}
         class="product-image object-contain absolute h-full w-full top-0 p-4"
         src={image}>
    <div class="w-full absolute flex justify-end">
        <ShoppingCartActions
                image={image}
                name={name}
                productId={id}
                regularPrice={regularPrice}
                salePrice={salePrice}
        />
    </div>
    <div
            class={`absolute bottom-0 right-0 w-full flex justify-end`}>
        <div
                class={`filter backdrop-blur-sm bg-green-300/40 font-sans ${expanded ? 'w-full min-h-[4.2rem] justify-between' : 'w-28 h-[2.5rem] justify-center'} flex items-center text-lg`}
                role="region"
        >
            {#if expanded}
                <div class={`w-8/12 font-light text-xl px-2 text-wrap overflow-hidden text-overflow: ellipsis;`}
                     in:scale={{ duration: 500, opacity: 0.5, start: 0.5, easing: quintOut }}>
                    {name}
                </div>
            {/if}
            <div class={`${expanded ? 'w-4/12' : 'w-full'} flex flex-col`}>
                {#if (percentage && expanded)}
                    <div class="w-full flex-col items-center justify-center text-xl font-semibold">
                        ${getPriceFirstPart(salePrice)}
                        <sup>{getPriceSecondPart(salePrice)}</sup>
                        {#if (isSoldByQuantities)}
                            <span class="text-m block text-right pr-1"><sub>/ {getAbbreviatedUnit(unit)}</sub></span>
                        {/if}
                    </div>
                {/if}
                <div
                        class={`w-full items-center justify-center ${expanded ? "flex-col" : "flex"} ${expanded && percentage ? "line-through text-lg font-light" : "text-xl font-semibold"}`}>
                    <span class="block">${getPriceFirstPart(regularPrice)}<sup>{getPriceSecondPart(regularPrice)}</sup></span>
                    {#if (isSoldByQuantities)}
                        <span class="{expanded ? 'text-m block text-right pr-1' : 'text-sm'}"><sub>/ {getAbbreviatedUnit(unit)}</sub></span>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="css">
    .product-image {
        aspect-ratio: 1;
    }

    .product-box:hover {
        box-shadow: 0 0 0 10px #16a34a inset;
    }
</style>
