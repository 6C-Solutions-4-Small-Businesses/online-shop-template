<script lang="ts">
    import {goto} from '$app/navigation'
    import {searchedProductName, submittedProductName} from '$lib/frontend/stores/productStore/SearchProductStore'
    import {fetchSearchedOffersResult} from '$lib/frontend/endpoints/OfferEndpoints'

    export let inputId: string
    export let buttonId: string
    export let width: string

    let isSearchButtonDisabled: boolean = false

    $: isSearchButtonDisabled = !$searchedProductName || $searchedProductName === "" || $searchedProductName.length <= 1

    async function navigateToProductSearchPage(): Promise<void> {
        await fetchSearchedOffersResult($searchedProductName)
        submittedProductName.set($searchedProductName)
        await goto("/offer/search")
    }

    async function onEnterPressNavigateToProductSearchPage(event: KeyboardEvent): Promise<void> {
        if (event.code === "Enter") {
            await navigateToProductSearchPage()
        }
    }

    function resetInput(): void {
        searchedProductName.set("")
    }
</script>

<div class={`${width} h-10 flex`}>
    <div class="relative w-8/12">
        <input
                data-testid={inputId}
                bind:value={$searchedProductName}
                class="w-full h-12 focus:outline-transparent text-black text-left pl-2 rounded-l-lg border-none"
                on:keypress={onEnterPressNavigateToProductSearchPage}
                placeholder="Chercher un produit"
                type="text"
        >
        <!--{#if $searchedProductName}-->
        <!--    <button-->
        <!--            class="absolute w-6 h-6 flex items-center justify-center text-sm text-white right-3 bottom-2 border rounded-full bg-orange-500 pb-0.5 shadow-md"-->
        <!--            on:click={resetInput}-->
        <!--    >x-->
        <!--    </button>-->
        <!--{/if}-->
    </div>
    <button
            data-testid={buttonId}
            class='h-12 text-sm xl:text-lg text-white p-1 rounded-r-lg bg-white'
            disabled={isSearchButtonDisabled}
            on:click={navigateToProductSearchPage}
    >
        <img src="user.svg" alt="search" class={`rounded-r-lg py-1.5 px-2.5 h-10 text-black ${isSearchButtonDisabled ? "bg-teal-950": "bg-teal-950"} p-1`}>
    </button>
</div>
