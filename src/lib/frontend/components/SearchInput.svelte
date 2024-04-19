<script lang="ts">
    import {goto} from '$app/navigation'
    import {
        searchedProductName,
        searchedProductResult,
        submittedProductName,
    } from '$lib/frontend/stores/productStore/SearchProductStore'
    import {fetchSearchedOffersResult} from '$lib/frontend/endpoints/OfferEndpoints'
    import type {PaginationPresentation} from '$lib/frontend/core/PaginationPresentation'
    import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'
    import {getToastStore} from '@skeletonlabs/skeleton'
    import {getErrorToastSettings} from '$lib/frontend/core/ToasterUtils'

    export let inputId: string
    export let buttonId: string
    export let width: string

    const toastStore = getToastStore()

    let isSearchButtonDisabled: boolean = false

    $: isSearchButtonDisabled = !$searchedProductName || $searchedProductName === '' || $searchedProductName.length <= 1

    async function navigateToProductSearchPage(): Promise<void> {
        const results: PaginationPresentation<OfferSummaryPresentation> | undefined = await fetchSearchedOffersResult($searchedProductName)

        if (results) {
            searchedProductResult.set(results)
            submittedProductName.set($searchedProductName)
            await goto('/offer/search')
        } else {
            toastStore.trigger(getErrorToastSettings('Nous sommes désolés, mais nous avons des difficultés à rechercher des produits. Veuillez réessayer plus tard.'))
        }
    }

    async function onEnterPressNavigateToProductSearchPage(event: KeyboardEvent): Promise<void> {
        if (event.code === 'Enter') {
            await navigateToProductSearchPage()
        }
    }

    function resetInput(): void {
        searchedProductName.set('')
    }
</script>

<div class={`${width} h-10 flex justify-center`}>
    <div class="relative w-8/12">
        <input
                bind:value={$searchedProductName}
                class="w-full h-full focus:outline-none text-black text-left pl-2 rounded-none border border-l-gray-500 border-t-gray-500 border-b-gray-500"
                data-testid={inputId}
                on:keypress={onEnterPressNavigateToProductSearchPage}
                placeholder="Chercher un produit"
                type="text"
        >
        {#if $searchedProductName}
            <button
                    class="absolute w-6 h-6 flex items-center justify-center text-sm text-white right-3 bottom-2 border rounded-full bg-orange-500 pb-0.5 shadow-md"
                    on:click={resetInput}
            >x
            </button>
        {/if}
    </div>
    <button
            class={`w-3/12 h-full text-sm xl:text-lg text-white ${isSearchButtonDisabled ? "bg-slate-500": "bg-orange-500"} p-1`}
            data-testid={buttonId}
            disabled={isSearchButtonDisabled}
            on:click={navigateToProductSearchPage}
    >Rechercher
    </button>
</div>
