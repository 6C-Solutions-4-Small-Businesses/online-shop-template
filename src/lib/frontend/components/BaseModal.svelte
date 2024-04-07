<script lang="ts">
    import Button from '$lib/frontend/components/Button.svelte'
    import type {SvelteComponent} from 'svelte'
    import CloseCircleIcon from '~icons/mdi/close-circle'

    export let title: string | undefined
    export let body: string | undefined
    export let isFull: boolean = false
    export let parent: SvelteComponent
    export let buttonTextCancel: string | undefined
    export let buttonTextSubmit: string | undefined
    export let submitButtonDisabled: boolean = false
    export let onSubmitClickHandler: () => Promise<void>
</script>

<div class={`bg-white ${isFull ? 'w-screen h-screen overflow-scroll pb-5' : 'w-full'} flex flex-col gap-7 items-center rounded-md`}>
    <header
            class=" w-full flex  justify-between items-center text-md font-bold uppercase bg-green-50 h-14 text-center p-3 text-black rounded-t-md">
        <p>{title }</p>
        <button class="w-8 h-8 flex items-center justify-center rounded-full" on:click={parent.onClose}>
            <CloseCircleIcon/>
        </button>
    </header>
    {#if body}
        <p class="w-11/12 text-start text-slate-600">{body}</p>
    {/if}
    <slot/>
    <footer class="w-11/12 flex flex-col md:flex-row md:justify-between gap-4 mb-5">
        <Button
                background="bg-white hover:bg-orange-50"
                classNames="w-full md:w-2/3 btn {parent.buttonNeutral}  h-12"
                id="cancel-button"
                onClick={parent.onClose}>
            {buttonTextCancel}
        </Button>
        <Button
                background="bg-orange-50 hover:bg-white"
                border="border border-orange-500"
                classNames="w-full md:w-2/3 shadow-sm h-12 btn {parent.buttonPositive}"
                disabled={submitButtonDisabled}
                id="continue-button"
                onClick={onSubmitClickHandler}
                text="text-orange-500"
        >
            {buttonTextSubmit}
        </Button>
    </footer>
</div>