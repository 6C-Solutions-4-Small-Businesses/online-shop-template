<script lang="ts">
    import type {OfferSummaryPresentation} from "$lib/frontend/presentations/OfferSummaryPresentation";
    import ProductCard from "$lib/frontend/components/ProductCard.svelte";
    import ProductCardSkeleton from "$lib/frontend/components/ProductCardSkeleton.svelte";
    import {PRODUCT_DISPLAY_LIMIT} from "$lib/frontend/core/Helper";
    import {t} from "$translations/index";

    export let products: OfferSummaryPresentation[];
    export let currentPage: number;
    export let totalPages: number;
    export let isLoading: boolean;
    export let loadMoreHandler: () => void;
</script>
<div class="w-full h-full">
    <div class={'w-full py-6  px-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-6'}>
        {#each products as product}
            <ProductCard
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    regularPrice={product.price}
                    unit={product.unit}
                    isSoldByQuantities={product.isSoldByQuantities}
                    salePrice={product.promotion?.salePrice}
                    percentage={product.promotion?.percentage}
            />
        {/each}
        {#if (isLoading)}
            {#each Array(PRODUCT_DISPLAY_LIMIT) as _, index (index)}
                <ProductCardSkeleton/>
            {/each}
        {/if}
    </div>
    <div class="flex justify-center items-center bg-slate-100 h-24">
        <button class="uppercase w-36 h-9 rounded-[10px] text-white bg-primary font-semibold text-base disabled:bg-slate-600"
                data-testid="load-more-button"
                disabled={currentPage === totalPages}
                on:click={loadMoreHandler}>
            {$t('category-products.loadMore')}
        </button>
    </div>
</div>
