<script lang="ts">
    import CategoryProducts from '$lib/frontend/components/CategoryProducts.svelte'
    import {searchedProductResult, submittedProductName} from '$lib/frontend/stores/productStore/SearchProductStore'
    import {writable, type Writable} from 'svelte/store'
    import {fetchSearchedOffersResult} from '$lib/frontend/endpoints/OfferEndpoints'
    import type {PaginationPresentation} from '$lib/frontend/core/PaginationPresentation'
    import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'
    import {getToastStore} from '@skeletonlabs/skeleton'
    import {getErrorToastSettings} from '$lib/frontend/core/ToasterUtils'

    const isLoading: Writable<boolean> = writable(false)
    const toastStore = getToastStore()

    $: currentPage = $searchedProductResult ? $searchedProductResult.currentPage : 1

    async function fetchSearchedOffersResultHandler(
        productName: string,
        page?: number,
    ): Promise<void> {
        isLoading.set(true)

        const results: PaginationPresentation<OfferSummaryPresentation> | undefined = await fetchSearchedOffersResult(productName, page)

        if (results) {
            searchedProductResult.set(results)
        } else {
            toastStore.trigger(getErrorToastSettings('Nous sommes désolés, mais nous avons des difficultés à charger d\'autres produits. Veuillez réessayer plus tard.'))
        }

        isLoading.set(false)
    }

    async function goToNextPage(): Promise<void> {
        await fetchSearchedOffersResultHandler($submittedProductName, currentPage + 1)
    }
</script>

<div class="w-full max-w-full h-full bg-slate-100">
    {#if ($searchedProductResult && $searchedProductResult.totalPages > 0)}
        <div class="w-full h-[13%] md:h-[8%] flex justify-center items-center bg-white p-2">
    <span class="text-sm md:text-xl font-bold">Voici ce que nous avons trouvé pour <span
            class="text-orange-500">"{$submittedProductName}"</span></span>
        </div>
        <CategoryProducts
                products={$searchedProductResult.items}
                currentPage={$searchedProductResult.currentPage}
                totalPages={$searchedProductResult.totalPages}
                loadMoreHandler={goToNextPage}
                isLoading={$isLoading}
        />
    {:else}
        <div class="w-full h-[13%] md:h-[8%] flex justify-center items-center bg-white">
            <div class="flex justify-center items-center text-sm md:text-xl font-bold p-2 text-justify">
                Désolé, mais rien ne correspond à vos termes de recherche. Veuillez réessayer avec d'autres mots-clés.
            </div>
        </div>
    {/if}
</div>
