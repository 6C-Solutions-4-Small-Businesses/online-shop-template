<script lang="ts">
    import {goto} from "$app/navigation";
    import type {OfferSummaryPresentation} from "$lib/frontend/presentations/OfferSummaryPresentation";
    import ProductCard from "$lib/frontend/components/ProductCard.svelte";
    import {t} from '$translations/index'
    import ArrowLeftIcon from '$lib/frontend/components/icons/ArrowLeftIcon.svelte'

    export let id: string;
    export let name: string;
    export let products: OfferSummaryPresentation[];

    async function goToProductsPage(): Promise<void> {
        await goto(`/category/${id}`, {
            state: {
                name
            }
        });
    }
</script>

<div class="w-full pt-6 pb-10">
    <div class="px-10 py-5 justify-between items-center flex">
        <div class="text-primary text-2xl">{name}</div>

        <div class="justify-end items-center gap-2.5 flex">
            <button class="text-secondary flex items-center capitalize"
                    on:click={goToProductsPage}>
                {$t('collection.showMore')}

                <ArrowLeftIcon classNames="ml-2"/>
            </button>

            <div class="px-2 py-1 rounded-sm justify-center items-center gap-2.5 flex"></div>
        </div>
    </div>

    <div class="w-full p-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-6">
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
    </div>
</div>