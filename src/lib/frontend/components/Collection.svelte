<script lang="ts">
    import {goto} from "$app/navigation";
    import type {OfferSummaryPresentation} from "$lib/frontend/presentations/OfferSummaryPresentation";
    import ProductCard from "$lib/frontend/components/ProductCard.svelte";

    export let id: string;
  export let name: string;
  export let products: OfferSummaryPresentation[];

  async function goToProductsPage(): Promise<void> {
    await goto(`/category/${id}`);
  }

</script>

<div class="w-full pt-8 pb-8 bg-green-50">
  <div class="w-full flex justify-center text-3xl collection-name not-italic font-light mb-5">{name}</div>
  <div class="w-full p-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6">
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
          width="w-full"
          height="h-[22rem] sm:h-[19.5rem] md:h-[16.1rem] xl:h-[17rem]"
        />
    {/each}
  </div>
  <div class="w-full flex justify-center items-center text-xl collection-name not-italic font-light h-10 mt-5">
    <button class="hover:text-green-500" on:click={goToProductsPage}>Afficher Plus</button>
  </div>
</div>
<style lang="css">
    .collection-name {
        font-family: Roboto, sans-serif;
    }
</style>
