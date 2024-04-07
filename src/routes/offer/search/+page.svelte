<script lang="ts">
  import ProductDataTable from '$lib/frontend/components/ProductDataTable.svelte'
  import {executeAction} from '$lib/frontend/core/Helper'
  import {searchedProductResult, submittedProductName} from '$lib/frontend/stores/productStore/SearchProductStore'
  import {writable, type Writable} from 'svelte/store'
  import {fetchSearchedOffersResult} from '$lib/frontend/endpoints/OfferEndpoints'

  const isLoading: Writable<boolean> = writable(false);

  $: currentPage = $searchedProductResult ? $searchedProductResult.currentPage : 1;

  async function goToNextPage(): Promise<void> {
    await executeAction(isLoading, fetchSearchedOffersResult, $submittedProductName, currentPage + 1)
  }

  async function goToPreviousPage(): Promise<void> {
    await executeAction(isLoading, fetchSearchedOffersResult, $submittedProductName, currentPage - 1)
  }

  async function goToLastPage(): Promise<void> {
    await executeAction(isLoading, fetchSearchedOffersResult, $submittedProductName, $searchedProductResult.totalPages)
  }

  async function goToFirstPage(): Promise<void> {
    await executeAction(isLoading, fetchSearchedOffersResult, $submittedProductName)
  }
</script>

<div class="w-full max-w-full h-full bg-slate-100">
  {#if ($searchedProductResult && $searchedProductResult.totalPages > 0)}
    <div class="w-full h-[13%] md:h-[8%] flex justify-center items-center bg-white p-2">
    <span class="text-sm md:text-xl font-bold">Voici ce que nous avons trouvé pour <span
      class="text-orange-500">"{$submittedProductName}"</span></span>
    </div>
    <ProductDataTable
      products={$searchedProductResult.items}
      currentPage={$searchedProductResult.currentPage}
      totalPages={$searchedProductResult.totalPages}
      isLoading={$isLoading}
      on:first={goToFirstPage}
      on:next={goToNextPage}
      on:previous={goToPreviousPage}
      on:last={goToLastPage}
    />
  {:else}
    <div class="w-full h-[13%] md:h-[8%] flex justify-center items-center bg-white">
      <div class="flex justify-center items-center text-sm md:text-xl font-bold p-2 text-justify">
        Désolé, mais rien ne correspond à vos termes de recherche. Veuillez réessayer avec d'autres mots-clés.
      </div>
    </div>
  {/if}
</div>
