<script lang="ts">
    import RemoveShoppingCartIcon from '$lib/frontend/components/icons/RemoveShoppingCartIcon.svelte'
    import AddShoppingCartIcon from '$lib/frontend/components/icons/AddShoppingCartIcon.svelte'

    export let full: boolean = false
    export let width: number = 40
    export let height: number = 50
    export let selectedQuantity: number
    export let increaseSelectedQuantityHandler: () => void
    export let changeSelectedQuantityHandler: (event: Event) => void
    export let decreaseSelectedQuantityHandler: () => void

    let expanded = false
</script>

<div class={`px-1 bg-white rounded-bl-[10px] rounded-tr-[10px] ${full ? `w-[${width}px] h-[${height}px]` : `min-w-[${width}px] h-[${height}px] shadow`} justify-center items-center gap-2.5 inline-flex`}
     on:mouseenter={() => expanded = true}
     on:mouseleave={() => expanded = false}
     role="region"
>
    {#if (expanded || full)}
        <button class="px-2 py-1 focus:outline-none" on:click={decreaseSelectedQuantityHandler}>
            <RemoveShoppingCartIcon classNames="h-5 w-5"/>
        </button>

        <input class="w-[78px] h-[30px] rounded-[10px] text-center bg-neutral-200 text-xs font-semibold"
               type="text"
               bind:value={selectedQuantity}
               on:input={changeSelectedQuantityHandler}/>
    {/if}

    <button class="px-2 py-1 focus:outline-none" on:click={increaseSelectedQuantityHandler}>
        <AddShoppingCartIcon classNames="h-6 w-6"/>
    </button>

</div>
