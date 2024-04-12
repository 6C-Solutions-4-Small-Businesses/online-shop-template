<script lang="ts">
    import type {OfferSummaryPresentation} from '$lib/frontend/presentations/OfferSummaryPresentation'
    import ProductDataTable from '$lib/frontend/components/ProductDataTable.svelte'
    import {executeAction} from '$lib/frontend/core/Helper'
    import {writable, type Writable} from 'svelte/store'
    import type {PageData} from './$types'
    import {API_BASE_ENDPOINT, BASE_HEADERS} from '$lib/frontend/Constants'
    import type {PaginationPresentation} from '$lib/frontend/core/PaginationPresentation'

    export let data: PageData

    let pageLimit = 18
    let loadedCategoryId: string
    let currentPage: number
    let currentCategoryOffers: PaginationPresentation<OfferSummaryPresentation>
    let currentCategoryButtonElement: HTMLElement
    const isLoading: Writable<boolean> = writable(false)

    $: {
        if (currentCategoryButtonElement) {
            currentCategoryButtonElement.focus()
        }
    }

    $: loadedCategoryId = data.id
    $: currentCategoryOffers = data.currentCategoryOffers
    $: currentPage = currentCategoryOffers.currentPage

    async function loadCategoryProducts(categoryId: string) {
        await executeAction(isLoading, fetchCategoryProducts, categoryId)
        loadedCategoryId = categoryId
    }

    async function fetchCategoryProducts(categoryId: string, page?: number): Promise<void> {
        const response = await fetch(`${API_BASE_ENDPOINT}/offer?categoryId=${categoryId}&${page ? `page=${page}&` : ''}limit=${pageLimit}`, {
            method: 'GET',
            headers: {...BASE_HEADERS}
        })

        currentCategoryOffers = await response.json()
    }

    async function goToNextPage(): Promise<void> {
        await executeAction(isLoading, fetchCategoryProducts, loadedCategoryId, currentPage + 1)
    }

    async function goToPreviousPage(): Promise<void> {
        await executeAction(isLoading, fetchCategoryProducts, loadedCategoryId, currentPage - 1)
    }

    async function goToLastPage(): Promise<void> {
        await executeAction(isLoading, fetchCategoryProducts, loadedCategoryId, currentCategoryOffers.totalPages)
    }

    async function goToFirstPage(): Promise<void> {
        await executeAction(isLoading, fetchCategoryProducts, loadedCategoryId, 1)
    }
</script>

<div class="w-full max-w-full h-full bg-slate-100">
    <div class="w-full h-[13%] md:h-[8%] flex items-center bg-white">
        <div class="w-full flex space-x-4 categories-box overflow-x-scroll overflow-y-auto px-5">
            {#each data.categories as category}
                {#if (loadedCategoryId === category.id)}
                    <button
                            class={`whitespace-nowrap px-5 py-1.5 border border-white text-white bg-orange-500 outline-none rounded-sm`}
                            bind:this={currentCategoryButtonElement}
                    >{category.name}</button>
                {:else }
                    <button
                            class={`whitespace-nowrap px-5 py-1.5 border border-orange-500 text-orange-500 rounded-sm`}
                            on:click={()=> loadCategoryProducts(category.id)}
                    >{category.name}</button>
                {/if}
            {/each}
        </div>
    </div>
    {#if (currentCategoryOffers && currentCategoryOffers.totalPages > 0)}
        <ProductDataTable
                products={currentCategoryOffers.items}
                currentPage={currentCategoryOffers.currentPage}
                totalPages={currentCategoryOffers.totalPages}
                isLoading={$isLoading}
                on:first={goToFirstPage}
                on:next={goToNextPage}
                on:previous={goToPreviousPage}
                on:last={goToLastPage}
        />
    {/if}
</div>

<style lang="css">
    .categories-box {
        scrollbar-width: none;
    }

    .categories-box::-webkit-scrollbar {
        display: none;
    }
</style>
