<script lang="ts">

    import OrderedItemSummaryCard from '$lib/frontend/components/OrderedItemSummaryCard.svelte'
    import type {OrderDetailsPresentation} from '$lib/frontend/presentations/OrderDetailsPresentation'

    export let order: OrderDetailsPresentation

</script>
<div class="p-4 m-2">
    <div class="w-full">
        <p>Voici les articles que vous avez commandé:</p>
        <div class="w-full py-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {#each order.items as item}
                <OrderedItemSummaryCard
                        id="{item.id}"
                        name={item.name}
                        image={item.image}
                        selectedQuantity={item.selectedQuantity}
                        price={item.price}
                />
            {/each}
        </div>
    </div>
    <p class="text-center">Cliquez <a class="text-amber-500" data-testid="track-delivery-link" href="{order.delivery.trackingUrl}" target="_blank">ici</a>
        <sup>
            <svg class="inline-block text-amber-500 text" {...$$props} height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5a5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1c0 1.71-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5a5 5 0 0 0-5-5"
                      fill="currentColor"/>
            </svg>
        </sup>
        pour suivre la livraison de votre commande.
    </p>
</div>
