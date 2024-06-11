<script lang="ts">
    import Button from '$lib/frontend/components/Button.svelte'
    import type {SvelteComponent} from 'svelte'
    import CloseCircleIcon from '~icons/mdi/close-circle'

    export let title: string | undefined
    export let body: string | undefined
    export let isHtml: boolean = false
    export let isFull = false
    export let background = 'bg-white'
    export let parent: SvelteComponent
    export let buttonTextCancel: string | undefined = undefined
    export let buttonTextSubmit: string | undefined = undefined
    export let submitButtonDisabled = false
    export let onSubmitClickHandler: () => Promise<void>
    export let onCancelClickHandler: (() => void) | undefined = undefined
</script>

<div class={`${background} ${isFull ? 'w-screen h-screen overflow-scroll pb-5' : 'w-full'} flex flex-col gap-7 items-center rounded-md`}>
    <header
            class=" w-full flex  justify-between items-center text-md font-bold uppercase bg-green-50 h-14 text-center p-3 text-black rounded-t-md">
        <p>{title }</p>
        <button class="w-8 h-8 flex items-center justify-center rounded-full" data-testid="close-modal-button"
                on:click={onCancelClickHandler ?? parent.onClose}>
            <CloseCircleIcon/>
        </button>
    </header>
    {#if isHtml}
        <div class="px-3 text-slate-600">{@html body}</div>
    {:else if body}
        <p class="w-11/12 text-start text-slate-600">{body}</p>
    {/if}
    <slot/>
    {#if buttonTextCancel || buttonTextSubmit}
        <footer class="w-11/12 flex flex-row md:justify-between gap-2 mb-5">
            {#if buttonTextCancel}
                <Button
                        background="bg-white hover:bg-orange-50"
                        classNames="w-full md:w-2/3 btn {parent.buttonNeutral}  h-12"
                        id="cancel-button"
                        onClick={onCancelClickHandler ?? parent.onClose}>
                    {buttonTextCancel}
                </Button>
            {/if}
            {#if buttonTextSubmit}
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
            {/if}
        </footer>
    {/if}
</div>
