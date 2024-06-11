<script lang="ts">
    import {getAbbreviatedUnit} from '$lib/frontend/core/Helper'
    import type {OffersModificationPresentation} from '$lib/frontend/presentations/OffersModificationPresentation'
    import Image from '$lib/frontend/components/Image.svelte'

    const typeOfModificationToOffers = () => {
        if (offer.deleted) {
            return 'suppression'
        } else if (offer.id) {
            return 'modification'
        } else {
            return 'addition'
        }
    }
    const modificationTypeLabel = () => {
        switch (typeOfModificationToOffers()) {
            case 'suppression':
                return 'supprimé'
            case 'modification':
                return 'modifié'
            case 'addition':
                return 'ajouté'
        }
    }

    const modificationTypeLabelColor = () => {
        switch (typeOfModificationToOffers()) {
            case 'suppression':
                return '#ef4444'
            case 'modification':
                return '#3d83f7'
            case 'addition':
                return '#09cc4c'
        }
    }

    export let offer: OffersModificationPresentation

    function getImagePreviewId() {
        return `${offer.name}-offer-preview-image`
    }

    function offerAbbreviatedUnit() {
        return getAbbreviatedUnit(offer.unit)
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
                  <polygon points="0,0 490,0 0,490" style="{`fill: ${modificationTypeLabelColor()}`}"/>
                </svg>
            <div class="absolute -rotate-45 origin-center top-6 right-4 w-full text-[1rem] text-center font-semibold uppercase">
                {modificationTypeLabel()}
            </div>
        </div>
        {#if offer.imageData}
            <img
                id="{getImagePreviewId()}"
                data-testid="{getImagePreviewId()}"
                class="w-full aspect-1"
                alt="{offer.name}"
                src="{offer.imageData}">
        {:else if offer.image}
            <Image
                    imageRemoteUrl="{offer.image}"
                    name="{offer.name ?? ''}"
                    classes="w-full aspect-1 object-contain"/>
        {/if}
    </div>
    <div class="bottom-0 right-0 w-full flex justify-end">
        <div
                class="filter backdrop-blur-sm bg-green-300/40 font-sans w-full min-h-[4.2rem] justify-between flex items-center text-lg"
                role="region"
        >
            <div class="w-8/12 font-light text-xl px-2 text-wrap overflow-hidden text-overflow: ellipsis;">
                {offer.name}
            </div>
            <div class="w-4/12 flex flex-row text-xl">
                <span class="block">${getPriceFirstPart(offer.price)}
                    <sup>{getPriceSecondPart(offer.price)}</sup>
                </span>
                {#if offerAbbreviatedUnit()}
                    <span class="text-m block text-right pr-1"><sub>/ {offerAbbreviatedUnit()}</sub></span>
                {/if}
            </div>
        </div>
    </div>
</div>
