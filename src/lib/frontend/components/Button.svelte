<script lang="ts">
    import {writable, type Writable} from 'svelte/store'

    export let id: string
    export let classNames: string
    export let background = 'bg-white hover:bg-orange-50'
    export let border = 'border'
    export let text = 'text-black'
    export let disabled = false
    export let block = false
    export let onClick: () => Promise<void>

    const isProcessing: Writable<boolean> = writable(false)

    async function onClickHandler(): Promise<void> {
        isProcessing.set(true)
        await onClick()
        isProcessing.set(false)
    }

</script>

<button
        class={`${block ? '' : 'flex'} justify-around items-center uppercase rounded-sm font-bold ${classNames} ${disabled ? 'bg-slate-200  border border-gray-300 text-gray-500': `${background} ${border} ${text}`}`}
        data-testid="{id}"
        disabled={$isProcessing || disabled}
        id="{id}"
        on:click={onClickHandler}
>
    {#if ($isProcessing)}
        <svg
                class="animate-spin"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                stroke-width="2"
                stroke-linecap="round"
        >
            <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="#FFA500"
                    stroke-dasharray="30"
                    stroke-dashoffset="0"
            >
            </circle>
        </svg>
    {:else }
        <slot/>
    {/if}
</button>
