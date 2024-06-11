<script lang="ts">
    import {getAbbreviatedUnit} from '$lib/frontend/core/Helper'
    import type {NewOfferPresentation} from '$lib/frontend/presentations/NewOfferPresentation'

    export let newOffer: NewOfferPresentation

    function getImagePreviewId() {
        return `${newOffer.name}-offer-preview-image`
    }

    function offerAbbreviatedUnit() {
        return getAbbreviatedUnit(newOffer.unit)
    }

    function getPriceFirstPart(price: number): string {
        const pricePart = price.toString().split('.')[0]

        return pricePart ? pricePart : '00'
    }

    function getPriceSecondPart(price: number): string {
        const pricePart = price.toFixed(2).toString().split('.')[1]

        return pricePart ? pricePart : '00'
    }
</script>

<div
        class="w-full bg-white shadow-2xl"
        role="none"
>
    <div class="relative">
        <div class="absolute flex w-24 h-24 top-0 text-white items-center visible z-10">
            <svg height="100" viewBox="0 0 490 490" width="100" x="0px" xml:space="preserve" y="0px">
                  <polygon points="0,0 490,0 0,490" style="fill: #09cc4c"/>
                </svg>
            <div class="absolute -rotate-45 origin-center top-6 right-4 w-full text-[1rem] text-center font-semibold">
                NOUVEAU
            </div>
        </div>
        <img
                id="{getImagePreviewId()}"
                class="w-full aspect-1"
                alt="{newOffer.name}"
                src="{newOffer.imageData}">
    </div>
    <div class="bottom-0 right-0 w-full flex justify-end">
        <div
                class="filter backdrop-blur-sm bg-green-300/40 font-sans w-full min-h-[4.2rem] justify-between flex items-center text-lg"
                role="region"
        >
            <div class="w-8/12 font-light text-xl px-2 text-wrap overflow-hidden text-overflow: ellipsis;">
                {newOffer.name}
            </div>
            <div class="w-4/12 flex flex-row text-xl">
                <span class="block">${getPriceFirstPart(newOffer.price)}
                    <sup>{getPriceSecondPart(newOffer.price)}</sup>
                </span>
                {#if offerAbbreviatedUnit()}
                    <span class="text-m block text-right pr-1"><sub>/ {offerAbbreviatedUnit()}</sub></span>
                {/if}
            </div>
        </div>
    </div>
</div>
