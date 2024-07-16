<script lang="ts">
    import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'
    import CategoryProducts from '$lib/frontend/components/CategoryProducts.svelte'
    import {writable, type Writable} from 'svelte/store'
    import type {PageData} from './$types'
    import type {PaginationPresentation} from '$lib/frontend/core/PaginationPresentation'
    import {fetchCategoryProducts} from '$lib/frontend/endpoints/OfferEndpoints'
    import {getErrorToastSettings} from '$lib/frontend/core/ToasterUtils'
    import {getToastStore} from '@skeletonlabs/skeleton'
    import TitleBox from "$lib/frontend/components/TitleBox.svelte";
    import {t} from "$translations/index";
    import {browser} from "$app/environment";

    export let data: PageData

    let loadedCategoryId: string = data.id
    let loadedCategoryName: string = browser ? history.state["sveltekit:states"].name : $t('category.defaultCategoryName')
    let currentPage: number
    let offers: PaginationPresentation<OfferSummaryPresentation>

    const isLoading: Writable<boolean> = writable(false)
    const toastStore = getToastStore()

    $: offers = data.offers
    $: currentPage = offers.currentPage

    async function handleCategoryProductsFetch(categoryId: string, page?: number): Promise<void> {
        isLoading.set(true)

        const presentation = await fetchCategoryProducts(categoryId, page)

        if (presentation) {
            offers = {
                currentPage: presentation.currentPage,
                totalPages: presentation.totalPages,
                previousPage: presentation.previousPage,
                nextPage: presentation.nextPage,
                items: [...offers.items, ...presentation.items]
            }
        } else {
            toastStore.trigger(getErrorToastSettings($t('category.cannotLoadMore')))
        }

        isLoading.set(false)
    }

    async function loadMore(): Promise<void> {
        await handleCategoryProductsFetch(loadedCategoryId, currentPage + 1)
    }
</script>

<div class="w-full max-w-full min-h-screen bg-slate-100">
    <TitleBox value={loadedCategoryName}/>
    {#if (offers && offers.totalPages > 0)}
        <CategoryProducts
                products={offers.items}
                currentPage={offers.currentPage}
                totalPages={offers.totalPages}
                isLoading={$isLoading}
                loadMoreHandler={loadMore}
        />
    {/if}
</div>
