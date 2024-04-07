<script lang="ts">
  import type {OfferSummaryPresentation} from "$lib/frontend/presentations/OfferSummaryPresentation";
  import ProductCard from "$lib/frontend/components/ProductCard.svelte";
  import ProductCardShadow from "$lib/frontend/components/ProductCardShadow.svelte";
  import {PRODUCT_DISPLAY_LIMIT} from "$lib/frontend/core/Helper";
  import {createEventDispatcher} from "svelte";
  import DoubleLeftChevronIcon from "~icons/mdi/chevron-double-left";
  import DoubleRightChevronIcon from "~icons/mdi/chevron-double-right";
  import LeftChevronIcon from "~icons/mdi/chevron-left";
  import RightChevronIcon from "~icons/mdi/chevron-right";

  export let products: OfferSummaryPresentation[];
  export let currentPage: number;
  export let totalPages: number;
  export let isLoading: boolean;

  const dispatch = createEventDispatcher();

  function goToNextPage(): void {
    dispatch("next");
  }

  function goToPreviousPage(): void {
    dispatch("previous");
  }

  function goToLastPage(): void {
    dispatch("last");
  }

  function goToFirstPage(): void {
    dispatch("first");
  }
</script>
<div class="w-full h-full">
  {#if (isLoading)}
    <div class="w-full h-[87%]  md:h-[86%] grid p-4 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:grid-rows-3 overflow-y-scroll xl:overflow-hidden">
      {#each Array(PRODUCT_DISPLAY_LIMIT) as _, index (index)}
        <ProductCardShadow/>
      {/each}
    </div>
  {:else }
    <div
      class={`w-full ${totalPages === 1 ? "h-[87%]" : "h-[75%]"} md:h-[86%] grid p-4 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:grid-rows-3 overflow-y-scroll xl:overflow-hidden`}>
      {#each products as product}
        <ProductCard
          id={product.id}
          name={product.name}
          image={product.image}
          regularPrice={product.price}
          unit={product.unit}
          isSoldByQuantities={product.isSoldByQuantities}
          width="w-full"
          height="h-[20.5rem] sm:h-[19.5rem] md:h-[16.1rem] xl:h-[14rem]"
        />
      {/each}
    </div>
    <div
      class={`h-[12%] md:h-[6%] bg-white flex justify-center xl:justify-end ${totalPages === 1 ? "invisible sm:visible" : "visible"}`}>
      <div class="flex w-full xl:w-1/4 space-x-2 xl:pr-5 justify-center xl:justify-end items-center">
        <button
          class="w-14 h-12 xl:w-10 xl:h-8 flex justify-center items-center border border-orange-500 text-2xl xl:text-lg text-orange-500 font-thin rounded-sm disabled:border disabled:border-gray-500 disabled:text-gray-500"
          disabled={currentPage === 1}
          on:click={goToFirstPage}
        >
          <DoubleLeftChevronIcon />
        </button>
        <button
          class="w-14 h-12 xl:w-10 xl:h-8 flex justify-center items-center border border-orange-500 text-2xl xl:text-lg text-orange-500 font-thin rounded-sm disabled:border disabled:border-gray-500 disabled:text-gray-500"
          disabled={currentPage === 1}
          on:click={goToPreviousPage}
        >
          <LeftChevronIcon />
        </button>
        <button
          class="w-14 h-12 xl:w-10 xl:h-8 border border-white text-white bg-orange-500 text-lg xl:text-sm font-thin rounded-sm">
          {currentPage}
        </button>
        <div class="w-14 h-12 xl:w-10 xl:h-8 flex justify-center items-center font-thin text-lg text-gray-500">
          of {totalPages}</div>
        <button
          class="w-14 h-12 xl:w-10 xl:h-8 flex justify-center items-center border border-orange-500 text-2xl xl:text-lg text-orange-500 font-thin rounded-sm disabled:border disabled:border-gray-500 disabled:text-gray-500"
          disabled={currentPage === totalPages}
          on:click={goToNextPage}
        >
          <RightChevronIcon />
        </button>
        <button
          class="w-14 h-12 xl:w-10 xl:h-8 flex justify-center items-center border border-orange-500 text-2xl xl:text-lg text-orange-500 font-thin rounded-sm disabled:border disabled:border-gray-500 disabled:text-gray-500"
          disabled={currentPage === totalPages}
          on:click={goToLastPage}
        >
          <DoubleRightChevronIcon />
        </button>
      </div>
    </div>
  {/if}
</div>
